"use client";

import ResponsiveModal from "@/components/ResponsiveModal";
import React from "react";
import CreateWorkspaceForm from "./CreateWorkspaceForm";
import { useCreateWorkspaceModal } from "../hooks/useCreateWorkspaceModal";

const CreateWorkspaceModal = () => {
  const { isOpen, setIsOpen, close } = useCreateWorkspaceModal();

  return (
    <ResponsiveModal open={isOpen} onOpenChange={setIsOpen}>
      <CreateWorkspaceForm onCancel={close}></CreateWorkspaceForm>
    </ResponsiveModal>
  );
};

export default CreateWorkspaceModal;
