import type { Flat, Listing, Photo } from "./types";

const inr = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 });

/** ₹45,000 */
export const formatRupees = (value: string | number | null | undefined) => {
  const n = Number(value ?? 0);
  return `₹${inr.format(Number.isFinite(n) ? n : 0)}`;
};

export const formatArea = (value: string | number | null | undefined) => {
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? `${inr.format(n)} sqft` : null;
};

export const formatDateTime = (iso: string) =>
  new Date(iso).toLocaleString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
  });

export const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

export const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]!.toUpperCase())
    .join("");

/**
 * Amenity columns are JSON in MySQL; depending on the driver they arrive either as an
 * array or as a JSON-encoded string (the mobile app has a fix branch for the same issue).
 */
export const toStringArray = (value: unknown): string[] => {
  if (Array.isArray(value)) return value.map(String);
  if (typeof value === "string" && value.trim()) {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed.map(String) : [value];
    } catch {
      return value.split(",").map((s) => s.trim()).filter(Boolean);
    }
  }
  return [];
};

export const sortedPhotos = (flat?: Pick<Flat, "photos"> | null): Photo[] =>
  [...(flat?.photos ?? [])].sort((a, b) => Number(b.is_primary) - Number(a.is_primary));

export const coverPhoto = (listing: Pick<Listing, "flat">) => sortedPhotos(listing.flat)[0]?.photo_url ?? null;

export const listingLocation = (listing: Pick<Listing, "flat">) => {
  const p = listing.flat?.property;
  if (!p) return "";
  return [p.address, p.city].filter(Boolean).join(", ");
};
