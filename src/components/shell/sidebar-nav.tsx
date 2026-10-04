"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/cn";
import { isActive, TENANT_NAV } from "./nav";

export function SidebarNav() {
  const pathname = usePathname();
  return (
    <nav aria-label="Main" className="space-y-1.5 px-4">
      {TENANT_NAV.map(({ href, label, icon: Icon }) => {
        const active = isActive(pathname, href);
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex items-center gap-3 rounded-2xl px-4 py-3.5 text-[17px] transition",
              active ? "bg-brand-500 font-medium text-white shadow-[var(--shadow-cta)]" : "text-ink-soft hover:bg-muted hover:text-ink",
            )}
          >
            <Icon className="size-5" aria-hidden />
            <span className="flex-1">{label}</span>
            {active && <ChevronRight className="size-4" aria-hidden />}
          </Link>
        );
      })}
    </nav>
  );
}

export function BottomNav() {
  const pathname = usePathname();
  return (
    <nav
      aria-label="Main"
      className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-4 border-t border-line bg-surface/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden"
    >
      {TENANT_NAV.map(({ href, label, icon: Icon }) => {
        const active = isActive(pathname, href);
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={cn("flex flex-col items-center gap-1 py-2.5 text-xs", active ? "font-medium text-brand-600" : "text-ink-faint")}
          >
            <Icon className="size-5" aria-hidden />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
