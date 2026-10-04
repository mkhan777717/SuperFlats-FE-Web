import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function EmptyState({
  icon: Icon,
  title,
  children,
  action,
  className,
}: {
  icon: LucideIcon;
  title: string;
  children?: ReactNode;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col items-center rounded-2xl border border-dashed bg-card px-6 py-14 text-center", className)}>
      <span className="mb-4 grid size-12 place-items-center rounded-2xl bg-secondary text-secondary-foreground">
        <Icon className="size-5" aria-hidden />
      </span>
      <h3 className="text-base font-semibold">{title}</h3>
      {children && <p className="mt-1 max-w-sm text-sm text-muted-foreground">{children}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
