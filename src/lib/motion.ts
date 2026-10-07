import type { Variants } from "motion/react";

/**
 * Shared motion tokens so every animation feels like the same product.
 * Entrances are short and ease out; nothing loops except decorative floats.
 */
export const EASE_OUT = [0.22, 1, 0.36, 1] as const;

export const DURATION = {
  fast: 0.18,
  base: 0.35,
  slow: 0.6,
} as const;

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: DURATION.slow, ease: EASE_OUT } },
};

export const staggerChildren = (stagger = 0.08, delay = 0): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren: stagger, delayChildren: delay } },
});
