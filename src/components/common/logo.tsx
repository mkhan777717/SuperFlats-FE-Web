import Link from "next/link";
import { SITE } from "@/lib/config";
import { cn } from "@/lib/utils";

/** Building mark on a navy tile with a gold ground line. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={cn("size-9", className)} aria-hidden>
      <rect width="32" height="32" rx="7" className="fill-[oklch(0.31_0.08_256)]" />
      <path d="M8.5 23.5V13a1 1 0 0 1 1-1h4.5v11.5Z" fill="white" fillOpacity=".45" />
      <path d="M14 23.5V8.5a1 1 0 0 1 1-1h7a1 1 0 0 1 1 1v15Z" fill="white" />
      <g className="fill-[oklch(0.31_0.08_256)]">
        <rect x="16.4" y="10.5" width="1.8" height="1.8" rx=".3" />
        <rect x="19.2" y="10.5" width="1.8" height="1.8" rx=".3" />
        <rect x="16.4" y="14.2" width="1.8" height="1.8" rx=".3" />
        <rect x="19.2" y="14.2" width="1.8" height="1.8" rx=".3" />
        <rect x="16.4" y="17.9" width="1.8" height="1.8" rx=".3" />
        <rect x="19.2" y="17.9" width="1.8" height="1.8" rx=".3" />
      </g>
      <rect x="6.5" y="24" width="19" height="1.4" rx=".7" className="fill-[oklch(0.72_0.09_78)]" />
    </svg>
  );
}

export function Logo({ href = "/", tagline, className, light }: { href?: string; tagline?: string; className?: string; light?: boolean }) {
  return (
    <Link href={href} className={cn("flex items-center gap-2.5 rounded-md focus-visible:outline-2", className)} aria-label={`${SITE.name} home`}>
      <LogoMark />
      <span className="leading-none">
        <span className={cn("block font-display text-[1.35rem] font-semibold tracking-tight", light && "text-white")}>{SITE.name}</span>
        {tagline && <span className={cn("mt-1 block text-xs font-medium text-muted-foreground", light && "text-white/70")}>{tagline}</span>}
      </span>
    </Link>
  );
}
