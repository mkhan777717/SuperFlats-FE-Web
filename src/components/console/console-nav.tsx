"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Building2,
  CalendarCheck,
  FileText,
  IndianRupee,
  LayoutDashboard,
  Megaphone,
  Menu,
  UserCog,
  UserRound,
  Users,
  type LucideIcon,
} from "lucide-react";
import { Logo } from "@/components/common/logo";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

type Item = { href: string; label: string; icon: LucideIcon };

const ITEMS: Item[] = [
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

const isActive = (pathname: string, href: string) => (href === "/dashboard" ? pathname === href : pathname === href || pathname.startsWith(`${href}/`));

function NavList({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <nav aria-label="Console" className="grid gap-1">
      {ITEMS.map(({ href, label, icon: Icon }) => {
        const active = isActive(pathname, href);
        return (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex items-center gap-3 rounded-sm border-l-2 px-3 py-2.5 text-sm font-medium transition",
              active ? "border-gold bg-white/10 text-white" : "border-transparent text-white/65 hover:bg-white/5 hover:text-white",
            )}
          >
            <Icon className="size-[18px]" aria-hidden />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}

export function ConsoleSidebar() {
  return (
    <aside className="sticky top-0 hidden h-dvh w-64 shrink-0 flex-col bg-ink px-4 py-6 lg:flex">
      <Logo href="/dashboard" light tagline="Owner console" className="px-3" />
      <div className="mt-10 flex-1 overflow-y-auto">
        <NavList />
      </div>
      <Link href="/" className="caps px-3 text-white/50 hover:text-white">
        View website
      </Link>
    </aside>
  );
}

export function ConsoleMobileNav() {
  const [open, setOpen] = useState(false);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open menu">
          <Menu className="size-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-72 border-0 bg-ink px-4 text-white">
        <SheetHeader className="px-3">
          <SheetTitle asChild>
            <div>
              <Logo href="/dashboard" light tagline="Owner console" />
            </div>
          </SheetTitle>
        </SheetHeader>
        <NavList onNavigate={() => setOpen(false)} />
      </SheetContent>
    </Sheet>
  );
}
