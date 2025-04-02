import { Project } from "@/features/projects/types";
import React from "react";
import { Task } from "../types";
import ProjectAvatar from "@/features/projects/components/ProjectAvatar";
import Link from "next/link";
import { useWorkspaceId } from "@/features/workspaces/hooks/useWorkspaceId";
import { ChevronRightIcon, TrashIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDeleteTask } from "../api/useDeleteTask";
import Confirm from "@/hooks/Confirm";
import { useRouter } from "next/navigation";

interface TaskBreadcrumbsProps {
  project: Project;
  task: Task;
}

const TaskBreadcrumbs = ({ project, task }: TaskBreadcrumbsProps) => {
  const router = useRouter();
  const workspaceId = useWorkspaceId();

  const { mutate, isPending } = useDeleteTask();
  const [ConfirmDialog, confirm] = Confirm(
    "Delete task",
    "This action cannot be undone.",
    "destructive"
  );

  const handleDeleteTask = async () => {
    const ok = await confirm();
    if (!ok) return;
    mutate(
      { param: { taskId: task.$id } },
      {
        onSuccess: () => {
          router.push(`/workspaces/${workspaceId}/tasks`);
        },
      }
    );
  };

  return (
    <div className="flex items-center gap-x-2">
      <ConfirmDialog></ConfirmDialog>
      <ProjectAvatar
        name={project.name}
        image={project.imageUrl}
        className="size-6 lg:size-8"
      ></ProjectAvatar>
      <Link href={`/workspaces/${workspaceId}/projects/${project.$id}`}>
        <p className="text-sm lg:text-lg font-semibold text-muted-foreground hover:opacity-75 transition">
          {project.name}
        </p>
      </Link>
      <ChevronRightIcon className="size-4 lg:size-5 text-muted-foreground"></ChevronRightIcon>
      <p className="text-sm lg:text-lg font-semibold">{task.name}</p>
      <Button
        onClick={handleDeleteTask}
        disabled={isPending}
        className="ml-auto"
        variant={"destructive"}
        size={"sm"}
      >
        <TrashIcon className="size-4 lg:mr-2"></TrashIcon>
        <span className="hidden lg:block">Delete Task</span>
      </Button>
    </div>
  );
};

export default TaskBreadcrumbs;
