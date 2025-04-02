"use client";
import DottedSeparator from "@/components/DottedSeparator";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader, PlusIcon } from "lucide-react";
import React, { useCallback } from "react";
import { useCreateTaskModal } from "../hooks/useCreateTaskModal";
import { useWorkspaceId } from "@/features/workspaces/hooks/useWorkspaceId";
import { useGetTasks } from "../api/useGetTasks";
import { useQueryState } from "nuqs";
import DataFilters from "@/components/DataFilters";
import { useTaskFilters } from "../hooks/useTaskFilters";
import { DataTable } from "./DataTable";
import Columns from "./Columns";
import DataKanban from "./DataKanban";
import { TaskStatus } from "../types";
import { useBulkUpdateTasks } from "../api/useBulkUpdateTasks";
import DataCalendar from "./DataCalendar";
import { useProjectId } from "@/features/projects/hooks/useProjectId";

interface TaskViewSwitcherProps {
  hideProjectFilter?: boolean;
}

const TaskViewSwitcher = ({ hideProjectFilter }: TaskViewSwitcherProps) => {
  const [{ status, assigneeId, projectId, dueDate }] = useTaskFilters();
  const [view, setView] = useQueryState("task-view", {
    defaultValue: "table",
  });

  const workspaceId = useWorkspaceId();
  const paramProjectId = useProjectId();
  const { open } = useCreateTaskModal();
  const { mutate: bulkUpdate } = useBulkUpdateTasks();

  const { data: tasks, isLoading: isLoadingTasks } = useGetTasks({
    workspaceId,
    projectId: paramProjectId || projectId,
    assigneeId,
    status,
    dueDate,
  });

  const onKanbanChange = useCallback(
    (tasks: { $id: string; status: TaskStatus; position: number }[]) => {
      bulkUpdate({ json: { tasks } });
    },
    [bulkUpdate]
  );

  return (
    <Tabs
      defaultValue={view}
      onValueChange={setView}
      className="flex-1 w-full border rounded-lg"
    >
      <div className="h-full flex flex-col overflow-auto p-4">
        <div className="flex flex-col gap-y-2 lg:flex-row justify-between items-center">
          <TabsList className="w-full lg:w-auto">
            <TabsTrigger className="h-8 w-full lg:w-auto" value="table">
              Table
            </TabsTrigger>
            <TabsTrigger className="h-8 w-full lg:w-auto" value="kanban">
              Kanban
            </TabsTrigger>
            <TabsTrigger className="h-8 w-full lg:w-auto" value="calendar">
              Calendar
            </TabsTrigger>
          </TabsList>
          <Button size={"sm"} className="w-full lg:w-auto" onClick={open}>
            <PlusIcon className="size-4 mr-2"></PlusIcon>New
          </Button>
        </div>
        <DottedSeparator className="my-4"></DottedSeparator>
        <DataFilters hideProjectFilter={hideProjectFilter}></DataFilters>
        <DottedSeparator className="my-4"></DottedSeparator>
        {isLoadingTasks ? (
          <div className="w-full border rounded-lg h-[200px] flex flex-col items-center justify-center">
            <Loader className="size-5 animate-spin text-muted-foreground"></Loader>
          </div>
        ) : (
          <>
            <TabsContent className="mt-0" value="table">
              <DataTable
                columns={Columns}
                data={tasks?.documents ?? []}
              ></DataTable>
            </TabsContent>

            <TabsContent className="mt-0" value="kanban">
              <DataKanban
                data={tasks?.documents ?? []}
                onChange={onKanbanChange}
              ></DataKanban>
            </TabsContent>
            <TabsContent className="mt-0 h-full pb-4" value="calendar">
              <DataCalendar data={tasks?.documents ?? []}></DataCalendar>
            </TabsContent>
          </>
        )}
      </div>
    </Tabs>
  );
};

export default TaskViewSwitcher;
