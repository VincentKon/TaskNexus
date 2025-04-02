import {
  DATABASES_ID,
  IMAGES_BUCKET_ID,
  PROJECTS_ID,
  TASKS_ID,
} from "@/config";
import { getMember } from "@/features/members/utils";
import { sessionMiddleware } from "@/lib/session-middleware";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { ID, Query } from "node-appwrite";
import { z } from "zod";
import { createProjectSchema, updateProjectSchema } from "../schemas";
import { Project } from "../types";
import { endOfMonth, startOfDay, startOfMonth, subMonths } from "date-fns";
import { TaskStatus } from "@/features/tasks/types";

const app = new Hono()
  .get(
    "/",
    sessionMiddleware,
    zValidator("query", z.object({ workspaceId: z.string() })),
    async (c) => {
      const user = c.get("user");
      const databases = c.get("databases");

      const { workspaceId } = c.req.valid("query");
      if (!workspaceId) {
        return c.json({ error: "Missing workspaceId" }, 400);
      }

      const member = await getMember({
        databases,
        workspaceId,
        userId: user.$id,
      });

      if (!member) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const projects = await databases.listDocuments<Project>(
        DATABASES_ID,
        PROJECTS_ID,
        [Query.equal("workspaceId", workspaceId), Query.orderDesc("$createdAt")]
      );
      return c.json({ data: projects });
    }
  )
  .get("/:projectId", sessionMiddleware, async (c) => {
    const user = c.get("user");
    const databases = c.get("databases");
    const { projectId } = c.req.param();

    const project = await databases.getDocument<Project>(
      DATABASES_ID,
      PROJECTS_ID,
      projectId
    );
    const member = await getMember({
      databases,
      workspaceId: project.workspaceId,
      userId: user.$id,
    });
    if (!member) {
      return c.json({ error: "Unauthorized" }, 401);
    }
    return c.json({ data: project });
  })
  .post(
    "/",
    sessionMiddleware,
    zValidator("form", createProjectSchema),
    async (c) => {
      const databases = c.get("databases");
      const storage = c.get("storage");
      const user = c.get("user");
      const { name, image, workspaceId } = c.req.valid("form");

      const member = await getMember({
        databases,
        workspaceId,
        userId: user.$id,
      });
      if (!member) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      let uploadedImageUrl: string | undefined;
      if (image instanceof File) {
        const file = await storage.createFile(
          IMAGES_BUCKET_ID,
          ID.unique(),
          image
        );

        const arrayBuffer = await storage.getFilePreview(
          IMAGES_BUCKET_ID,
          file.$id
        );

        uploadedImageUrl = `data:image/png;base64,${Buffer.from(
          arrayBuffer
        ).toString("base64")}`;
      }

      const project = await databases.createDocument(
        DATABASES_ID,
        PROJECTS_ID,
        ID.unique(),
        {
          name,
          imageUrl: uploadedImageUrl,
          workspaceId,
        }
      );

      return c.json({ data: project });
    }
  )
  .patch(
    "/:projectId",
    sessionMiddleware,
    zValidator("form", updateProjectSchema),
    async (c) => {
      const databases = c.get("databases");
      const storage = c.get("storage");
      const user = c.get("user");

      const { projectId } = c.req.param();
      const { name, image } = c.req.valid("form");

      const existingProject = await databases.getDocument<Project>(
        DATABASES_ID,
        PROJECTS_ID,
        projectId
      );

      const member = await getMember({
        databases,
        workspaceId: existingProject.workspaceId,
        userId: user.$id,
      });

      if (!member) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      let uploadedImageUrl: string | undefined;
      if (image instanceof File) {
        const file = await storage.createFile(
          IMAGES_BUCKET_ID,
          ID.unique(),
          image
        );

        const arrayBuffer = await storage.getFilePreview(
          IMAGES_BUCKET_ID,
          file.$id
        );

        uploadedImageUrl = `data:image/png;base64,${Buffer.from(
          arrayBuffer
        ).toString("base64")}`;
      } else {
        uploadedImageUrl = image;
      }

      const project = await databases.updateDocument(
        DATABASES_ID,
        PROJECTS_ID,
        projectId,
        { name, imageUrl: uploadedImageUrl }
      );
      return c.json({ data: project });
    }
  )
  .delete("/:projectId", sessionMiddleware, async (c) => {
    const databases = c.get("databases");
    const user = c.get("user");

    const { projectId } = c.req.param();

    const existingProject = await databases.getDocument<Project>(
      DATABASES_ID,
      PROJECTS_ID,
      projectId
    );

    const member = await getMember({
      databases,
      workspaceId: existingProject.workspaceId,
      userId: user.$id,
    });

    if (!member) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    await databases.deleteDocument(DATABASES_ID, PROJECTS_ID, projectId);
    return c.json({ data: { id: existingProject.$id } });
  })
  .get("/:projectId/analytics", sessionMiddleware, async (c) => {
    try {
      const user = c.get("user");
      const databases = c.get("databases");
      const { projectId } = c.req.param();

      const project = await databases.getDocument<Project>(
        DATABASES_ID,
        PROJECTS_ID,
        projectId
      );

      if (!project) {
        return c.json({ error: "Project not found" }, 404);
      }

      const member = await getMember({
        databases,
        workspaceId: project.workspaceId,
        userId: user.$id,
      });

      if (!member) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const now = new Date();
      const thisMonthStart = startOfMonth(now);
      const thisMonthEnd = startOfDay(endOfMonth(now));
      const lastMonthStart = startOfMonth(subMonths(now, 1));
      const lastMonthEnd = startOfDay(endOfMonth(subMonths(now, 1)));

      const queries = [
        Query.equal("projectId", projectId),
        Query.greaterThanEqual("$createdAt", thisMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", thisMonthEnd.toISOString()),
      ];

      const lastMonthQueries = [
        Query.equal("projectId", projectId),
        Query.greaterThanEqual("$createdAt", lastMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", lastMonthEnd.toISOString()),
      ];

      // Fetch all tasks in bulk
      const [
        thisMonthTasks,
        lastMonthTasks,
        thisMonthCompleteTasks,
        lastMonthCompleteTasks,
        thisMonthIncompleteTasks,
        lastMonthIncompleteTasks,
        thisMonthOverdueTasks,
        lastMonthOverdueTasks,
        thisMonthAssignedTasks,
        lastMonthAssignedTasks,
      ] = await Promise.all([
        databases.listDocuments(DATABASES_ID, TASKS_ID, queries),
        databases.listDocuments(DATABASES_ID, TASKS_ID, lastMonthQueries),
        databases.listDocuments(DATABASES_ID, TASKS_ID, [
          ...queries,
          Query.equal("status", TaskStatus.DONE),
        ]),
        databases.listDocuments(DATABASES_ID, TASKS_ID, [
          ...lastMonthQueries,
          Query.equal("status", TaskStatus.DONE),
        ]),
        databases.listDocuments(DATABASES_ID, TASKS_ID, [
          ...queries,
          Query.notEqual("status", TaskStatus.DONE),
        ]),
        databases.listDocuments(DATABASES_ID, TASKS_ID, [
          ...lastMonthQueries,
          Query.notEqual("status", TaskStatus.DONE),
        ]),
        databases.listDocuments(DATABASES_ID, TASKS_ID, [
          ...queries,
          Query.notEqual("status", TaskStatus.DONE),
          Query.lessThan("dueDate", now.toISOString()),
        ]),
        databases.listDocuments(DATABASES_ID, TASKS_ID, [
          ...lastMonthQueries,
          Query.notEqual("status", TaskStatus.DONE),
          Query.lessThan("dueDate", now.toISOString()),
        ]),
        databases.listDocuments(DATABASES_ID, TASKS_ID, [
          ...queries,
          Query.equal("assigneeId", member.$id),
        ]),
        databases.listDocuments(DATABASES_ID, TASKS_ID, [
          ...lastMonthQueries,
          Query.equal("assigneeId", member.$id),
        ]),
      ]);

      return c.json({
        data: {
          taskCount: thisMonthTasks.total,
          taskDifference: thisMonthTasks.total - lastMonthTasks.total,
          completeTaskCount: thisMonthCompleteTasks.total,
          completeTaskDifference:
            thisMonthCompleteTasks.total - lastMonthCompleteTasks.total,
          incompleteTaskCount: thisMonthIncompleteTasks.total,
          incompleteTaskDifference:
            thisMonthIncompleteTasks.total - lastMonthIncompleteTasks.total,
          overdueTaskCount: thisMonthOverdueTasks.total,
          overdueTaskDifference:
            thisMonthOverdueTasks.total - lastMonthOverdueTasks.total,
          assignedTaskCount: thisMonthAssignedTasks.total,
          assignedTaskDifference:
            thisMonthAssignedTasks.total - lastMonthAssignedTasks.total,
        },
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        return c.json(
          { error: "Internal Server Error", message: error.message },
          500
        );
      }
      return c.json(
        {
          error: "Internal Server Error",
          message: "An unknown error occurred",
        },
        500
      );
    }
  });

export default app;
