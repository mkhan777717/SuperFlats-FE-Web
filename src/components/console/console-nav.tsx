"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Building2,
  CalendarCheck,
  ChevronRight,
  FileText,
  IndianRupee,
  LayoutDashboard,
  Megaphone,
  Menu,
  ShieldCheck,
  UserCheck,
  UserCog,
  UserRound,
  Users,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import type { Role } from "@/lib/types";

type Item = { href: string; label: string; icon: LucideIcon };

function getItems(role?: Role): Item[] {
  if (role === "agent") {
    return [
      { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
      { href: "/dashboard/viewings", label: "My Viewings", icon: CalendarCheck },
      { href: "/dashboard/listings", label: "Active Listings", icon: Megaphone },
      { href: "/dashboard/properties", label: "Properties", icon: Building2 },
      { href: "/dashboard/tenants", label: "Tenants & Leads", icon: Users },
      { href: "/dashboard/bookings", label: "Bookings", icon: FileText },
      { href: "/dashboard/profile", label: "My Profile", icon: UserRound },
    ];
  }
  if (role === "super_admin") {
    return [
      { href: "/dashboard", label: "Platform Overview", icon: LayoutDashboard },
      { href: "/dashboard/properties", label: "All Properties", icon: Building2 },
      { href: "/dashboard/listings", label: "All Listings", icon: Megaphone },
      { href: "/dashboard/viewings", label: "Viewing Requests", icon: CalendarCheck },
      { href: "/dashboard/tenants", label: "All Tenants", icon: Users },
      { href: "/dashboard/bookings", label: "All Bookings", icon: FileText },
      { href: "/dashboard/rent", label: "Platform Revenue", icon: IndianRupee },
      { href: "/dashboard/team", label: "Owners & Agents", icon: UserCog },
      { href: "/dashboard/profile", label: "Master Profile", icon: UserRound },
    ];
  }
  return [
    { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard/properties", label: "Properties", icon: Building2 },
    { href: "/dashboard/listings", label: "Listings", icon: Megaphone },
    { href: "/dashboard/viewings", label: "Viewing requests", icon: CalendarCheck },
    { href: "/dashboard/tenants", label: "Tenants", icon: Users },
    { href: "/dashboard/bookings", label: "Bookings", icon: FileText },
    { href: "/dashboard/rent", label: "Rent", icon: IndianRupee },
    { href: "/dashboard/team", label: "Team", icon: UserCog },
    { href: "/dashboard/profile", label: "Profile", icon: UserRound },
  ];
}

const getRoleSubtitle = (role?: Role) => {
  if (role === "super_admin") return "Super Admin";
  if (role === "agent") return "Employee Portal";
  return "Owner Portal";
};

const isActive = (pathname: string, href: string) =>
  href === "/dashboard" ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);

function NavList({ role, onNavigate }: { role?: Role; onNavigate?: () => void }) {
  const pathname = usePathname();
  const items = getItems(role);

  return (
    <nav aria-label="Console" className="grid gap-1 font-sans">
      {items.map(({ href, label, icon: Icon }) => {
        const active = isActive(pathname, href);
        return (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex items-center gap-3 rounded-[14px] px-3.5 py-2.5 text-sm font-medium transition-all duration-200 tracking-[-0.01em]",
              active
                ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20"
                : "text-muted-foreground hover:bg-muted/80 hover:text-foreground",
            )}
          >
            <Icon className="size-[18px] stroke-[2.2]" aria-hidden />
            <span className="flex-1">{label}</span>
            {active && <ChevronRight className="size-4 opacity-75 stroke-[2.2]" aria-hidden />}
          </Link>
        );
      })}
    </nav>
  );
}

export function ConsoleSidebar({ role }: { role?: Role }) {
  const subtitle = getRoleSubtitle(role);

  return (
    <aside className="sticky top-0 hidden h-dvh w-64 shrink-0 flex-col border-r border-border/60 bg-card px-4 py-6 font-sans lg:flex">
      <Link href="/dashboard" className="flex items-center gap-3 px-2">
        <span className="grid size-11 place-items-center rounded-[16px] bg-gradient-to-br from-primary via-primary/95 to-ink text-gold shadow-md shadow-primary/20 ring-1 ring-white/10">
          <Building2 className="size-5 stroke-[2.2]" aria-hidden />
        </span>
        <div className="flex flex-col">
          <span className="font-display text-[1.15rem] font-bold tracking-tight text-foreground">SuperFlats</span>
          <span className="text-xs font-semibold text-muted-foreground">{subtitle}</span>
        </div>
      </Link>
      <div className="mt-8 flex-1 overflow-y-auto">
        <NavList role={role} />
      </div>
      <div className="border-t border-border/50 pt-4">
        <Link
          href="/"
          className="caps flex items-center justify-between px-3 text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          <span>View website</span>
          <ChevronRight className="size-3.5" aria-hidden />
        </Link>
      </div>
    </aside>
  );
}

export function ConsoleMobileNav({ role }: { role?: Role }) {
  const [open, setOpen] = useState(false);
  const subtitle = getRoleSubtitle(role);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open menu">
          <Menu className="size-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-72 border-r border-border/50 bg-card px-4 font-sans">
        <SheetHeader className="px-2">
          <SheetTitle asChild>
            <Link href="/dashboard" onClick={() => setOpen(false)} className="flex items-center gap-3 text-left">
              <span className="grid size-10 place-items-center rounded-[14px] bg-gradient-to-br from-primary via-primary/90 to-ink text-gold shadow-sm">
                <Building2 className="size-5 stroke-[2.2]" aria-hidden />
              </span>
              <div className="flex flex-col">
                <span className="font-display text-lg font-bold tracking-tight text-foreground">SuperFlats</span>
                <span className="text-xs font-semibold text-muted-foreground">{subtitle}</span>
              </div>
            </Link>
          </SheetTitle>
        </SheetHeader>
        <div className="mt-6">
          <NavList role={role} onNavigate={() => setOpen(false)} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
