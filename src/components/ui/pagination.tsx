import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/cn";

/** Page numbers around the current page, with ellipses: 1 … 4 5 6 … 12 */
function pageWindow(current: number, total: number) {
  const pages = new Set([1, total, current - 1, current, current + 1]);
  const sorted = [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);
  const out: (number | "…")[] = [];
  sorted.forEach((p, i) => {
    if (i > 0 && p - sorted[i - 1]! > 1) out.push("…");
    out.push(p);
  });
  return out;
}

export function Pagination({ page, totalPages, href }: { page: number; totalPages: number; href: (page: number) => string }) {
  if (totalPages <= 1) return null;
  const item = "grid size-11 place-items-center rounded-xl text-[15px] font-medium transition";

  return (
    <nav aria-label="Pagination" className="flex items-center justify-center gap-1.5">
      {page > 1 ? (
        <Link href={href(page - 1)} className={cn(item, "text-ink-soft hover:bg-surface")} aria-label="Previous page">
          <ChevronLeft className="size-5" />
        </Link>
      ) : (
        <span className={cn(item, "text-ink-faint/50")} aria-hidden>
          <ChevronLeft className="size-5" />
        </span>
      )}
      {pageWindow(page, totalPages).map((p, i) =>
        p === "…" ? (
          <span key={`gap-${i}`} className="px-1 text-ink-faint">
            …
          </span>
        ) : (
          <Link
            key={p}
            href={href(p)}
            aria-current={p === page ? "page" : undefined}
            className={cn(item, p === page ? "bg-brand-500 text-white shadow-[var(--shadow-cta)]" : "text-ink-soft hover:bg-surface")}
          >
            {p}
          </Link>
        ),
      )}
      {page < totalPages ? (
        <Link href={href(page + 1)} className={cn(item, "text-ink-soft hover:bg-surface")} aria-label="Next page">
          <ChevronRight className="size-5" />
        </Link>
      ) : (
        <span className={cn(item, "text-ink-faint/50")} aria-hidden>
          <ChevronRight className="size-5" />
        </span>
      )}
    </nav>
  );
}
