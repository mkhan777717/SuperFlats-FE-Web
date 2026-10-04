import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const tones = {
  primary: "bg-secondary text-secondary-foreground",
  amber: "bg-warning-soft text-warning",
  green: "bg-success-soft text-success",
  blue: "bg-info-soft text-info",
  red: "bg-destructive-soft text-destructive",
} as const;

export function StatCard({
  label,
  value,
  icon: Icon,
  tone = "primary",
  hint,
  href,
}: {
  label: string;
  value: ReactNode;
  icon: LucideIcon;
  tone?: keyof typeof tones;
  hint?: ReactNode;
  href?: string;
}) {
  const body = (
    <>
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <span className={cn("grid size-9 shrink-0 place-items-center rounded-xl", tones[tone])}>
          <Icon className="size-[18px]" aria-hidden />
        </span>
      </div>
      <p className="mt-2 text-2xl font-bold tabular sm:text-[1.75rem]">{value}</p>
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
    </>
  );
  const cls = "block rounded-2xl border bg-card p-5 shadow-soft transition";
  return href ? (
    <Link href={href} className={cn(cls, "hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-lift")}>
      {body}
    </Link>
  ) : (
    <div className={cls}>{body}</div>
  );
}
