"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Loader2, MapPin, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { clientApi } from "@/lib/client-api";
import { cn } from "@/lib/utils";

type Suggestion = { description: string; placeId: string };
export type Place = { label: string; lat: number; lng: number };

/**
 * Google Places autocomplete through the backend proxy
 * (GET /places/search/suggestions, POST /places/details), restricted to India.
 */
export function PlaceSearch({ defaultValue = "", onSelect, autoFocus }: { defaultValue?: string; onSelect: (place: Place) => void; autoFocus?: boolean }) {
  const listId = useId();
  const [query, setQuery] = useState(defaultValue);
  const [items, setItems] = useState<Suggestion[]>([]);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const skipNext = useRef(true);
  // Suggestions only make sense for 3+ characters; older results are hidden, not cleared.
  const visible = query.trim().length >= 3 ? items : [];

  useEffect(() => {
    if (skipNext.current) {
      skipNext.current = false;
      return;
    }
    if (query.trim().length < 3) return;
    const handle = setTimeout(async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await clientApi<{ suggestions: Suggestion[] }>(`/places/search/suggestions?query=${encodeURIComponent(query.trim())}`);
        setItems(res.suggestions ?? []);
        setOpen(true);
        setActive(-1);
      } catch {
        setError("Place search is unavailable right now.");
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => clearTimeout(handle);
  }, [query]);

  async function choose(s: Suggestion) {
    setOpen(false);
    skipNext.current = true;
    setQuery(s.description);
    setLoading(true);
    try {
      const { lat, lng } = await clientApi<{ lat: number; lng: number }>("/places/details", {
        method: "POST",
        body: JSON.stringify({ placeId: s.placeId }),
      });
      onSelect({ label: s.description, lat, lng });
    } catch {
      setError("Couldn't find that place. Try another one.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative">
      <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
      <Input
        role="combobox"
        aria-expanded={open && visible.length > 0}
        aria-controls={listId}
        aria-autocomplete="list"
        autoFocus={autoFocus}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => visible.length && setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        onKeyDown={(e) => {
          if (!open || !visible.length) return;
          if (e.key === "ArrowDown") {
            e.preventDefault();
            setActive((a) => Math.min(a + 1, visible.length - 1));
          } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setActive((a) => Math.max(a - 1, 0));
          } else if (e.key === "Enter" && active >= 0) {
            e.preventDefault();
            choose(visible[active]!);
          } else if (e.key === "Escape") {
            setOpen(false);
          }
        }}
        placeholder="Office, college, metro station…"
        className="h-11 pr-10 pl-10"
      />
      {loading && <Loader2 className="absolute top-1/2 right-3.5 size-4 -translate-y-1/2 animate-spin text-muted-foreground" aria-hidden />}
      {open && visible.length > 0 && (
        <ul id={listId} role="listbox" className="absolute inset-x-0 top-full z-50 mt-1.5 max-h-72 overflow-auto rounded-xl border bg-popover p-1 shadow-lift">
          {visible.map((s, i) => (
            <li
              key={s.placeId}
              role="option"
              aria-selected={i === active}
              onMouseDown={(e) => {
                e.preventDefault();
                choose(s);
              }}
              className={cn("flex cursor-pointer items-start gap-2.5 rounded-lg px-3 py-2.5 text-sm", i === active ? "bg-muted" : "hover:bg-muted")}
            >
              <MapPin className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
              {s.description}
            </li>
          ))}
        </ul>
      )}
      {error && <p className="mt-1.5 text-xs text-destructive">{error}</p>}
    </div>
  );
}
