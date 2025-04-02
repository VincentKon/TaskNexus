import { Card, CardContent } from "@/components/ui/card";
import { useGetMembers } from "@/features/members/api/useGetMembers";
import { useGetProjects } from "@/features/projects/api/useGetProjects";
import { useWorkspaceId } from "@/features/workspaces/hooks/useWorkspaceId";
import { Loader } from "lucide-react";
import React from "react";
import EditTaskForm from "./EditTaskForm";
import { useGetTask } from "../api/useGetTask";

interface EditTaskFormWrapperProps {
  onCancel: () => void;
  id: string;
}

const EditTaskFormWrapper = ({ onCancel, id }: EditTaskFormWrapperProps) => {
  const workspaceId = useWorkspaceId();

  const { data: initialValues, isLoading: isLoadingTask } = useGetTask({
    taskId: id,
  });

  const { data: projects, isLoading: isLoadingProjects } = useGetProjects({
    workspaceId,
  });
  const { data, isLoading: isLoadingMembers } = useGetMembers({
    workspaceId,
  });

  const projectOptions = projects?.documents.map((project) => ({
    id: project.$id,
    name: project.name,
    imageUrl: project.imageUrl,
  }));
  const memberOptions = data?.data.documents.map((member) => ({
    id: member.$id,
    name: member.name,
  }));

  const isLoading = isLoadingMembers || isLoadingProjects || isLoadingTask;

  if (isLoading) {
    return (
      <Card className="w-full h-[714px] border-none shadow-none">
        <CardContent className="flex items-center justify-center h-full">
          <Loader className="size-5 animate-spin text-muted-foreground"></Loader>
        </CardContent>
      </Card>
    );
  }

  if (!initialValues) return null;
  return (
    <EditTaskForm
      onCancel={onCancel}
      initialValues={initialValues}
      projectOptions={projectOptions ?? []}
      memberOptions={memberOptions ?? []}
    ></EditTaskForm>
  );
};

export default EditTaskFormWrapper;
