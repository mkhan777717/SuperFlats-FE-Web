"use client";

import { useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Tilts its content in 3D toward the cursor, with a soft light that follows it.
 * Off for touch screens and reduced motion, so phones stay fast and still.
 */
export function Tilt({ children, className, max = 5, scale = 1.01 }: { children: ReactNode; className?: string; max?: number; scale?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const frame = useRef(0);

  const enabled = () =>
    window.matchMedia("(hover: hover) and (pointer: fine)").matches && !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el || !enabled()) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      el.style.transform = `rotateX(${(-y * max).toFixed(2)}deg) rotateY(${(x * max).toFixed(2)}deg) scale(${scale})`;
      el.style.setProperty("--glare-x", `${(x + 0.5) * 100}%`);
      el.style.setProperty("--glare-y", `${(y + 0.5) * 100}%`);
    });
  };

  const onLeave = () => {
    cancelAnimationFrame(frame.current);
    if (ref.current) ref.current.style.transform = "";
  };

  return (
    <div className="h-full [perspective:1100px]">
      <div
        ref={ref}
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        className={cn("group/tilt relative h-full transition-transform duration-300 ease-out will-change-transform [transform-style:preserve-3d]", className)}
      >
        {children}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 z-20 rounded-[inherit] opacity-0 transition-opacity duration-300 [background:radial-gradient(circle_at_var(--glare-x,50%)_var(--glare-y,50%),rgb(255_255_255/0.18),transparent_50%)] group-hover/tilt:opacity-100"
        />
      </div>
    </div>
  );
}
