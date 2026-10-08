"use client";

import "leaflet/dist/leaflet.css";
import type { Map as LeafletMap, Marker } from "leaflet";
import { useEffect, useRef, useState } from "react";
import { LocateFixed, MapPin } from "lucide-react";
import { PlaceSearch } from "@/components/listings/place-search";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export type Coords = { lat: number; lng: number } | null;

const INDIA_CENTER: [number, number] = [21.5, 78.9];
const round = (n: number) => Number(n.toFixed(6));

/**
 * Pick a property's map location: search a place, click/drag the pin, or use the
 * device's location. Renters see this pin on the map view.
 */
export function LocationPicker({ value, onChange }: { value: Coords; onChange: (c: Coords) => void }) {
  const el = useRef<HTMLDivElement>(null);
  const map = useRef<LeafletMap | null>(null);
  const marker = useRef<Marker | null>(null);
  const onChangeRef = useRef(onChange);
  const [ready, setReady] = useState(false);
  const [locating, setLocating] = useState(false);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const L = await import("leaflet");
      if (cancelled || !el.current || map.current) return;
      const m = L.map(el.current, { scrollWheelZoom: false }).setView(value ? [value.lat, value.lng] : INDIA_CENTER, value ? 16 : 5);
      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(m);
      m.on("click", (e) => onChangeRef.current({ lat: round(e.latlng.lat), lng: round(e.latlng.lng) }));
      map.current = m;
      setReady(true);
    })();
    return () => {
      cancelled = true;
      map.current?.remove();
      map.current = null;
      marker.current = null;
    };
    // Created once; later value changes are handled below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keep the draggable pin in sync with the chosen coordinates.
  useEffect(() => {
    if (!ready || !map.current) return;
    (async () => {
      const L = await import("leaflet");
      const m = map.current;
      if (!m) return;
      if (!value) {
        marker.current?.remove();
        marker.current = null;
        return;
      }
      if (!marker.current) {
        const icon = L.divIcon({ className: "sf-location-pin", html: "<span></span>", iconSize: [0, 0], iconAnchor: [0, 0] });
        marker.current = L.marker([value.lat, value.lng], { draggable: true, icon }).addTo(m);
        marker.current.on("dragend", () => {
          const p = marker.current!.getLatLng();
          onChangeRef.current({ lat: round(p.lat), lng: round(p.lng) });
        });
      } else {
        marker.current.setLatLng([value.lat, value.lng]);
      }
      if (!m.getBounds().contains([value.lat, value.lng]) || m.getZoom() < 14) m.setView([value.lat, value.lng], 16);
    })();
  }, [ready, value]);

  const useMyLocation = () => {
    if (!("geolocation" in navigator)) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setLocating(false);
        onChange({ lat: round(coords.latitude), lng: round(coords.longitude) });
      },
      () => setLocating(false),
      { enableHighAccuracy: true, timeout: 10000 },
    );
  };

  return (
    <div className="grid gap-3">
      <Label>Map location</Label>
      <PlaceSearch onSelect={(p) => onChange({ lat: round(p.lat), lng: round(p.lng) })} />
      <div className="relative isolate h-64 overflow-hidden rounded-sm border bg-muted">
        <div ref={el} className="absolute inset-0 z-0" role="region" aria-label="Choose the property's location on the map" />
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <MapPin className="size-3.5" aria-hidden />
          {value ? `${value.lat}, ${value.lng} · drag the pin to adjust` : "Search a place or click on the map to drop a pin"}
        </span>
        <span className="flex gap-1">
          <Button type="button" variant="ghost" size="sm" loading={locating} onClick={useMyLocation} className="normal-case tracking-normal">
            <LocateFixed aria-hidden /> Use my location
          </Button>
          {value && (
            <Button type="button" variant="ghost" size="sm" onClick={() => onChange(null)} className="normal-case tracking-normal">
              Clear
            </Button>
          )}
        </span>
      </div>
    </div>
  );
}
