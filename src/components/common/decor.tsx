import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** A word set like a tilted sticker, with a dashed stitch inside: used once per headline. */
export function Sticker({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "relative mx-1 inline-block -rotate-2 rounded-full border-2 border-ink bg-primary px-[0.45em] py-[0.05em] text-primary-foreground shadow-[4px_4px_0_0_var(--ink)]",
        className,
      )}
    >
      <span aria-hidden className="pointer-events-none absolute inset-[5px] rounded-full border-2 border-dashed border-primary-foreground/60" />
      <span className="relative">{children}</span>
    </span>
  );
}

/** Soft wave that separates a coloured band from the section below it. */
export function Wave({ className, flip }: { className?: string; flip?: boolean }) {
  return (
    <svg viewBox="0 0 1440 48" preserveAspectRatio="none" className={cn("block h-6 w-full sm:h-10", flip && "rotate-180", className)} aria-hidden>
      <path d="M0 24c80-16 160-16 240 0s160 16 240 0 160-16 240 0 160 16 240 0 160-16 240 0 160 16 240 0v24H0Z" fill="currentColor" />
    </svg>
  );
}

/** Loose hand-drawn loop used as a faint background accent. */
export function Doodle({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 300" fill="none" className={cn("pointer-events-none", className)} aria-hidden>
      <path d="M20 220C60 120 160 40 250 70s70 150-20 170-150-60-90-140S330 40 380 90" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
