import Link from "next/link";
import type { ReactNode } from "react";
import { Search } from "lucide-react";
import { Pagination } from "@/components/common/pagination";
import { cn } from "@/lib/utils";

export const PAGE_SIZE = 15;

type Params = Record<string, string | string[] | undefined>;
const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v)?.trim() ?? "";

/** Reads ?q=, ?page= and any extra filter keys from the URL. */
export function readListParams(params: Params, keys: string[] = []) {
  const page = Math.max(1, Number.parseInt(one(params.page), 10) || 1);
  const extra = Object.fromEntries(keys.map((k) => [k, one(params[k])]));
  return { q: one(params.q).slice(0, 100), page, offset: (page - 1) * PAGE_SIZE, ...extra } as { q: string; page: number; offset: number } & Record<string, string>;
}

export function hrefWith(base: string, current: Record<string, string | number>, patch: Record<string, string | number>) {
  const qs = new URLSearchParams();
  for (const [k, v] of Object.entries({ ...current, ...patch })) {
    if (k === "offset" || v === "" || v === undefined || (k === "page" && Number(v) <= 1)) continue;
    qs.set(k, String(v));
  }
  const s = qs.toString();
  return s ? `${base}?${s}` : base;
}

/** GET search form that keeps other filters in hidden inputs. */
export function TableSearch({ base, value, placeholder, keep = {} }: { base: string; value: string; placeholder: string; keep?: Record<string, string> }) {
  return (
    <form action={base} className="relative w-full sm:max-w-xs">
      {Object.entries(keep).map(([k, v]) => v && <input key={k} type="hidden" name={k} value={v} />)}
      <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
      <input
        name="q"
        type="search"
        defaultValue={value}
        placeholder={placeholder}
        className="h-10 w-full rounded-sm border border-input bg-card pr-3 pl-9 text-sm outline-none focus:border-ring focus:ring-3 focus:ring-ring/20"
      />
    </form>
  );
}

/** Underlined filter tabs that are plain links. */
export function FilterTabs({ items, active }: { items: { label: string; href: string; value: string }[]; active: string }) {
  return (
    <nav className="flex gap-5 overflow-x-auto border-b">
      {items.map((t) => (
        <Link
          key={t.value || "all"}
          href={t.href}
          aria-current={active === t.value ? "page" : undefined}
          className={cn(
            "caps -mb-px shrink-0 border-b-2 pb-3 transition",
            active === t.value ? "border-gold text-foreground" : "border-transparent text-muted-foreground hover:text-foreground",
          )}
        >
          {t.label}
        </Link>
      ))}
    </nav>
  );
}

export function Table({ head, children, empty }: { head: string[]; children: ReactNode; empty?: ReactNode }) {
  return (
    <div className="overflow-x-auto rounded-sm border bg-card">
      <table className="w-full min-w-[720px] text-left text-sm">
        <thead className="border-b bg-muted/60">
          <tr>
            {head.map((h, i) => (
              <th key={h || i} scope="col" className="px-4 py-3 text-[0.7rem] font-semibold tracking-[0.12em] text-muted-foreground uppercase">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y">{children}</tbody>
      </table>
      {empty}
    </div>
  );
}

export function Td({ children, className }: { children: ReactNode; className?: string }) {
  return <td className={cn("px-4 py-3 align-middle", className)}>{children}</td>;
}

export function TableEmpty({ children }: { children: ReactNode }) {
  return <p className="px-4 py-12 text-center text-muted-foreground">{children}</p>;
}

export function TableFooter({ total, page, totalPages, href }: { total: number; page: number; totalPages: number; href: (p: number) => string }) {
  return (
    <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
      <p className="text-sm text-muted-foreground tabular">
        {total.toLocaleString("en-IN")} {total === 1 ? "record" : "records"}
      </p>
      <Pagination page={page} totalPages={totalPages} href={href} />
    </div>
  );
}
