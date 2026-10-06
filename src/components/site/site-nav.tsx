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
    <nav aria-label="Main" className="hidden h-full items-stretch gap-6 md:flex">
      {links.map(({ href, label }) => {
        const active = isActive(pathname, href);
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "relative flex items-center text-[0.9375rem] font-medium transition-colors after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:rounded-full after:transition-colors",
              active ? "text-foreground after:bg-gold" : "text-muted-foreground after:bg-transparent hover:text-foreground",
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
