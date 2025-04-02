"use client";
import PageError from "@/components/PageError";
import PageLoader from "@/components/PageLoader";
import { Button } from "@/components/ui/button";
import { useGetProject } from "@/features/projects/api/useGetProject";
import { useGetProjectAnalytics } from "@/features/projects/api/useGetProjectAnalytics";
import ProjectAvatar from "@/features/projects/components/ProjectAvatar";
import { useProjectId } from "@/features/projects/hooks/useProjectId";
import Analytics from "@/features/tasks/components/Analytics";
import TaskViewSwitcher from "@/features/tasks/components/TaskViewSwitcher";
import { PencilIcon } from "lucide-react";
import Link from "next/link";
import React from "react";

const ProjectIdClient = () => {
  const projectId = useProjectId();
  const { data: project, isLoading: isLoadingProject } = useGetProject({
    projectId,
  });
  const { data: analytics, isLoading: isLoadingAnalytics } =
    useGetProjectAnalytics({
      projectId,
    });

  const isLoading = isLoadingProject || isLoadingAnalytics;
  if (isLoading) {
    return <PageLoader></PageLoader>;
  }
  if (!project) {
    return <PageError message="Project not found"></PageError>;
  }
  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-x-2">
          <ProjectAvatar
            name={project.name}
            image={project.imageUrl!}
            className="size-8"
          ></ProjectAvatar>
          <p className="text-lg font-semibold">{project.name}</p>
        </div>
        <div>
          <Button variant={"secondary"} size={"sm"} asChild>
            <Link
              href={`/workspaces/${project.workspaceId}/projects/${project.$id}/settings`}
            >
              <PencilIcon className="size-4 mr-2"></PencilIcon> Edit Project
            </Link>
          </Button>
        </div>
      </div>
      {analytics ? <Analytics data={analytics}></Analytics> : null}
      <TaskViewSwitcher hideProjectFilter></TaskViewSwitcher>
    </div>
  );
};

export default ProjectIdClient;
