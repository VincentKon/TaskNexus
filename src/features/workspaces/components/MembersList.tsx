"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeftIcon, MoreVerticalIcon } from "lucide-react";
import Link from "next/link";
import React, { Fragment } from "react";
import { useWorkspaceId } from "../hooks/useWorkspaceId";
import DottedSeparator from "@/components/DottedSeparator";
import { useGetMembers } from "@/features/members/api/useGetMembers";
import MemberAvatar from "@/features/members/components/MemberAvatar";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDeleteMember } from "@/features/members/api/useDeleteMember";
import { useUpdateMember } from "@/features/members/api/useUpdateMember";
import { MemberRole } from "@/features/members/types";
import Confirm from "@/hooks/Confirm";
import { Badge } from "@/components/ui/badge";

const MembersList = () => {
  const workspaceId = useWorkspaceId();
  const { data } = useGetMembers({ workspaceId });
  console.log(data);
  const [ConfirmDialog, confirm] = Confirm(
    "Remove Member",
    "This member will be removed from the workspace",
    "destructive"
  );

  const { mutate: deleteMember, isPending: isDeletingMember } =
    useDeleteMember();
  const { mutate: updateMember, isPending: isUpdatingMember } =
    useUpdateMember();

  const handleUpdateMember = (memberId: string, role: MemberRole) => {
    updateMember({
      json: { role },
      param: { memberId },
    });
  };

  const handleDeleteMember = async (memberId: string) => {
    const ok = await confirm();
    if (!ok) return;
    deleteMember(
      { param: { memberId } },
      {
        onSuccess: () => {
          window.location.reload();
        },
      }
    );
  };
  const currentUserId = data?.currentUserId ?? "";
  const currentUserRole = data?.currentUserRole ?? MemberRole.MEMBER;

  return (
    <Card className="w-full h-full border-none shadow-md rounded-xl bg-white">
      <ConfirmDialog />
      <CardHeader className="flex flex-row items-center gap-x-4 p-7 bg-gray-100 rounded-t-xl">
        <Button asChild variant="secondary" size="sm">
          <Link
            href={`/workspaces/${workspaceId}`}
            className="flex items-center gap-2"
          >
            <ArrowLeftIcon className="size-4" />
            Back
          </Link>
        </Button>
        <CardTitle className="text-xl font-bold">Members List</CardTitle>
      </CardHeader>
      <div className="px-7">
        <DottedSeparator />
      </div>
      <CardContent className="p-7 space-y-4">
        {data?.data.documents.map((member, index) => (
          <Fragment key={member.$id}>
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg shadow-sm">
              <MemberAvatar
                className="size-10"
                fallbackClassName="text-lg"
                name={member.name}
              />
              <div className="flex flex-col flex-grow">
                <p className="text-sm font-medium">{member.name}</p>
                <p className="text-xs text-gray-500">{member.email}</p>
              </div>
              <Badge
                variant={
                  member.role === MemberRole.ADMIN ? "default" : "outline"
                }
                className={
                  member.role === MemberRole.ADMIN
                    ? "bg-blue-600 text-white"
                    : "border-gray-400 text-gray-700"
                }
              >
                {member.role === MemberRole.ADMIN ? "Admin" : "Member"}
              </Badge>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="ml-auto" variant="ghost" size="icon">
                    <MoreVerticalIcon className="size-4 text-gray-500" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent side="bottom" align="end" className="w-48">
                  <DropdownMenuItem
                    className="font-medium text-gray-700 hover:bg-gray-100"
                    onClick={() =>
                      handleUpdateMember(member.$id, MemberRole.ADMIN)
                    }
                    disabled={
                      member.role === MemberRole.ADMIN || // If already an admin, disable
                      isUpdatingMember || // If updating, disable
                      currentUserRole === MemberRole.MEMBER // If current user is USER, disable all except Leave
                    }
                  >
                    Set as Administrator
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    className="font-medium text-gray-700 hover:bg-gray-100"
                    onClick={() =>
                      handleUpdateMember(member.$id, MemberRole.MEMBER)
                    }
                    disabled={
                      member.role === MemberRole.MEMBER || // If already a member, disable
                      isUpdatingMember || // If updating, disable
                      currentUserRole === MemberRole.MEMBER // If current user is USER, disable all except Leave
                    }
                  >
                    Set as Member
                  </DropdownMenuItem>

                  {/* Remove Member */}
                  {member.$id !== currentUserId && ( // Hide if it's the current user
                    <DropdownMenuItem
                      className="font-medium text-red-600 hover:bg-red-100"
                      onClick={() => handleDeleteMember(member.$id)}
                      disabled={
                        member.role === MemberRole.ADMIN || // Disable if admin
                        isDeletingMember || // Disable if deleting
                        currentUserRole === MemberRole.MEMBER // If current user is USER, disable all except Leave
                      }
                    >
                      Remove {member.name}
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            {index < data.data.documents.length - 1 && (
              <Separator className="my-3" />
            )}
          </Fragment>
        ))}
      </CardContent>
      {currentUserRole !== MemberRole.ADMIN && (
        <div className="px-7 pb-7">
          <Button
            variant="destructive"
            className="w-full"
            onClick={() => handleDeleteMember(currentUserId)}
          >
            Leave Workspace
          </Button>
        </div>
      )}
    </Card>
  );
};

export default MembersList;
