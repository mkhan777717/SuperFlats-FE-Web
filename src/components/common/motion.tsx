"use client";

import { motion, type HTMLMotionProps } from "motion/react";
import { fadeUp, staggerChildren } from "@/lib/motion";

/**
 * Small client wrappers so Server Components can opt into motion without becoming
 * client components themselves. Viewport animations run once.
 */
const VIEWPORT = { once: true, amount: 0.15 } as const;

/** Fades and rises into place when scrolled into view (or on mount with `onMount`). */
export function Reveal({ onMount, ...props }: HTMLMotionProps<"div"> & { onMount?: boolean }) {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      {...(onMount ? { animate: "show" } : { whileInView: "show", viewport: VIEWPORT })}
      {...props}
    />
  );
}

/** Parent that reveals its <StaggerItem> children one after another. */
export function Stagger({ onMount, stagger, delay, as = "div", ...props }: HTMLMotionProps<"div"> & { onMount?: boolean; stagger?: number; delay?: number; as?: "div" | "ul" }) {
  const Comp = as === "ul" ? motion.ul : motion.div;
  return (
    <Comp
      variants={staggerChildren(stagger, delay)}
      initial="hidden"
      {...(onMount ? { animate: "show" } : { whileInView: "show", viewport: VIEWPORT })}
      {...(props as HTMLMotionProps<"div"> & HTMLMotionProps<"ul">)}
    />
  );
}

export function StaggerItem({ as = "div", ...props }: HTMLMotionProps<"div"> & { as?: "div" | "li" }) {
  const Comp = as === "li" ? motion.li : motion.div;
  return <Comp variants={fadeUp} {...(props as HTMLMotionProps<"div"> & HTMLMotionProps<"li">)} />;
}

