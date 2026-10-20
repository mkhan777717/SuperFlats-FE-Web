"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu } from "lucide-react";
import { Logo } from "@/components/common/logo";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

export type NavLink = { href: string; label: string };

const isActive = (pathname: string, href: string) =>
  href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`) || (href === "/explore" && pathname.startsWith("/listings"));

export function DesktopNav({ links }: { links: NavLink[] }) {
  const pathname = usePathname();
  return (
    <nav aria-label="Main" className="hidden h-full items-center gap-1.5 md:flex">
      {links.map(({ href, label }) => {
        const active = isActive(pathname, href);
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "rounded-full px-3.5 py-1.5 text-[13px] font-medium tracking-tight transition-all duration-200 active:scale-95",
              active
                ? "bg-black/[0.06] text-[#1d1d1f] font-semibold"
                : "text-[#1d1d1f]/75 hover:bg-black/[0.04] hover:text-[#1d1d1f]",
            )}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}

export function MobileNav({ links, signedIn }: { links: NavLink[]; signedIn: boolean }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden" aria-label="Open menu">
          <Menu className="size-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[85vw] max-w-sm">
        <SheetHeader>
          <SheetTitle asChild>
            <div>
              <Logo />
            </div>
          </SheetTitle>
        </SheetHeader>
        <nav aria-label="Mobile" className="grid gap-1 px-4">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              aria-current={isActive(pathname, href) ? "page" : undefined}
              className={cn(
                "rounded-xl px-4 py-3 font-medium",
                isActive(pathname, href) ? "bg-secondary text-secondary-foreground" : "hover:bg-muted",
              )}
            >
              {label}
            </Link>
          ))}
        </nav>
        {!signedIn && (
          <div className="mt-auto grid gap-2 p-4">
            <Button asChild size="lg" variant="outline">
              <Link href="/login" onClick={() => setOpen(false)}>
                Sign in
              </Link>
            </Button>
            <Button asChild size="lg">
              <Link href="/register" onClick={() => setOpen(false)}>
                Create free account
              </Link>
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
