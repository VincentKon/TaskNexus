"use client";

import React from "react";
import { useEditTaskModal } from "../hooks/useEditTaskModal";
import ResponsiveModal from "@/components/ResponsiveModal";
import EditTaskFormWrapper from "./EditTaskFormWrapper";

const EditTaskModal = () => {
  const { taskId, close } = useEditTaskModal();

  return (
    <ResponsiveModal open={!!taskId} onOpenChange={close}>
      {taskId && (
        <EditTaskFormWrapper id={taskId} onCancel={close}></EditTaskFormWrapper>
      )}
    </ResponsiveModal>
  );
};

export default EditTaskModal;
