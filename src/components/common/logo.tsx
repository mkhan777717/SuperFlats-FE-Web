import Link from "next/link";
import { SITE } from "@/lib/config";
import { cn } from "@/lib/utils";

/** Building mark on the coral brand tile. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={cn("size-8", className)} aria-hidden>
      <rect width="32" height="32" rx="9" className="fill-primary" />
      <path d="M9 24V13.5a1 1 0 0 1 1-1h4.5V24Z" className="fill-white/45" />
      <path d="M14.5 24V9a1 1 0 0 1 1-1H22a1 1 0 0 1 1 1v15Z" className="fill-white" />
      <g className="fill-primary">
        <rect x="17" y="11" width="1.8" height="1.8" rx=".4" />
        <rect x="19.7" y="11" width="1.8" height="1.8" rx=".4" />
        <rect x="17" y="14.6" width="1.8" height="1.8" rx=".4" />
        <rect x="19.7" y="14.6" width="1.8" height="1.8" rx=".4" />
        <rect x="17" y="18.2" width="1.8" height="1.8" rx=".4" />
        <rect x="19.7" y="18.2" width="1.8" height="1.8" rx=".4" />
      </g>
    </svg>
  );
}

export function Logo({ href = "/", tagline, className }: { href?: string; tagline?: string; className?: string }) {
  return (
    <Link href={href} className={cn("flex items-center gap-2.5 rounded-lg focus-visible:outline-2", className)} aria-label={`${SITE.name} home`}>
      <LogoMark />
      <span className="leading-none">
        <span className="block text-lg font-bold tracking-tight">{SITE.name}</span>
        {tagline && <span className="mt-1 block text-xs font-medium text-muted-foreground">{tagline}</span>}
      </span>
    </Link>
  );
}
