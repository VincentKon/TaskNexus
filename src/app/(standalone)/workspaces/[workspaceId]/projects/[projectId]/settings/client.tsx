"use client";
import PageError from "@/components/PageError";
import PageLoader from "@/components/PageLoader";
import { useGetProject } from "@/features/projects/api/useGetProject";
import EditProjectForm from "@/features/projects/components/EditProjectForm";
import { useProjectId } from "@/features/projects/hooks/useProjectId";
import React from "react";

const ProjectIdSettingsClient = () => {
  const projectId = useProjectId();
  const { data: initialValues, isLoading } = useGetProject({ projectId });

  if (isLoading) {
    return <PageLoader></PageLoader>;
  }
  if (!initialValues) {
    return <PageError message="Project not found"></PageError>;
  }

  return (
    <div className="w-full lg:max-w-xl">
      <EditProjectForm initialValues={initialValues}></EditProjectForm>
    </div>
  );
};

export default ProjectIdSettingsClient;
