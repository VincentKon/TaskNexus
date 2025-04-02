"use client";

import ResponsiveModal from "@/components/ResponsiveModal";
import React from "react";
import CreateProjectForm from "./CreateProjectForm";
import { useCreateProjectModal } from "../hooks/useCreateProjectModal";

const CreateProjectModal = () => {
  const { isOpen, setIsOpen, close } = useCreateProjectModal();

  return (
    <ResponsiveModal open={isOpen} onOpenChange={setIsOpen}>
      <CreateProjectForm onCancel={close}></CreateProjectForm>
    </ResponsiveModal>
  );
};

export default CreateProjectModal;
