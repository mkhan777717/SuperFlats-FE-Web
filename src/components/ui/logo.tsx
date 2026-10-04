import Link from "next/link";
import { Building2 } from "lucide-react";
import { SITE } from "@/lib/config";
import { cn } from "@/lib/cn";

export function Logo({ subtitle, light, href = "/", className }: { subtitle?: string; light?: boolean; href?: string; className?: string }) {
  return (
    <Link href={href} className={cn("flex items-center gap-3", className)} aria-label={`${SITE.name} home`}>
      <span className="grid size-11 place-items-center rounded-2xl hero-gradient text-white shadow-[var(--shadow-cta)]">
        <Building2 className="size-5" aria-hidden />
      </span>
      <span className="leading-tight">
        <span className={cn("block text-xl font-semibold", light ? "text-white" : "text-ink")}>{SITE.name}</span>
        {subtitle && <span className={cn("block text-sm", light ? "text-white/75" : "text-ink-soft")}>{subtitle}</span>}
      </span>
    </Link>
  );
}
