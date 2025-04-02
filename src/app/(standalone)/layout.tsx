import { UserButton } from "@/features/auth/components/UserButton";
import { getCurrent } from "@/features/auth/queries";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";

interface StandaloneLayoutProps {
  children: React.ReactNode;
}

const StandaloneLayout = async ({ children }: StandaloneLayoutProps) => {
  const user = await getCurrent();

  if (!user) {
    console.warn("No user found. Redirecting...");
    redirect("/sign-in");
  }
  return (
    <main className="bg-white min-h-screen">
      <div className="mx-auto max-w-screen-2xl p-4">
        <nav className="flex justify-between items-center h-[73px]">
          <Link href={"/"}>
            <Image src={"/logo.svg"} alt="Logo" height={56} width={152}></Image>
          </Link>
          <UserButton></UserButton>
        </nav>
        <div className="flex flex-col items-center justify-center py-4">
          {children}
        </div>
      </div>
    </main>
  );
};

export default StandaloneLayout;
