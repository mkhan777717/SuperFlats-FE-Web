"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { ChevronDown, IndianRupee, MapPin, Navigation, Search, SlidersHorizontal, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { FLAT_TYPES } from "@/lib/config";
import { formatRupees } from "@/lib/format";
import { activeFilterCount, RADII, SORTS, type SearchFilters, type SortKey } from "@/lib/search";
import { cn } from "@/lib/utils";
import { useExplore } from "./explore-shell";
import { PlaceSearch } from "./place-search";

const BUDGETS = [
  { label: "Under ₹10k", min: "", max: "10000" },
  { label: "₹10k – 20k", min: "10000", max: "20000" },
  { label: "₹20k – 35k", min: "20000", max: "35000" },
  { label: "₹35k+", min: "35000", max: "" },
];

const budgetLabel = (f: Pick<SearchFilters, "min_rent" | "max_rent">) =>
  f.min_rent && f.max_rent
    ? `${formatRupees(f.min_rent)} – ${formatRupees(f.max_rent)}`
    : f.min_rent
      ? `From ${formatRupees(f.min_rent)}`
      : f.max_rent
        ? `Up to ${formatRupees(f.max_rent)}`
        : "Budget";

function FilterButton({ active, children, className, ...rest }: { active: boolean; children: ReactNode } & React.ComponentProps<typeof Button>) {
  return (
    <Button variant="outline" className={cn("rounded-full", active && "border-primary bg-secondary text-secondary-foreground hover:bg-secondary", className)} {...rest}>
      {children}
      <ChevronDown className="size-3.5 opacity-60" aria-hidden />
    </Button>
  );
}

function BudgetFields({ value, onApply }: { value: Pick<SearchFilters, "min_rent" | "max_rent">; onApply: (min: string, max: string) => void }) {
  const [min, setMin] = useState(value.min_rent);
  const [max, setMax] = useState(value.max_rent);
  const clean = (v: string) => v.replace(/\D/g, "");
  return (
    <div className="grid gap-4">
      <div className="grid grid-cols-2 gap-2">
        {BUDGETS.map((b) => (
          <Button key={b.label} type="button" variant="outline" size="sm" onClick={() => onApply(b.min, b.max)}>
            {b.label}
          </Button>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="grid gap-1.5">
          <Label htmlFor="min-rent">Min rent</Label>
          <Input id="min-rent" inputMode="numeric" placeholder="₹ Any" value={min} onChange={(e) => setMin(clean(e.target.value))} />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="max-rent">Max rent</Label>
          <Input id="max-rent" inputMode="numeric" placeholder="₹ Any" value={max} onChange={(e) => setMax(clean(e.target.value))} />
        </div>
      </div>
      <Button onClick={() => onApply(min, max)}>Apply budget</Button>
    </div>
  );
}

function NearFields({ value, onApply }: { value: SearchFilters; onApply: (patch: Partial<SearchFilters>) => void }) {
  const [radius, setRadius] = useState(value.radius || "5");
  return (
    <div className="grid gap-4">
      <div className="grid gap-1.5">
        <Label>Near a place</Label>
        <PlaceSearch defaultValue={value.near} onSelect={(p) => onApply({ near: p.label, lat: String(p.lat), lng: String(p.lng), radius })} />
      </div>
      <div className="grid gap-1.5">
        <Label>Within</Label>
        <div className="grid grid-cols-4 gap-2">
          {RADII.map((r) => (
            <Button
              key={r}
              type="button"
              size="sm"
              variant={radius === String(r) ? "default" : "outline"}
              onClick={() => {
                setRadius(String(r));
                if (value.lat) onApply({ radius: String(r) });
              }}
            >
              {r} km
            </Button>
          ))}
        </div>
      </div>
      {value.lat && (
        <Button variant="ghost" onClick={() => onApply({ near: "", lat: "", lng: "", radius: "" })}>
          <X aria-hidden /> Clear place
        </Button>
      )}
    </div>
  );
}

function CityField({ value, onApply }: { value: string; onApply: (city: string) => void }) {
  const [city, setCity] = useState(value);
  return (
    <form
      className="grid gap-1.5"
      onSubmit={(e) => {
        e.preventDefault();
        onApply(city.trim());
      }}
    >
      <Label htmlFor="city">City</Label>
      <div className="flex gap-2">
        <Input id="city" placeholder="e.g. Indore" value={city} onChange={(e) => setCity(e.target.value)} />
        <Button type="submit" variant="secondary">
          Set
        </Button>
      </div>
    </form>
  );
}

export function SearchFilters({ total }: { total: number }) {
  const { filters, apply } = useExplore();
  const [budgetOpen, setBudgetOpen] = useState(false);
  const [nearOpen, setNearOpen] = useState(false);
  const [cityOpen, setCityOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const count = activeFilterCount(filters);

  const onSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    apply({ keywords: String(new FormData(e.currentTarget).get("keywords") ?? "").trim() });
  };

  return (
    <div className="grid gap-4">
      <div className="flex gap-2">
        <form onSubmit={onSearch} role="search" className="flex flex-1 gap-2">
          <label className="relative flex-1">
            <span className="sr-only">Search listings</span>
            <Search className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-muted-foreground" aria-hidden />
            <Input
              key={filters.keywords}
              name="keywords"
              type="search"
              defaultValue={filters.keywords}
              placeholder="Search by area, society or keyword"
              className="h-12 rounded-2xl pl-12 text-base shadow-soft"
            />
          </label>
          <Button type="submit" size="xl" className="hidden sm:inline-flex">
            Search
          </Button>
        </form>
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="xl" className="relative px-4 lg:hidden" aria-label="Filters">
              <SlidersHorizontal aria-hidden />
              {count > 0 && <Badge className="absolute -top-1.5 -right-1.5 size-5 justify-center rounded-full p-0">{count}</Badge>}
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="max-h-[90dvh] overflow-y-auto rounded-t-3xl">
            <SheetHeader>
              <SheetTitle>Filters</SheetTitle>
            </SheetHeader>
            <div className="grid gap-6 px-4">
              <div className="grid gap-2">
                <Label>Sort by</Label>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(SORTS).map(([key, { label }]) => (
                    <Button key={key} size="sm" variant={filters.sort === key ? "default" : "outline"} onClick={() => apply({ sort: key as SortKey })}>
                      {label}
                    </Button>
                  ))}
                </div>
              </div>
              <CityField value={filters.city} onApply={(city) => apply({ city })} />
              <BudgetFields value={filters} onApply={(min_rent, max_rent) => apply({ min_rent, max_rent })} />
              <NearFields value={filters} onApply={apply} />
            </div>
            <SheetFooter>
              <Button size="lg" onClick={() => setSheetOpen(false)}>
                Show {total.toLocaleString("en-IN")} flats
              </Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>

      <div className="flex items-center gap-2">
        <div className="scrollbar-none -mx-4 flex flex-1 items-center gap-2 overflow-x-auto px-4 sm:mx-0 sm:px-0">
          {["", ...FLAT_TYPES].map((t) => {
            const active = filters.type === t;
            return (
              <button
                key={t || "all"}
                type="button"
                onClick={() => apply({ type: t })}
                aria-pressed={active}
                className={cn(
                  "h-9 shrink-0 rounded-full border px-4 text-sm font-medium transition",
                  active ? "border-primary bg-primary text-primary-foreground" : "bg-card hover:border-primary/40",
                )}
              >
                {t || "All"}
              </button>
            );
          })}

          <span className="mx-1 hidden h-6 w-px bg-border lg:block" aria-hidden />

          <Popover open={budgetOpen} onOpenChange={setBudgetOpen}>
            <PopoverTrigger asChild>
              <FilterButton active={!!(filters.min_rent || filters.max_rent)} className="hidden lg:inline-flex">
                <IndianRupee aria-hidden /> {budgetLabel(filters)}
              </FilterButton>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-80">
              <BudgetFields
                value={filters}
                onApply={(min_rent, max_rent) => {
                  setBudgetOpen(false);
                  apply({ min_rent, max_rent });
                }}
              />
            </PopoverContent>
          </Popover>

          <Popover open={nearOpen} onOpenChange={setNearOpen}>
            <PopoverTrigger asChild>
              <FilterButton active={!!filters.lat} className="hidden max-w-64 lg:inline-flex">
                <Navigation aria-hidden /> <span className="truncate">{filters.near ? `Near ${filters.near.split(",")[0]}` : "Near a place"}</span>
              </FilterButton>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-96">
              <NearFields
                value={filters}
                onApply={(patch) => {
                  if (patch.lat !== undefined) setNearOpen(false);
                  apply(patch);
                }}
              />
            </PopoverContent>
          </Popover>

          <Popover open={cityOpen} onOpenChange={setCityOpen}>
            <PopoverTrigger asChild>
              <FilterButton active={!!filters.city} className="hidden lg:inline-flex">
                <MapPin aria-hidden /> {filters.city || "City"}
              </FilterButton>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-80">
              <CityField
                value={filters.city}
                onApply={(city) => {
                  setCityOpen(false);
                  apply({ city });
                }}
              />
            </PopoverContent>
          </Popover>
        </div>

        <Select value={filters.sort} onValueChange={(sort) => apply({ sort: sort as SortKey })}>
          <SelectTrigger className="hidden w-48 rounded-full lg:flex" aria-label="Sort by">
            <SelectValue />
          </SelectTrigger>
          <SelectContent align="end">
            {Object.entries(SORTS).map(([key, { label }]) => (
              <SelectItem key={key} value={key}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

/** Removable chips for every active filter, plus "Clear all". */
export function ActiveFilters() {
  const { filters, apply } = useExplore();
  const chips: { label: string; clear: Partial<SearchFilters> }[] = [];
  if (filters.keywords) chips.push({ label: `“${filters.keywords}”`, clear: { keywords: "" } });
  if (filters.city) chips.push({ label: filters.city, clear: { city: "" } });
  if (filters.min_rent || filters.max_rent) chips.push({ label: budgetLabel(filters), clear: { min_rent: "", max_rent: "" } });
  if (filters.near) chips.push({ label: `Within ${filters.radius} km of ${filters.near.split(",")[0]}`, clear: { near: "", lat: "", lng: "", radius: "" } });
  if (!chips.length) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {chips.map((c) => (
        <button
          key={c.label}
          type="button"
          onClick={() => apply(c.clear)}
          className="inline-flex h-8 items-center gap-1.5 rounded-full bg-secondary pr-2 pl-3 text-sm font-medium text-secondary-foreground hover:bg-secondary/70"
          aria-label={`Remove filter ${c.label}`}
        >
          {c.label} <X className="size-3.5" aria-hidden />
        </button>
      ))}
      <button
        type="button"
        onClick={() => apply({ keywords: "", type: "", city: "", min_rent: "", max_rent: "", near: "", lat: "", lng: "", radius: "" })}
        className="text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        Clear all
      </button>
    </div>
  );
}
