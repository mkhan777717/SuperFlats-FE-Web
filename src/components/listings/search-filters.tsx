"use client";

import { useState, type FormEvent } from "react";
import { LayoutGrid, Map as MapIcon, Search, SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { FLAT_TYPES } from "@/lib/config";
import { formatRupees } from "@/lib/format";
import { activeFilterCount, RADII, SORTS, type SearchFilters, type SortKey } from "@/lib/search";
import { cn } from "@/lib/utils";
import { useExplore } from "./explore-shell";
import { PlaceSearch } from "./place-search";

const budgetLabel = (f: Pick<SearchFilters, "min_rent" | "max_rent">) =>
  f.min_rent && f.max_rent
    ? `${formatRupees(f.min_rent)} – ${formatRupees(f.max_rent)}`
    : f.min_rent
      ? `From ${formatRupees(f.min_rent)}`
      : f.max_rent
        ? `Up to ${formatRupees(f.max_rent)}`
        : "";

const digitsOnly = (v: string) => v.replace(/\D/g, "");

/** Every secondary filter lives in one panel, applied together. */
function FiltersPanel({ onDone }: { onDone: () => void }) {
  const { filters, apply } = useExplore();
  const [draft, setDraft] = useState({
    sort: filters.sort,
    city: filters.city,
    min_rent: filters.min_rent,
    max_rent: filters.max_rent,
    near: filters.near,
    lat: filters.lat,
    lng: filters.lng,
    radius: filters.radius || "5",
  });
  const set = (patch: Partial<typeof draft>) => setDraft((d) => ({ ...d, ...patch }));

  return (
    <>
      <div className="grid gap-7 overflow-y-auto px-4 pb-4">
        <section className="grid gap-2">
          <Label>Sort by</Label>
          <div className="grid gap-2 sm:grid-cols-3">
            {Object.entries(SORTS).map(([key, { label }]) => (
              <Button key={key} variant={draft.sort === key ? "default" : "outline"} onClick={() => set({ sort: key as SortKey })}>
                {label}
              </Button>
            ))}
          </div>
        </section>

        <section className="grid gap-2">
          <Label>Monthly rent (₹)</Label>
          <div className="grid grid-cols-2 gap-3">
            <Input inputMode="numeric" placeholder="Min" aria-label="Minimum rent" value={draft.min_rent} onChange={(e) => set({ min_rent: digitsOnly(e.target.value) })} />
            <Input inputMode="numeric" placeholder="Max" aria-label="Maximum rent" value={draft.max_rent} onChange={(e) => set({ max_rent: digitsOnly(e.target.value) })} />
          </div>
        </section>

        <section className="grid gap-2">
          <Label htmlFor="filter-city">City</Label>
          <Input id="filter-city" placeholder="e.g. Indore" value={draft.city} onChange={(e) => set({ city: e.target.value })} />
        </section>

        <section className="grid gap-2">
          <Label>Near a place</Label>
          <PlaceSearch key={draft.near} defaultValue={draft.near} onSelect={(p) => set({ near: p.label, lat: String(p.lat), lng: String(p.lng) })} />
          {draft.lat && (
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-sm text-muted-foreground">Within</span>
              {RADII.map((r) => (
                <Button key={r} size="sm" variant={draft.radius === String(r) ? "default" : "outline"} onClick={() => set({ radius: String(r) })}>
                  {r} km
                </Button>
              ))}
              <Button size="sm" variant="ghost" onClick={() => set({ near: "", lat: "", lng: "" })}>
                Remove
              </Button>
            </div>
          )}
        </section>
      </div>

      <SheetFooter className="flex-row gap-2 border-t">
        <Button
          variant="outline"
          size="lg"
          className="flex-1"
          onClick={() => setDraft({ sort: "newest", city: "", min_rent: "", max_rent: "", near: "", lat: "", lng: "", radius: "5" })}
        >
          Reset
        </Button>
        <Button
          size="lg"
          className="flex-1"
          onClick={() => {
            apply({ ...draft, city: draft.city.trim(), radius: draft.lat ? draft.radius : "" });
            onDone();
          }}
        >
          Show results
        </Button>
      </SheetFooter>
    </>
  );
}

export function SearchFilters() {
  const { filters, apply } = useExplore();
  const [open, setOpen] = useState(false);
  const count = activeFilterCount(filters) - (filters.type ? 1 : 0) + (filters.sort !== "newest" ? 1 : 0);

  const onSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    apply({ keywords: String(new FormData(e.currentTarget).get("keywords") ?? "").trim() });
  };

  return (
    <div className="grid gap-3.5">
      <form onSubmit={onSearch} role="search" className="flex w-full gap-2">
        <label className="relative flex-1">
          <span className="sr-only">Search listings</span>
          <Search className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
          <Input key={filters.keywords} name="keywords" type="search" defaultValue={filters.keywords} placeholder="Search by area, society or city" className="h-11 w-full rounded-full border border-black/[0.08] bg-white pl-10 text-[14px] shadow-sm focus:bg-white focus:border-foreground focus:ring-4 focus:ring-black/[0.04] transition-all" />
        </label>
        <Button type="submit" size="default" variant="default" className="h-11 rounded-full px-6 bg-[#1d1d1f] text-white hover:bg-black text-[13.5px] font-medium shadow-sm">
          Search
        </Button>
      </form>

      <div className="flex items-center gap-2">
        <div className="scrollbar-none flex items-center gap-1.5 overflow-x-auto py-1">
          {["", ...FLAT_TYPES].map((t) => {
            const active = filters.type === t;
            return (
              <button
                key={t || "all"}
                type="button"
                onClick={() => apply({ type: t })}
                aria-pressed={active}
                className={cn(
                  "h-8 shrink-0 rounded-full px-3.5 text-[12.5px] font-medium transition-all duration-200 active:scale-95",
                  active
                    ? "bg-[#1d1d1f] text-white shadow-sm"
                    : "bg-black/[0.05] text-[#1d1d1f] hover:bg-black/[0.08]",
                )}
              >
                {t || "All"}
              </button>
            );
          })}
        </div>
        <div role="group" aria-label="View" className="flex shrink-0 items-center rounded-full bg-black/[0.05] p-1 border border-black/[0.04]">
          {(
            [
              { id: "list", label: "List", icon: LayoutGrid },
              { id: "map", label: "Map", icon: MapIcon },
            ] as const
          ).map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => apply({ view: id, page: filters.page })}
              aria-pressed={filters.view === id}
              className={cn(
                "flex h-6.5 items-center gap-1 rounded-full px-2.5 text-[12px] font-medium transition-all duration-200 active:scale-95",
                filters.view === id ? "bg-white text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Icon className="size-3" aria-hidden /> {label}
            </button>
          ))}
        </div>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm" className="h-8 shrink-0 rounded-full border-black/[0.1] bg-white text-[12.5px] font-medium hover:bg-black/[0.03]">
              <SlidersHorizontal aria-hidden className="size-3" /> Filters
              {count > 0 && <span className="grid size-4.5 place-items-center rounded-full bg-[#1d1d1f] text-[10px] font-medium text-white">{count}</span>}
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-full sm:max-w-md">
            <SheetHeader>
              <SheetTitle>Filters</SheetTitle>
            </SheetHeader>
            {open && <FiltersPanel onDone={() => setOpen(false)} />}
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}

/** Removable chips for the filters in use, so it's always clear what's applied. */
export function ActiveFilters() {
  const { filters, apply } = useExplore();
  const chips: { label: string; clear: Partial<SearchFilters> }[] = [];
  if (filters.keywords) chips.push({ label: `“${filters.keywords}”`, clear: { keywords: "" } });
  if (filters.city) chips.push({ label: filters.city, clear: { city: "" } });
  const budget = budgetLabel(filters);
  if (budget) chips.push({ label: budget, clear: { min_rent: "", max_rent: "" } });
  if (filters.near) chips.push({ label: `Within ${filters.radius} km of ${filters.near.split(",")[0]}`, clear: { near: "", lat: "", lng: "", radius: "" } });
  if (filters.sort !== "newest") chips.push({ label: SORTS[filters.sort].label, clear: { sort: "newest" } });
  if (!chips.length) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {chips.map((c) => (
        <button
          key={c.label}
          type="button"
          onClick={() => apply(c.clear)}
          className="inline-flex h-8 items-center gap-1.5 rounded-md border bg-accent pr-2 pl-3 text-sm font-medium text-accent-foreground hover:bg-accent/70"
          aria-label={`Remove filter ${c.label}`}
        >
          {c.label} <X className="size-3.5" aria-hidden />
        </button>
      ))}
      <button
        type="button"
        onClick={() => apply({ keywords: "", type: "", city: "", min_rent: "", max_rent: "", near: "", lat: "", lng: "", radius: "", sort: "newest", page: 1 })}
        className="text-sm font-medium text-link hover:underline"
      >
        Clear all
      </button>
    </div>
  );
}
