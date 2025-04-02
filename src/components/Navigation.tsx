"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SettingsIcon, UserIcon } from "lucide-react";
import React from "react";
import {
  GoHome,
  GoHomeFill,
  GoCheckCircle,
  GoCheckCircleFill,
} from "react-icons/go";

import { useWorkspaceId } from "@/features/workspaces/hooks/useWorkspaceId";

import { cn } from "@/lib/utils";

const routes = [
  { label: "Home", href: "", icon: GoHome, activeIcon: GoHomeFill },
  {
    label: "My Tasks",
    href: "/tasks",
    icon: GoCheckCircle,
    activeIcon: GoCheckCircleFill,
  },
  {
    label: "Settings",
    href: "/settings",
    icon: SettingsIcon,
    activeIcon: SettingsIcon,
  },
  {
    label: "Members",
    href: "/members",
    icon: UserIcon,
    activeIcon: UserIcon,
  },
];

const Navigation = () => {
  const workspaceId = useWorkspaceId();
  const pathname = usePathname();
  return (
    <div className="flex flex-col">
      {routes.map((item) => {
        const fullHref = `/workspaces/${workspaceId}${item.href}`;
        const isActive = pathname === fullHref;
        const Icon = isActive ? item.activeIcon : item.icon;
        return (
          <Link key={item.href} href={fullHref}>
            <div
              className={cn(
                "flex items-center gap-2.5 p-2.5 rounded-md font-medium hover:text-primary transition text-neutral-500",
                isActive && "bg-white shadow-sm hover:opacity-100 text-primary"
              )}
            >
              <Icon className="size-5 text-neutral-500"></Icon>
              {item.label}
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default Navigation;
