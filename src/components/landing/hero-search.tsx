"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, Building2, ChevronDown, Home, IndianRupee, LayoutGrid, Loader2, MapPin, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FLAT_TYPES } from "@/lib/config";
import { cn } from "@/lib/utils";

const BUDGETS = [10000, 15000, 20000, 30000, 50000, 75000];

const CITIES = [
  "Bengaluru", "Mumbai", "Delhi", "Hyderabad", "Chennai", "Pune",
  "Kolkata", "Ahmedabad", "Jaipur", "Lucknow", "Indore", "Chandigarh",
  "Noida", "Gurgaon", "Kochi", "Bhopal", "Nagpur", "Coimbatore",
  "Mysuru", "Vadodara", "Surat", "Visakhapatnam", "Thiruvananthapuram",
];

const GEO_CITY_KEY = "sf-geo-city";

/** Reverse-geocode coords → city name via OpenStreetMap Nominatim (free, no key). */
async function reverseGeocode(lat: number, lng: number): Promise<string> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&zoom=10`,
      { headers: { "Accept-Language": "en" } },
    );
    if (!res.ok) return "";
    const data = await res.json();
    return data.address?.city || data.address?.town || data.address?.suburb || data.address?.state_district || data.address?.state || "";
  } catch {
    return "";
  }
}

const control =
  "h-12 w-full appearance-none rounded-xl border border-slate-200/90 bg-white/70 pr-9 pl-11 text-[0.9375rem] text-foreground shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)] backdrop-blur-md outline-none transition-all duration-200 placeholder:text-muted-foreground hover:border-slate-300 hover:bg-white/90 focus:border-primary/40 focus:bg-white focus:ring-4 focus:ring-primary/10";

function Field({ label, icon: Icon, select, children }: { label: string; icon: typeof MapPin; select?: boolean; children: React.ReactNode }) {
  return (
    <label className="group grid min-w-0 gap-1.5">
      <span className="text-[0.68rem] font-semibold tracking-[0.14em] text-muted-foreground uppercase">{label}</span>
      <span className="relative flex items-center">
        <span className="pointer-events-none absolute left-2.5 grid size-7 place-items-center rounded-lg bg-slate-100/70 text-muted-foreground transition-colors group-focus-within:bg-primary/10 group-focus-within:text-primary">
          <Icon className="size-4" aria-hidden />
        </span>
        {children}
        {select && <ChevronDown className="pointer-events-none absolute right-3 size-4 text-muted-foreground transition-transform group-focus-within:rotate-180" aria-hidden />}
      </span>
    </label>
  );
}

type Tab = "rent" | "owners";

/** Tabbed search card from the design: "Rent" searches listings, "For owners" points to listing a property. */
export function HeroSearch() {
  const [tab, setTab] = useState<Tab>("rent");
  const inputRef = useRef<HTMLInputElement>(null);
  const [locating, setLocating] = useState(false);
  const tabs: { id: Tab; label: string; icon: typeof Home }[] = [
    { id: "rent", label: "Rent", icon: Home },
    { id: "owners", label: "For owners", icon: Building2 },
  ];

  // Auto-fill location from GPS on mount
  useEffect(() => {
    let cancelled = false;

    const fill = async (lat: number, lng: number) => {
      const city = await reverseGeocode(lat, lng);
      if (cancelled || !city || !inputRef.current) return;
      if (!inputRef.current.value) {
        inputRef.current.value = city;
        try { sessionStorage.setItem(GEO_CITY_KEY, city); } catch {}
      }
      setLocating(false);
    };

    const start = async () => {
      // 1. Check session cache first
      try {
        const cached = sessionStorage.getItem(GEO_CITY_KEY);
        if (cached && inputRef.current && !inputRef.current.value) {
          inputRef.current.value = cached;
          return;
        }
      } catch {}

      // 2. Only auto-locate if permission already granted (won't show a prompt)
      if (!("geolocation" in navigator)) return;
      try {
        const perm = await navigator.permissions?.query({ name: "geolocation" as PermissionName });
        if (cancelled) return;
        if (perm?.state === "denied") return;
        if (perm?.state === "granted") {
          setLocating(true);
          navigator.geolocation.getCurrentPosition(
            ({ coords }) => fill(coords.latitude, coords.longitude),
            () => setLocating(false),
            { enableHighAccuracy: false, timeout: 8000, maximumAge: 10 * 60 * 1000 },
          );
        }
        // If "prompt" state — don't auto-trigger from the search bar.
        // The NearbyListings section already handles that prompt.
      } catch {}
    };

    start();
    return () => { cancelled = true; };
  }, []);

  return (
    <div className="w-full max-w-5xl">
      <div role="tablist" aria-label="Search options" className="mb-3 inline-flex items-center gap-1.5 rounded-2xl border border-white/60 bg-white/70 p-1.5 backdrop-blur-xl shadow-sm">
        {tabs.map(({ id, label, icon: Icon }) => {
          const active = tab === id;
          return (
            <button
              key={id}
              role="tab"
              type="button"
              id={`hero-tab-${id}`}
              aria-selected={active}
              aria-controls={`hero-panel-${id}`}
              onClick={() => setTab(id)}
              className={cn(
                "caps flex h-10 items-center gap-2 rounded-xl px-5 text-xs font-semibold tracking-wider transition-all duration-200 active:scale-95",
                active
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-black/5 hover:text-foreground",
              )}
            >
              <Icon className={cn("size-4 transition-colors", active ? "text-primary-foreground" : "text-muted-foreground")} aria-hidden />
              {label}
            </button>
          );
        })}
      </div>

      <div className="rounded-3xl border border-white/80 bg-white/80 p-5 backdrop-blur-2xl shadow-[0_20px_50px_-15px_rgba(11,25,44,0.1),inset_0_1px_2px_rgba(255,255,255,0.9)] sm:p-7">
        {tab === "rent" ? (
          <form id="hero-panel-rent" role="tabpanel" aria-labelledby="hero-tab-rent" action="/explore" className="grid gap-4 md:grid-cols-[1.6fr_1fr_1fr_auto] md:items-end">
            <Field label="Location" icon={locating ? Loader2 : MapPin}>
              <input ref={inputRef} name="keywords" list="hero-cities" placeholder="Search by area, society or city" className={cn(control, locating && "[&+datalist]:hidden")} />
              <datalist id="hero-cities">
                {CITIES.map((c) => (
                  <option key={c} value={c} />
                ))}
              </datalist>
            </Field>
            <Field label="Property type" icon={LayoutGrid} select>
              <select name="type" defaultValue="" className={cn(control, "cursor-pointer")}>
                <option value="">All types</option>
                {FLAT_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Max rent" icon={IndianRupee} select>
              <select name="max_rent" defaultValue="" className={cn(control, "cursor-pointer")}>
                <option value="">Any</option>
                {BUDGETS.map((b) => (
                  <option key={b} value={b}>
                    ₹{b.toLocaleString("en-IN")}
                  </option>
                ))}
              </select>
            </Field>
            <Button type="submit" variant="gold" size="xl" className="w-full text-base font-semibold md:w-44 rounded-xl shadow-[0_8px_20px_-4px_rgba(180,125,20,0.35)] hover:shadow-[0_12px_28px_-4px_rgba(180,125,20,0.45)] hover:-translate-y-0.5 active:translate-y-0 transition-all">
              <Search className="size-5" aria-hidden /> Search
            </Button>
          </form>
        ) : (
          <div id="hero-panel-owners" role="tabpanel" aria-labelledby="hero-tab-owners" className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-lg font-semibold">Have a property to rent out?</p>
              <p className="mt-1 text-muted-foreground">List your flats, manage viewings, tenants and monthly rent from one dashboard.</p>
            </div>
            <div className="flex shrink-0 flex-wrap gap-3">
              <Button asChild variant="gold" size="xl" className="rounded-xl font-semibold shadow-[0_8px_20px_-4px_rgba(180,125,20,0.35)]">
                <Link href="/register?type=owner">
                  List your property <ArrowRight aria-hidden />
                </Link>
              </Button>
              <Button asChild variant="outline" size="xl" className="rounded-xl">
                <Link href="/dashboard">Owner login</Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
