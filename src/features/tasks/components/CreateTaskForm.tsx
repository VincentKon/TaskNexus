"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import DottedSeparator from "@/components/DottedSeparator";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCreateTask } from "../api/useCreateTask";
import { cn } from "@/lib/utils";
import { createTaskSchema } from "../schemas";
import { useWorkspaceId } from "@/features/workspaces/hooks/useWorkspaceId";
import DatePicker from "@/components/DatePicker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import MemberAvatar from "@/features/members/components/MemberAvatar";
import { TaskStatus } from "../types";
import ProjectAvatar from "@/features/projects/components/ProjectAvatar";

interface CreateTaskFormProps {
  onCancel?: () => void;
  projectOptions: { id: string; name: string; imageUrl: string }[];
  memberOptions: { id: string; name: string }[];
}

const CreateTaskForm = ({
  onCancel,
  projectOptions,
  memberOptions,
}: CreateTaskFormProps) => {
  const workspaceId = useWorkspaceId();
  const { mutate, isPending } = useCreateTask();

  const form = useForm<z.infer<typeof createTaskSchema>>({
    resolver: zodResolver(createTaskSchema), // Don't omit workspaceId here
    defaultValues: {
      name: "",
      status: TaskStatus.BACKLOG, // Add default values for other fields as well
      projectId: "",
      assigneeId: "",
      dueDate: new Date(),
      description: "",
      workspaceId: workspaceId, // Set workspaceId here
    },
  });

  const onSubmit = (values: z.infer<typeof createTaskSchema>) => {
    mutate(
      { json: { ...values, workspaceId } }, // Ensure workspaceId is included
      {
        onSuccess: () => {
          form.reset();
          onCancel?.();
        },
      }
    );
  };

  return (
    <Card className="w-full h-full border-none shadow-none">
      <CardHeader className="flex p-7">
        <CardTitle className="text-xl font-bold">Create New Task</CardTitle>
      </CardHeader>
      <div className="px-7">
        <DottedSeparator></DottedSeparator>
      </div>
      <CardContent className="p-7">
        <Form {...form}>
          <form action="" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Task Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter task name"></Input>
                    </FormControl>
                    <FormMessage></FormMessage>
                  </FormItem>
                )}
              ></FormField>
              <FormField
                control={form.control}
                name="dueDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Due Date</FormLabel>
                    <FormControl>
                      <DatePicker {...field}></DatePicker>
                    </FormControl>
                    <FormMessage></FormMessage>
                  </FormItem>
                )}
              ></FormField>
              <FormField
                control={form.control}
                name="assigneeId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Assignee</FormLabel>
                    <Select
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder={"Select assignee"}
                          ></SelectValue>
                        </SelectTrigger>
                      </FormControl>
                      <FormMessage></FormMessage>
                      <SelectContent>
                        {memberOptions.map((member) => (
                          <SelectItem key={member.id} value={member.id}>
                            <div className="flex items-center gap-x-2">
                              <MemberAvatar
                                className="size-6"
                                name={member.name}
                              ></MemberAvatar>
                              {member.name}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              ></FormField>
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder={"Select status"}
                          ></SelectValue>
                        </SelectTrigger>
                      </FormControl>
                      <FormMessage></FormMessage>
                      <SelectContent>
                        <SelectItem value={TaskStatus.BACKLOG}>
                          Backlog
                        </SelectItem>
                        <SelectItem value={TaskStatus.IN_PROGRESS}>
                          In Progress
                        </SelectItem>
                        <SelectItem value={TaskStatus.IN_REVIEW}>
                          In Review
                        </SelectItem>
                        <SelectItem value={TaskStatus.TODO}>Todo</SelectItem>
                        <SelectItem value={TaskStatus.DONE}>Done</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              ></FormField>
              <FormField
                control={form.control}
                name="projectId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project</FormLabel>
                    <Select
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder={"Select project"}
                          ></SelectValue>
                        </SelectTrigger>
                      </FormControl>
                      <FormMessage></FormMessage>
                      <SelectContent>
                        {projectOptions.map((project) => (
                          <SelectItem key={project.id} value={project.id}>
                            <div className="flex items-center gap-x-2">
                              <ProjectAvatar
                                className="size-6"
                                name={project.name}
                                image={project.imageUrl}
                              ></ProjectAvatar>
                              {project.name}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              ></FormField>
            </div>
            <DottedSeparator className="py-7"></DottedSeparator>
            <div className="flex items-center justify-between">
              <Button
                type="button"
                size={"lg"}
                variant={"secondary"}
                onClick={onCancel}
                disabled={isPending}
                className={cn(!onCancel && "invisible")}
              >
                Cancel
              </Button>
              <Button type="submit" size={"lg"} disabled={isPending}>
                Create Task
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default CreateTaskForm;
