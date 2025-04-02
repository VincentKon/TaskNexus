import React from "react";
import { Task } from "../types";
import { MoreHorizontal } from "lucide-react";
import TaskActions from "./TaskActions";
import DottedSeparator from "@/components/DottedSeparator";
import MemberAvatar from "@/features/members/components/MemberAvatar";
import TaskDate from "./TaskDate";
import ProjectAvatar from "@/features/projects/components/ProjectAvatar";

interface KanbanCardProps {
  task: Task;
}

const KanbanCard = ({ task }: KanbanCardProps) => {
  return (
    <div className="bg-white p-2.5 mb-1.5 rounded shadow-sm space-y-3">
      <div className="flex items-start justify-between gap-x-2">
        <p className="text-sm line-clamp-2">{task.name}</p>
        <TaskActions id={task.$id} projectId={task.projectId}>
          <MoreHorizontal className="size-[18px] stroke-1 shrink-0 text-neutral-700 hover:opacity-75 transition"></MoreHorizontal>
        </TaskActions>
      </div>
      <DottedSeparator></DottedSeparator>
      <div className="flex items-center gap-x-1.5">
        <MemberAvatar
          name={task.assignee.name}
          fallbackClassName="text-[10px]"
        ></MemberAvatar>
        <div className="size-1 rounded-full bg-neutral-300"></div>
        <TaskDate value={task.dueDate} className="text-xs"></TaskDate>
      </div>
      <div className="flex items-center gap-x-1.5">
        <ProjectAvatar
          name={task.project.name}
          image={task.project.imageUrl}
          fallbackClassName="text-[10px]"
        ></ProjectAvatar>
        <span className="text-xs font-medium">{task.project.name}</span>
      </div>
    </div>
  );
};

export default KanbanCard;
