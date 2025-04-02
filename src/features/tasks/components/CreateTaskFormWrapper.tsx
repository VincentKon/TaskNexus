import { Card, CardContent } from "@/components/ui/card";
import { useGetMembers } from "@/features/members/api/useGetMembers";
import { useGetProjects } from "@/features/projects/api/useGetProjects";
import { useWorkspaceId } from "@/features/workspaces/hooks/useWorkspaceId";
import { Loader } from "lucide-react";
import React from "react";
import CreateTaskForm from "./CreateTaskForm";

interface CreateTaskFormWrapperProps {
  onCancel: () => void;
}

const CreateTaskFormWrapper = ({ onCancel }: CreateTaskFormWrapperProps) => {
  const workspaceId = useWorkspaceId();

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

  const isLoading = isLoadingMembers || isLoadingProjects;

  if (isLoading) {
    return (
      <Card className="w-full h-[714px] border-none shadow-none">
        <CardContent className="flex items-center justify-center h-full">
          <Loader className="size-5 animate-spin text-muted-foreground"></Loader>
        </CardContent>
      </Card>
    );
  }

  return (
    <CreateTaskForm
      onCancel={onCancel}
      projectOptions={projectOptions ?? []}
      memberOptions={memberOptions ?? []}
    ></CreateTaskForm>
  );
};

export default CreateTaskFormWrapper;
