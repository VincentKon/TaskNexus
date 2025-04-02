import { getCurrent } from "@/features/auth/queries";
import SignInCard from "@/features/auth/components/SignInCard";
import { redirect } from "next/navigation";
import React from "react";

const SignInPage = async () => {
  const user = await getCurrent();
  if (user) redirect("/");
  return <SignInCard></SignInCard>;
};

export default SignInPage;
