"use client";

import React from "react";
import { useCreateTaskModal } from "../hooks/useCreateTaskModal";
import ResponsiveModal from "@/components/ResponsiveModal";
import CreateTaskFormWrapper from "./CreateTaskFormWrapper";

const CreateTaskModal = () => {
  const { isOpen, setIsOpen, close } = useCreateTaskModal();

  return (
    <ResponsiveModal open={isOpen} onOpenChange={setIsOpen}>
      <CreateTaskFormWrapper onCancel={close}></CreateTaskFormWrapper>
    </ResponsiveModal>
  );
};

export default CreateTaskModal;
