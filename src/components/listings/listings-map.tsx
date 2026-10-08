"use client";

import "leaflet/dist/leaflet.css";
import type { LatLngBounds, Map as LeafletMap, Marker } from "leaflet";
import { useEffect, useRef, useState } from "react";
import { MapPinOff, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { coverPhoto, formatCompactRupees, formatRupees } from "@/lib/format";
import { RADII } from "@/lib/search";
import type { Listing } from "@/lib/types";
import { useExplore } from "./explore-shell";

const INDIA_CENTER: [number, number] = [21.5, 78.9];

type Pin = { listing: Listing; lat: number; lng: number };

const pinsFor = (listings: Listing[]): Pin[] =>
  listings.flatMap((listing) => {
    const lat = Number(listing.flat?.property?.latitude);
    const lng = Number(listing.flat?.property?.longitude);
    return Number.isFinite(lat) && Number.isFinite(lng) && (lat !== 0 || lng !== 0) ? [{ listing, lat, lng }] : [];
  });

const escapeHtml = (v: string) => v.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

/** Smallest supported search radius (km) that covers the visible map. */
function radiusFor(bounds: LatLngBounds) {
  const km = bounds.getCenter().distanceTo(bounds.getNorthEast()) / 1000;
  return RADII.find((r) => r >= km) ?? RADII[RADII.length - 1];
}

/**
 * Map of the current results with a price pin per property. Moving the map offers
 * "Search this area", which re-runs the search around the map centre.
 */
export function ListingsMap({ listings }: { listings: Listing[] }) {
  const { apply, pending } = useExplore();
  const el = useRef<HTMLDivElement>(null);
  const map = useRef<LeafletMap | null>(null);
  const markers = useRef<Marker[]>([]);
  const fitting = useRef(false);
  const [moved, setMoved] = useState(false);
  const [ready, setReady] = useState(false);
  const pins = pinsFor(listings);

  // Create the map once (Leaflet needs `window`, so it is imported on the client only).
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const L = await import("leaflet");
      if (cancelled || !el.current || map.current) return;
      const m = L.map(el.current, { zoomControl: false, scrollWheelZoom: true }).setView(INDIA_CENTER, 5);
      L.control.zoom({ position: "bottomright" }).addTo(m);
      // OpenStreetMap's public tiles: free, no key, attribution required. For heavy production
      // traffic, switch this URL to a hosted tile provider (see OSM tile usage policy).
      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(m);
      m.on("moveend", () => {
        if (fitting.current) fitting.current = false;
        else setMoved(true);
      });
      map.current = m;
      setReady(true);
    })();
    return () => {
      cancelled = true;
      map.current?.remove();
      map.current = null;
    };
  }, []);

  // Redraw pins whenever the results change.
  useEffect(() => {
    if (!ready || !map.current) return;
    let cancelled = false;
    (async () => {
      const L = await import("leaflet");
      if (cancelled || !map.current) return;
      markers.current.forEach((mk) => mk.remove());
      markers.current = pins.map(({ listing, lat, lng }) => {
        const photo = coverPhoto(listing);
        const icon = L.divIcon({
          className: "sf-price-pin",
          html: `<span>${escapeHtml(formatCompactRupees(listing.monthly_rent))}</span>`,
          // Zero-size anchor at the exact point; the label is centred above it with CSS.
          iconSize: [0, 0],
          iconAnchor: [0, 0],
        });
        const popup = `
          <a href="/listings/${listing.id}" class="sf-map-card">
            ${photo ? `<img src="${escapeHtml(photo)}" alt="" />` : ""}
            <strong>${escapeHtml(formatRupees(listing.monthly_rent))} <small>/ month</small></strong>
            <span>${escapeHtml(listing.title)}</span>
            <em>${escapeHtml([listing.flat?.type, listing.flat?.property?.city].filter(Boolean).join(" · "))}</em>
          </a>`;
        return L.marker([lat, lng], { icon, title: listing.title }).bindPopup(popup, { closeButton: false, offset: [0, -8], minWidth: 220 }).addTo(map.current!);
      });
      if (pins.length) {
        fitting.current = true;
        map.current.fitBounds(L.latLngBounds(pins.map((p) => [p.lat, p.lng] as [number, number])), { padding: [48, 48], maxZoom: 15 });
      }
      setMoved(false);
    })();
    return () => {
      cancelled = true;
    };
    // pins is derived from listings; re-run only when the result set changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, listings]);

  const searchArea = () => {
    const m = map.current;
    if (!m) return;
    const c = m.getCenter();
    apply({ near: "Map area", lat: c.lat.toFixed(5), lng: c.lng.toFixed(5), radius: String(radiusFor(m.getBounds())), city: "", keywords: "" });
  };

  return (
    <div className="relative isolate h-[70vh] min-h-[420px] overflow-hidden rounded-sm border bg-muted">
      <div ref={el} className="absolute inset-0 z-0" aria-label="Map of properties" role="region" />

      {moved && (
        <Button onClick={searchArea} loading={pending} size="sm" className="absolute top-4 left-1/2 z-[500] -translate-x-1/2 shadow-lift">
          <Search aria-hidden /> Search this area
        </Button>
      )}

      {ready && !pins.length && (
        <div className="absolute inset-x-4 bottom-4 z-[500] flex items-center gap-3 rounded-sm border bg-card px-4 py-3 text-sm shadow-lift sm:right-auto sm:max-w-sm">
          <MapPinOff className="size-5 shrink-0 text-muted-foreground" aria-hidden />
          {listings.length ? "These properties don't have a map location yet." : "No properties here. Move the map and search this area."}
        </div>
      )}
      {ready && pins.length > 0 && pins.length < listings.length && (
        <p className="absolute bottom-4 left-4 z-[500] rounded-sm bg-card/95 px-3 py-1.5 text-xs text-muted-foreground shadow-soft">
          {listings.length - pins.length} of {listings.length} without a map location
        </p>
      )}
    </div>
  );
}
