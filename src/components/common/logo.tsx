import Link from "next/link";
import { SITE } from "@/lib/config";
import { cn } from "@/lib/utils";

/** Serif wordmark, navy on light surfaces and white on dark ones. */
export function Logo({ href = "/", tagline, className, light }: { href?: string; tagline?: string; className?: string; light?: boolean }) {
  return (
    <Link href={href} className={cn("flex flex-col justify-center rounded-md leading-none focus-visible:outline-2", className)} aria-label={`${SITE.name} home`}>
      <span className={cn("font-display text-[1.75rem] font-semibold tracking-tight", light ? "text-white" : "text-primary dark:text-foreground")}>{SITE.name}</span>
      {tagline && <span className={cn("mt-1 text-xs font-medium text-muted-foreground", light && "text-white/70")}>{tagline}</span>}
    </Link>
  );
}
