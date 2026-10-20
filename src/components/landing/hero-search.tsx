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
  "h-11 w-full appearance-none rounded-full border border-black/[0.08] bg-white/80 pr-8 pl-10 text-[13.5px] text-foreground shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)] backdrop-blur-xl outline-none transition-all placeholder:text-muted-foreground/70 hover:border-black/20 focus:border-primary focus:bg-white focus:ring-4 focus:ring-black/[0.04]";

function Field({ label, icon: Icon, select, children }: { label: string; icon: typeof MapPin; select?: boolean; children: React.ReactNode }) {
  return (
    <label className="group grid min-w-0 gap-1.5">
      <span className="text-[12px] font-medium text-muted-foreground">{label}</span>
      <span className="relative flex items-center">
        <Icon className="pointer-events-none absolute left-3.5 size-4 text-muted-foreground transition-colors group-focus-within:text-foreground" aria-hidden />
        {children}
        {select && <ChevronDown className="pointer-events-none absolute right-3.5 size-3.5 text-muted-foreground transition-transform group-focus-within:rotate-180" aria-hidden />}
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
      <div role="tablist" aria-label="Search options" className="mb-3.5 inline-flex items-center gap-1.5 rounded-full bg-white/90 p-1.5 backdrop-blur-2xl border border-white/90 shadow-[0_4px_20px_rgba(0,0,0,0.08),inset_0_1px_1px_rgba(255,255,255,0.9)]">
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
                "flex h-9 items-center gap-2 rounded-full px-4.5 text-[13.5px] font-semibold transition-all duration-200 active:scale-95",
                active
                  ? "bg-[#1d1d1f] text-white shadow-sm"
                  : "text-slate-800 hover:text-black hover:bg-black/[0.05]",
              )}
            >
              <Icon className={cn("size-4", active ? "text-white" : "text-slate-700")} aria-hidden />
              {label}
            </button>
          );
        })}
      </div>

      <div className="rounded-[28px] border border-white/90 bg-white/75 p-5 backdrop-blur-3xl shadow-[0_24px_64px_-12px_rgba(0,0,0,0.1),0_0_0_1px_rgba(255,255,255,0.85)_inset] sm:p-6">
        {tab === "rent" ? (
          <form id="hero-panel-rent" role="tabpanel" aria-labelledby="hero-tab-rent" action="/explore" className="grid gap-3 md:grid-cols-[1.6fr_1fr_1fr_auto] md:items-end">
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
            <Button type="submit" variant="default" size="lg" className="w-full text-[14px] font-medium md:w-36 rounded-full bg-[#1d1d1f] text-white hover:bg-black shadow-sm active:scale-95 transition-all">
              <Search className="size-4" aria-hidden /> Search
            </Button>
          </form>
        ) : (
          <div id="hero-panel-owners" role="tabpanel" aria-labelledby="hero-tab-owners" className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between px-2 py-1">
            <div>
              <p className="text-[17px] font-semibold text-foreground">Have a property to rent out?</p>
              <p className="mt-1 text-[13.5px] text-muted-foreground">List your flats, manage viewings, tenants and monthly rent from one dashboard.</p>
            </div>
            <div className="flex shrink-0 flex-wrap gap-2.5">
              <Button asChild variant="default" size="lg" className="rounded-full bg-[#1d1d1f] text-white hover:bg-black text-[13.5px] shadow-sm">
                <Link href="/register?type=owner">
                  List your property <ArrowRight aria-hidden className="size-3.5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-full text-[13.5px]">
                <Link href="/dashboard">Owner login</Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
