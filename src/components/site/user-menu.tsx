"use client";

import Link from "next/link";
import { CalendarDays, Heart, LayoutDashboard, LogOut, Search, User } from "lucide-react";
import { UserAvatar } from "@/components/common/user-avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { logout } from "@/app/(auth)/actions";
import type { User as SfUser } from "@/lib/types";

export function UserMenu({ user }: { user: Pick<SfUser, "name" | "email" | "role" | "profile_image"> }) {
  const isConsole = user.role === "admin" || user.role === "agent";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-2 rounded-full p-0.5 pr-0.5 outline-none focus-visible:ring-3 focus-visible:ring-ring/50 sm:pr-3 sm:hover:bg-muted">
        <UserAvatar name={user.name} src={user.profile_image} />
        <span className="hidden max-w-32 truncate text-sm font-medium sm:block">{user.name.split(" ")[0]}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-60">
        <DropdownMenuLabel className="font-normal">
          <p className="truncate font-semibold">{user.name}</p>
          <p className="truncate text-xs text-muted-foreground">{user.email}</p>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {isConsole && (
            <DropdownMenuItem asChild>
              <Link href="/dashboard">
                <LayoutDashboard /> Dashboard
              </Link>
            </DropdownMenuItem>
          )}
          <DropdownMenuItem asChild>
            <Link href="/explore">
              <Search /> Explore flats
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/saved">
              <Heart /> Saved flats
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/visits">
              <CalendarDays /> My visits
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href={isConsole ? "/dashboard/profile" : "/profile"}>
              <User /> Profile
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <form action={logout}>
          <DropdownMenuItem asChild variant="destructive">
            <button type="submit" className="w-full">
              <LogOut /> Sign out
            </button>
          </DropdownMenuItem>
        </form>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
