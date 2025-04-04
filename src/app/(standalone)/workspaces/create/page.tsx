import { getCurrent } from "@/features/auth/queries";
import CreateWorkspaceForm from "@/features/workspaces/components/CreateWorkspaceForm";
import { redirect } from "next/navigation";
import React from "react";

const WorkspaceCreateSpace = async () => {
  const user = await getCurrent();
  if (!user) redirect("/sign-in");
  return (
    <div className="w-full lg:max-w-xl">
      <CreateWorkspaceForm></CreateWorkspaceForm>
    </div>
  );
};

export default WorkspaceCreateSpace;
