import { getCurrent } from "@/features/auth/queries";
import TaskViewSwitcher from "@/features/tasks/components/TaskViewSwitcher";
import { redirect } from "next/navigation";
import React from "react";

const TasksPage = async () => {
  const user = await getCurrent();
  if (!user) redirect("/sign-in");
  return (
    <div className="h-full flex flex-col">
      <TaskViewSwitcher></TaskViewSwitcher>;
    </div>
  );
};

export default TasksPage;
