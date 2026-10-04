import Link from "next/link";
import { SITE } from "@/lib/config";
import { cn } from "@/lib/utils";

/** Two towers with lit windows: the Superflats mark. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={cn("size-9", className)} aria-hidden>
      <rect width="32" height="32" rx="9" className="fill-primary" />
      <path d="M8 25V12.5a1.5 1.5 0 0 1 1.5-1.5h5A1.5 1.5 0 0 1 16 12.5V25" className="fill-primary-foreground/25" />
      <path d="M14 25V8.5A1.5 1.5 0 0 1 15.5 7h7A1.5 1.5 0 0 1 24 8.5V25" className="fill-primary-foreground" />
      <g className="fill-primary">
        <rect x="17" y="10" width="2" height="2" rx=".5" />
        <rect x="20" y="10" width="2" height="2" rx=".5" />
        <rect x="17" y="14" width="2" height="2" rx=".5" />
        <rect x="20" y="14" width="2" height="2" rx=".5" />
        <rect x="17" y="18" width="2" height="2" rx=".5" />
        <rect x="20" y="18" width="2" height="2" rx=".5" />
      </g>
      <rect x="7" y="24.5" width="18" height="1.5" rx=".75" className="fill-highlight" />
    </svg>
  );
}

export function Logo({ href = "/", tagline, className }: { href?: string; tagline?: string; className?: string }) {
  return (
    <Link href={href} className={cn("flex items-center gap-2.5 rounded-lg focus-visible:outline-2", className)} aria-label={`${SITE.name} home`}>
      <LogoMark />
      <span className="leading-none">
        <span className="block text-[1.15rem] font-bold tracking-tight">{SITE.name}</span>
        {tagline && <span className="mt-1 block text-xs font-medium text-muted-foreground">{tagline}</span>}
      </span>
    </Link>
  );
}
