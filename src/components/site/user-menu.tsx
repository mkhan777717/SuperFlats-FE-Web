"use client";

import Link from "next/link";
import { Building2, CalendarDays, Heart, LayoutDashboard, LogOut, Search, User } from "lucide-react";
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
  const isConsole = user.role === "admin" || user.role === "agent" || user.role === "super_admin";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="group flex items-center gap-2 rounded-full p-1 pr-1 outline-none transition-all sm:pr-3 hover:bg-black/[0.04] active:scale-95 border border-transparent hover:border-black/[0.04]">
        <UserAvatar name={user.name} src={user.profile_image} className="size-8 ring-2 ring-white/80 shadow-xs" />
        <span className="hidden max-w-32 truncate text-[13.5px] font-medium text-foreground sm:block">{user.name.split(" ")[0]}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64 p-2 rounded-[22px] bg-white/80 backdrop-blur-3xl border border-white/90 shadow-[0_24px_50px_rgba(0,0,0,0.12),0_0_0_1px_rgba(255,255,255,0.9)_inset]">
        <div className="flex items-center gap-3 p-2.5 mb-1 rounded-[16px] bg-white/70 border border-white/80 shadow-[inset_0_1px_2px_rgba(255,255,255,0.9)]">
          <UserAvatar name={user.name} src={user.profile_image} className="size-10 ring-2 ring-white shadow-xs" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13.5px] font-semibold text-[#1d1d1f] leading-snug">{user.name}</p>
            <p className="truncate text-[11.5px] text-[#86868b] leading-tight">{user.email}</p>
            <span className="inline-block mt-1 text-[10px] font-semibold uppercase tracking-wider text-gold-strong bg-gold/15 px-2 py-0.5 rounded-full">
              {user.role}
            </span>
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuGroup className="space-y-0.5">
          {isConsole ? (
            // Owner / Admin / Agent — show console links
            <>
              <DropdownMenuItem asChild>
                <Link href="/dashboard">
                  <LayoutDashboard /> Dashboard
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/dashboard/properties">
                  <Building2 /> My Properties
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/dashboard/viewings">
                  <CalendarDays /> Viewings
                </Link>
              </DropdownMenuItem>
            </>
          ) : (
            // Renter / Client — show browse links
            <>
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
            </>
          )}
          <DropdownMenuItem asChild>
            <Link href={isConsole ? "/dashboard/profile" : "/profile"}>
              <User /> Profile
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <form action={logout}>
          <DropdownMenuItem asChild variant="destructive">
            <button type="submit" className="w-full cursor-pointer">
              <LogOut /> Sign out
            </button>
          </DropdownMenuItem>
        </form>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
