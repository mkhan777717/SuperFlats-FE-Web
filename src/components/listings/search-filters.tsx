"use client";

import Link from "next/link";
import { useRef } from "react";
import { MapPin, SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FLAT_TYPES } from "@/lib/config";
import { cn } from "@/lib/cn";
import { exploreHref, SORTS, type SearchFilters } from "@/lib/search";

const control =
  "h-11 w-full rounded-xl border border-line bg-surface px-3.5 text-[15px] focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/15";

/**
 * Plain GET form so filters live in the URL (shareable, back-button friendly, works
 * without JS). Type chips are links; selects submit on change.
 */
export function SearchFilters({ filters }: { filters: SearchFilters }) {
  const form = useRef<HTMLFormElement>(null);
  const submit = () => form.current?.requestSubmit();
  const hasFilters = !!(filters.keywords || filters.city || filters.type || filters.min_rent || filters.max_rent);

  return (
    <div className="space-y-4">
      <div className="scrollbar-none -mx-4 flex gap-2.5 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:px-0">
        {["", ...FLAT_TYPES].map((type) => {
          const active = filters.type === type;
          return (
            <Link
              key={type || "all"}
              href={exploreHref({ ...filters, type, page: 1 })}
              aria-current={active ? "true" : undefined}
              className={cn(
                "shrink-0 rounded-xl border-2 px-4 py-2 text-sm font-medium transition",
                active ? "border-brand-500 bg-brand-500 text-white shadow-[var(--shadow-cta)]" : "border-brand-500 text-brand-600 hover:bg-brand-50",
              )}
            >
              {type || "All Flats"}
            </Link>
          );
        })}
      </div>

      <form ref={form} action="/explore" className="card grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr_auto]">
        <input type="hidden" name="keywords" value={filters.keywords} />
        <input type="hidden" name="type" value={filters.type} />
        <label className="relative">
          <span className="sr-only">City</span>
          <MapPin className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-ink-faint" aria-hidden />
          <input name="city" defaultValue={filters.city} placeholder="City, e.g. Indore" className={cn(control, "pl-10")} />
        </label>
        <label>
          <span className="sr-only">Minimum rent</span>
          <input name="min_rent" defaultValue={filters.min_rent} inputMode="numeric" pattern="\d*" placeholder="Min rent ₹" className={control} />
        </label>
        <label>
          <span className="sr-only">Maximum rent</span>
          <input name="max_rent" defaultValue={filters.max_rent} inputMode="numeric" pattern="\d*" placeholder="Max rent ₹" className={control} />
        </label>
        <label>
          <span className="sr-only">Sort by</span>
          <select name="sort" defaultValue={filters.sort} onChange={submit} className={control}>
            {Object.entries(SORTS).map(([key, { label }]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </label>
        <div className="flex gap-2 sm:col-span-2 lg:col-span-1">
          <Button type="submit" className="flex-1 lg:flex-none" icon={<SlidersHorizontal className="size-4" aria-hidden />}>
            Apply
          </Button>
          {hasFilters && (
            <Link href="/explore" className="grid size-11 place-items-center rounded-xl text-ink-soft hover:bg-muted" aria-label="Clear all filters">
              <X className="size-5" />
            </Link>
          )}
        </div>
      </form>
    </div>
  );
}
