"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarDays, Heart, Search, User } from "lucide-react";
import { cn } from "@/lib/utils";

const TABS = [
  { href: "/explore", label: "Explore", icon: Search },
  { href: "/saved", label: "Saved", icon: Heart },
  { href: "/visits", label: "Visits", icon: CalendarDays },
  { href: "/profile", label: "Profile", icon: User },
];

const isActive = (pathname: string, href: string) =>
  pathname === href || pathname.startsWith(`${href}/`) || (href === "/explore" && pathname.startsWith("/listings"));

/** App-style bottom tabs for renters on phones. */
export function RenterTabBar() {
  const pathname = usePathname();
  return (
    <nav
      aria-label="Renter"
      className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-4 border-t bg-background/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-lg md:hidden"
    >
      {TABS.map(({ href, label, icon: Icon }) => {
        const active = isActive(pathname, href);
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={cn("flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium", active ? "text-primary" : "text-muted-foreground")}
          >
            <Icon className={cn("size-5", active && "fill-primary/15")} aria-hidden />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
