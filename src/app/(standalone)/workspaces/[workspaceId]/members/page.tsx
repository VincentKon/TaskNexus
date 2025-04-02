import { getCurrent } from "@/features/auth/queries";
import MembersList from "@/features/workspaces/components/MembersList";
import { redirect } from "next/navigation";
import React from "react";

const WorkspaceIdMembersPage = async () => {
  const user = getCurrent();
  if (!user) redirect("/sign-in");
  return (
    <div className="w-full lg:max-w-xl">
      <MembersList></MembersList>
    </div>
  );
};

export default WorkspaceIdMembersPage;
