import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const tones = {
  neutral: "bg-muted text-muted-foreground",
  primary: "bg-secondary text-secondary-foreground",
  success: "bg-success-soft text-success",
  warning: "bg-warning-soft text-warning",
  info: "bg-info-soft text-info",
  danger: "bg-destructive-soft text-destructive",
} as const;

export type Tone = keyof typeof tones;

export function StatusBadge({ tone = "neutral", dot, className, children }: { tone?: Tone; dot?: boolean; className?: string; children: ReactNode }) {
  return (
    <span className={cn("inline-flex h-6 items-center gap-1.5 rounded-full px-2.5 text-xs font-semibold whitespace-nowrap", tones[tone], className)}>
      {dot && <span className="size-1.5 rounded-full bg-current" aria-hidden />}
      {children}
    </span>
  );
}

/** One place that decides how each backend status looks. */
export const STATUS_TONE: Record<string, Tone> = {
  // appointments
  pending: "warning",
  confirmed: "info",
  completed: "success",
  cancelled: "danger",
  // listings
  active: "success",
  closed: "neutral",
  // flats
  available: "success",
  occupied: "primary",
  maintenance: "warning",
  // bookings
  ended: "neutral",
  // employees
  inactive: "neutral",
  // rent
  paid: "success",
  unpaid: "danger",
};

export function Status({ value, label }: { value: string; label?: string }) {
  return (
    <StatusBadge tone={STATUS_TONE[value] ?? "neutral"} dot>
      {label ?? value.charAt(0).toUpperCase() + value.slice(1)}
    </StatusBadge>
  );
}
