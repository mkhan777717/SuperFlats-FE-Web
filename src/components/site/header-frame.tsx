"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Pages whose hero runs underneath the header. */
const OVERLAY_PAGES = ["/"];

/**
 * Sticky header that is fully transparent over the home hero and turns into a solid,
 * blurred bar as soon as the page scrolls. Everywhere else it is always solid.
 */
export function HeaderFrame({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const overlay = OVERLAY_PAGES.includes(pathname);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (!overlay) return;
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [overlay]);

  const transparent = overlay && !scrolled;

  return (
    <header
      data-transparent={transparent || undefined}
      className={cn(
        "sticky top-0 z-40 transition-[background-color,border-color,box-shadow] duration-300",
        transparent ? "border-b border-transparent bg-transparent" : "border-b bg-background/95 shadow-soft backdrop-blur",
      )}
    >
      {children}
    </header>
  );
}
