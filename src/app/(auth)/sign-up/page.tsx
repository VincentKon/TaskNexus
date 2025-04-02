import { getCurrent } from "@/features/auth/queries";
import SignUpCard from "@/features/auth/components/SignUpCard";
import { redirect } from "next/navigation";
import React from "react";

const SignUpPage = async () => {
  const user = await getCurrent();
  if (user) redirect("/");
  return <SignUpCard></SignUpCard>;
};

export default SignUpPage;
