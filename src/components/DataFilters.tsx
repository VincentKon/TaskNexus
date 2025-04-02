import { useGetMembers } from "@/features/members/api/useGetMembers";
import { useGetProjects } from "@/features/projects/api/useGetProjects";
import { useWorkspaceId } from "@/features/workspaces/hooks/useWorkspaceId";
import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { FolderIcon, ListCheckIcon, UserIcon } from "lucide-react";
import { TaskStatus } from "@/features/tasks/types";
import { useTaskFilters } from "@/features/tasks/hooks/useTaskFilters";
import DatePicker from "./DatePicker";

interface DataFiltersProps {
  hideProjectFilter?: boolean;
}

const DataFilters = ({ hideProjectFilter }: DataFiltersProps) => {
  const workspaceId = useWorkspaceId();

  const { data: projects, isLoading: isLoadingProjects } = useGetProjects({
    workspaceId,
  });
  const { data: members, isLoading: isLoadingMembers } = useGetMembers({
    workspaceId,
  });
  const isLoading = isLoadingMembers || isLoadingProjects;

  const projectOptions = projects?.documents.map((project) => ({
    value: project.$id,
    label: project.name,
  }));
  const memberOptions = members?.data.documents.map((member) => ({
    value: member.$id,
    label: member.name,
  }));

  const [{ status, assigneeId, projectId, dueDate }, setFilters] =
    useTaskFilters();

  const onStatusChange = (value: string) => {
    setFilters({ status: value === "ALL" ? null : (value as TaskStatus) });
  };
  const onAssigneeChange = (value: string) => {
    setFilters({ assigneeId: value === "ALL" ? null : (value as string) });
  };
  const onProjectChange = (value: string) => {
    setFilters({ projectId: value === "ALL" ? null : (value as string) });
  };

  if (isLoading) return null;

  return (
    <div className="flex flex-col lg:flex-row gap-2">
      <Select
        defaultValue={status ?? undefined}
        onValueChange={(value) => onStatusChange(value)}
      >
        <SelectTrigger className="w-full lg:w-auto h-8">
          <div className="flex items-center pr-2">
            <ListCheckIcon className="size-4 mr-2"></ListCheckIcon>
            <SelectValue placeholder="All Statuses"></SelectValue>
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">All Statuses</SelectItem>
          <SelectSeparator></SelectSeparator>
          <SelectItem value={TaskStatus.BACKLOG}>Backlog</SelectItem>
          <SelectItem value={TaskStatus.IN_PROGRESS}>In Progress</SelectItem>
          <SelectItem value={TaskStatus.IN_REVIEW}>In Review</SelectItem>
          <SelectItem value={TaskStatus.TODO}>Todo</SelectItem>
          <SelectItem value={TaskStatus.DONE}>Done</SelectItem>
        </SelectContent>
      </Select>

      <Select
        defaultValue={assigneeId ?? undefined}
        onValueChange={(value) => onAssigneeChange(value)}
      >
        <SelectTrigger className="w-full lg:w-auto h-8">
          <div className="flex items-center pr-2">
            <UserIcon className="size-4 mr-2"></UserIcon>
            <SelectValue placeholder="All Assignees"></SelectValue>
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={"ALL"}>All Assignees</SelectItem>
          <SelectSeparator></SelectSeparator>
          {memberOptions?.map((member) => (
            <SelectItem key={member.value} value={member.value}>
              {member.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {!hideProjectFilter && (
        <Select
          defaultValue={projectId ?? undefined}
          onValueChange={(value) => onProjectChange(value)}
        >
          <SelectTrigger className="w-full lg:w-auto h-8">
            <div className="flex items-center pr-2">
              <FolderIcon className="size-4 mr-2"></FolderIcon>
              <SelectValue placeholder="All Projects"></SelectValue>
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={"ALL"}>All Projects</SelectItem>
            <SelectSeparator></SelectSeparator>
            {projectOptions?.map((project) => (
              <SelectItem key={project.value} value={project.value}>
                {project.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
      <DatePicker
        placeholder="Due date"
        className="h-8 w-full lg:w-auto"
        value={dueDate ? new Date(dueDate) : undefined}
        onChange={(date) => {
          setFilters({ dueDate: date ? date.toISOString() : null });
        }}
      ></DatePicker>
    </div>
  );
};

export default DataFilters;
