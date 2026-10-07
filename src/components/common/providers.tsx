"use client";

import { MotionConfig } from "motion/react";
import type { ReactNode } from "react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

/** App-wide providers. The site uses a single light theme. */
export function Providers({ children }: { children: ReactNode }) {
  return (
    // "user": animations are skipped when the OS asks for reduced motion.
    <MotionConfig reducedMotion="user">
      <TooltipProvider delayDuration={200}>
        {children}
        <Toaster position="top-center" richColors closeButton />
      </TooltipProvider>
    </MotionConfig>
  );
}
