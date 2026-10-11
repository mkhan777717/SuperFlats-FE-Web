import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * iOS-style continuous squircle gradient backgrounds with crisp white SF-style symbols.
 * Vibrant, modern, and immune to dark-mode muddy color wash.
 */
const tones = {
  primary: "bg-gradient-to-br from-[#0B192C] to-[#1E3E62] text-[#F3C623] shadow-md shadow-slate-900/15 ring-1 ring-black/5",
  emerald: "bg-gradient-to-br from-[#34C759] to-[#248A3D] text-white shadow-md shadow-emerald-500/25 ring-1 ring-black/5",
  green: "bg-gradient-to-br from-[#34C759] to-[#248A3D] text-white shadow-md shadow-emerald-500/25 ring-1 ring-black/5",
  orange: "bg-gradient-to-br from-[#FF9500] to-[#E07A00] text-white shadow-md shadow-orange-500/25 ring-1 ring-black/5",
  amber: "bg-gradient-to-br from-[#FFCC00] to-[#D49E00] text-white shadow-md shadow-amber-500/25 ring-1 ring-black/5",
  blue: "bg-gradient-to-br from-[#007AFF] to-[#0051A8] text-white shadow-md shadow-blue-500/25 ring-1 ring-black/5",
  purple: "bg-gradient-to-br from-[#5856D6] to-[#3B38B0] text-white shadow-md shadow-indigo-500/25 ring-1 ring-black/5",
  red: "bg-gradient-to-br from-[#FF3B30] to-[#C92A2A] text-white shadow-md shadow-rose-500/25 ring-1 ring-black/5",
  cyan: "bg-gradient-to-br from-[#32ADE6] to-[#007EA7] text-white shadow-md shadow-cyan-500/25 ring-1 ring-black/5",
} as const;

export type StatCardTrend = {
  value: string;
  positive?: boolean;
};

export function StatCard({
  label,
  value,
  icon: Icon,
  tone = "primary",
  hint,
  href,
  trend,
}: {
  label: string;
  value: ReactNode;
  icon: LucideIcon;
  tone?: keyof typeof tones;
  hint?: ReactNode;
  href?: string;
  trend?: StatCardTrend;
}) {
  const body = (
    <>
      <div className="flex items-center justify-between gap-2">
        {/* iOS continuous squircle icon container with gradient */}
        <span
          className={cn(
            "grid size-[46px] shrink-0 place-items-center rounded-[16px] transition-transform duration-300 group-hover:scale-105",
            tones[tone] ?? tones.primary,
          )}
        >
          <Icon className="size-[22px] stroke-[2.3]" aria-hidden />
        </span>

        {/* Authentic iOS Trend Pill */}
        {trend && (
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold tracking-tight",
              trend.positive !== false
                ? "bg-[#E8FAF0] text-[#15803D] ring-1 ring-[#15803D]/20"
                : "bg-[#FEF2F2] text-[#DC2626] ring-1 ring-[#DC2626]/20",
            )}
          >
            {trend.positive !== false ? <TrendingUp className="size-3.5 stroke-[2.2]" /> : <TrendingDown className="size-3.5 stroke-[2.2]" />}
            {trend.value}
          </span>
        )}
      </div>

      <div className="mt-4">
        <p className="text-[1.85rem] font-bold tracking-tight text-slate-900 tabular sm:text-[2rem] leading-none">
          {value}
        </p>
        <p className="mt-1.5 text-[13px] font-medium text-slate-500 tracking-normal">{label}</p>
      </div>

      {hint && <p className="mt-2 text-xs text-slate-400">{hint}</p>}
    </>
  );

  const cardClass =
    "group block rounded-[22px] border border-slate-100 bg-white p-5 sm:p-6 shadow-[0_2px_10px_-2px_rgba(0,0,0,0.05),0_1px_3px_rgba(0,0,0,0.03)] transition-all duration-300 ease-out hover:border-slate-200 hover:shadow-[0_12px_28px_-6px_rgba(11,25,44,0.1)] hover:-translate-y-1";

  return href ? (
    <Link href={href} className={cardClass}>
      {body}
    </Link>
  ) : (
    <div className={cardClass}>{body}</div>
  );
}
