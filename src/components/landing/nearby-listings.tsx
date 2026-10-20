"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { ArrowRight, Loader2, LocateFixed, MapPinOff } from "lucide-react";
import { FavoriteButton } from "@/components/listings/favorite-button";
import { ListingCard } from "@/components/listings/listing-card";
import { Button } from "@/components/ui/button";
import type { Listing, ListingPage } from "@/lib/types";

type Coords = { lat: number; lng: number };
type State =
  | { status: "idle" | "locating" | "loading" | "unavailable" | "denied" | "locked" | "error" }
  | { status: "ready"; listings: Listing[]; radius: number; total: number; coords: Coords };

const CACHE_KEY = "sf-geo";
/** Try close by first, then widen so people in quieter areas still see something. */
const RADII = [5, 25];

const readCache = (): Coords | null => {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    return raw ? (JSON.parse(raw) as Coords) : null;
  } catch {
    return null;
  }
};

async function searchNear({ lat, lng }: Coords, radius: number) {
  const params = new URLSearchParams({
    limit: "8",
    offset: "0",
    landmark_coords: JSON.stringify([{ lat, lng, radius_km: radius }]),
  });
  // Plain fetch (not clientApi): a 401 here only means browsing still needs login, not that a session expired.
  const res = await fetch(`/api/sf/listings/public/search?${params}`, { headers: { Accept: "application/json" } });
  if (res.status === 401) return "locked" as const;
  if (!res.ok) throw new Error(String(res.status));
  return (await res.json()) as ListingPage;
}

/**
 * "Flats near you": asks for the visitor's location when the home page opens and lists
 * flats within 5 km (or 25 km if nothing is that close). Coordinates stay in this tab only.
 */
export function NearbyListings({ signedIn, favoriteIds }: { signedIn: boolean; favoriteIds: number[] }) {
  const [state, setState] = useState<State>({ status: "idle" });
  const [favorites] = useState(() => new Set(favoriteIds));

  const load = useCallback(async (coords: Coords) => {
    setState({ status: "loading" });
    try {
      for (const radius of RADII) {
        const result = await searchNear(coords, radius);
        if (result === "locked") return setState({ status: "locked" });
        if (result.listings.length || radius === RADII[RADII.length - 1]) {
          return setState({ status: "ready", listings: result.listings, total: result.totalItems, radius, coords });
        }
      }
    } catch {
      setState({ status: "error" });
    }
  }, []);

  const locate = useCallback(() => {
    if (!("geolocation" in navigator)) return setState({ status: "unavailable" });
    setState({ status: "locating" });
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const c = { lat: Number(coords.latitude.toFixed(5)), lng: Number(coords.longitude.toFixed(5)) };
        try {
          sessionStorage.setItem(CACHE_KEY, JSON.stringify(c));
        } catch {}
        load(c);
      },
      (err) => setState({ status: err.code === err.PERMISSION_DENIED ? "denied" : "unavailable" }),
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 10 * 60 * 1000 },
    );
  }, [load]);

  // Ask as soon as the page opens (unless the browser already knows the answer is "no").
  // Everything runs after the first render so the server and client HTML match.
  useEffect(() => {
    let cancelled = false;
    const start = async () => {
      await Promise.resolve();
      if (cancelled) return;
      const cached = readCache();
      if (cached) return load(cached);
      if (!("geolocation" in navigator)) return setState({ status: "unavailable" });
      try {
        const perm = await navigator.permissions?.query({ name: "geolocation" as PermissionName });
        if (cancelled) return;
        if (perm?.state === "denied") return setState({ status: "denied" });
      } catch {}
      locate();
    };
    start();
    return () => {
      cancelled = true;
    };
  }, [load, locate]);

  // Nothing useful to show: browser can't locate, or listings still need a login (the section below explains that).
  if (state.status === "unavailable" || state.status === "locked" || state.status === "error") return null;

  return (
    <section className="container-page pt-14" aria-live="polite">
      <div className="flex items-end justify-between gap-6">
        <div>
          <h2 className="font-display text-2xl font-semibold tracking-[-0.025em] text-foreground sm:text-[1.85rem]">Flats near you</h2>
          {state.status === "ready" && (
            <p className="mt-1 text-[14px] text-muted-foreground">
              {state.total ? `${state.total.toLocaleString("en-IN")} within ${state.radius} km of your location` : `No flats within ${state.radius} km yet`}
            </p>
          )}
        </div>
        {state.status === "ready" && state.total > 0 && (
          <Link
            href={`/explore?near=you&lat=${state.coords.lat}&lng=${state.coords.lng}&radius=${state.radius}`}
            className="group inline-flex items-center gap-1 text-[13.5px] font-medium text-link hover:underline"
          >
            View all <ArrowRight className="size-3.5 transition group-hover:translate-x-0.5" aria-hidden />
          </Link>
        )}
      </div>

      <div className="mt-6">
        {(state.status === "idle" || state.status === "locating" || state.status === "loading") && (
          <div className="flex items-center gap-3 rounded-[22px] border border-black/[0.06] bg-white px-6 py-6 text-muted-foreground shadow-sm">
            <Loader2 className="size-4 animate-spin text-foreground" aria-hidden />
            <span className="text-[14px] font-medium text-foreground">{state.status === "loading" ? "Finding flats around you…" : "Waiting for your location…"}</span>
          </div>
        )}

        {state.status === "denied" && (
          <div className="flex flex-col gap-4 rounded-2xl border border-white/80 bg-white/70 px-6 py-6 sm:flex-row sm:items-center sm:justify-between backdrop-blur-xl shadow-sm">
            <p className="flex items-center gap-3 text-muted-foreground">
              <span className="grid size-9 place-items-center rounded-xl bg-destructive/10 text-destructive">
                <MapPinOff className="size-4 shrink-0" aria-hidden />
              </span>
              <span>Allow location access in your browser to see flats near you.</span>
            </p>
            <Button variant="outline" onClick={locate} className="shrink-0 rounded-xl">
              <LocateFixed className="size-4" aria-hidden /> Use my location
            </Button>
          </div>
        )}

        {state.status === "ready" && state.listings.length > 0 && (
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {state.listings.map((listing) => (
              <li key={listing.id}>
                <ListingCard
                  listing={listing}
                  action={<FavoriteButton listingId={listing.id} initial={favorites.has(listing.id)} signedIn={signedIn} />}
                />
              </li>
            ))}
          </ul>
        )}

        {state.status === "ready" && state.listings.length === 0 && (
          <div className="rounded-2xl border border-white/80 bg-white/70 px-6 py-6 text-muted-foreground backdrop-blur-xl shadow-sm">
            We don&apos;t have flats close to you yet. Browse the latest listings below or{" "}
            <Link href="/explore" className="font-semibold text-link hover:underline">
              search another area
            </Link>
            .
          </div>
        )}
      </div>
    </section>
  );
}
