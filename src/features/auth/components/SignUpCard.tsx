"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import DottedSeparator from "@/components/DottedSeparator";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import Link from "next/link";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { signUpSchema } from "../schemas";
import { useSignUp } from "../api/useSignUp";
import { signUpWithGithub, signUpWithGoogle } from "@/lib/oauth";

const SignUpCard = () => {
  const { mutate, isPending } = useSignUp();

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });
  const onSubmit = (values: z.infer<typeof signUpSchema>) => {
    mutate({ json: values });
  };
  return (
    <Card className="w-full h-full md:w-[487px] border-none shadow-none">
      <CardHeader className="flex items-center justify-center text-center p-7">
        <CardTitle className="text-2xl">Sign Up</CardTitle>
        <CardDescription>
          By signing up, you agree to our{" "}
          <Link href={"/privacy"}>
            <span className="text-blue-700">Privacy Policy</span>
          </Link>{" "}
          and{" "}
          <Link href={"/terms"}>
            <span className="text-blue-700">Terms of Service</span>
          </Link>
        </CardDescription>
      </CardHeader>
      <div className="px-7">
        <DottedSeparator></DottedSeparator>
      </div>
      <CardContent className="p-7">
        <Form {...form}>
          <form
            action=""
            className="space-y-4"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FormField
              name="name"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      type="text"
                      placeholder="Enter your name"
                    ></Input>
                  </FormControl>
                  <FormMessage></FormMessage>
                </FormItem>
              )}
            ></FormField>
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      placeholder="Enter your email"
                    ></Input>
                  </FormControl>
                  <FormMessage></FormMessage>
                </FormItem>
              )}
            ></FormField>
            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      type="password"
                      placeholder="Enter your password"
                    ></Input>
                  </FormControl>
                  <FormMessage></FormMessage>
                </FormItem>
              )}
            ></FormField>

            <Button disabled={isPending} size={"lg"} className="w-full">
              Sign Up
            </Button>
          </form>
        </Form>
      </CardContent>
      <div className="pz-7">
        <DottedSeparator></DottedSeparator>
      </div>
      <CardContent className="p-7 flex flex-col gap-y-4">
        <Button
          disabled={isPending}
          variant={"secondary"}
          size={"lg"}
          className="w-full"
          onClick={() => signUpWithGoogle()}
        >
          <FcGoogle className="mr-2 size-5"></FcGoogle>
          Continue with Google
        </Button>
        <Button
          disabled={isPending}
          variant={"secondary"}
          size={"lg"}
          className="w-full"
          onClick={() => signUpWithGithub()}
        >
          <FaGithub className="mr-2 size-5"></FaGithub>
          Continue with Github
        </Button>
      </CardContent>
      <div className="px-7 ">
        <DottedSeparator></DottedSeparator>
      </div>
      <CardContent className="p-7 flex items-center justify-center">
        <p>Already have an account?</p>
        <Link href={"/sign-in"}>
          <span className="text-blue-700"> Sign In</span>
        </Link>
      </CardContent>
    </Card>
  );
};

export default SignUpCard;
