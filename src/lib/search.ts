import { FLAT_TYPES, flatTypeToQuery } from "./config";

export const PAGE_SIZE = 12;

export const SORTS = {
  newest: { label: "Newest first", sort_by: "created_at", sortOrder: "DESC" },
  rent_asc: { label: "Rent: low to high", sort_by: "monthly_rent", sortOrder: "ASC" },
  rent_desc: { label: "Rent: high to low", sort_by: "monthly_rent", sortOrder: "DESC" },
} as const;

export type SortKey = keyof typeof SORTS;

export const RADII = [1, 2, 5, 10] as const;

export type SearchFilters = {
  keywords: string;
  city: string;
  type: string;
  min_rent: string;
  max_rent: string;
  sort: SortKey;
  page: number;
  /** "Near a place": label shown to the user plus coordinates from Google Places. */
  near: string;
  lat: string;
  lng: string;
  radius: string;
};

type Params = Record<string, string | string[] | undefined>;

const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v)?.trim() ?? "";
const digits = (v: string) => (/^\d+$/.test(v) ? v : "");
const coord = (v: string, max: number) => {
  const n = Number(v);
  return v && Number.isFinite(n) && Math.abs(n) <= max ? v : "";
};

/** Read and sanitise the Explore page query string. */
export function parseFilters(params: Params): SearchFilters {
  const type = one(params.type);
  const sort = one(params.sort) as SortKey;
  const page = Number.parseInt(one(params.page), 10);
  const lat = coord(one(params.lat), 90);
  const lng = coord(one(params.lng), 180);
  const radius = one(params.radius);
  const hasNear = !!(lat && lng);
  return {
    keywords: one(params.keywords).slice(0, 100),
    city: one(params.city).slice(0, 60),
    type: (FLAT_TYPES as readonly string[]).includes(type) ? type : "",
    min_rent: digits(one(params.min_rent)),
    max_rent: digits(one(params.max_rent)),
    sort: sort in SORTS ? sort : "newest",
    page: Number.isFinite(page) && page > 0 ? page : 1,
    near: hasNear ? one(params.near).slice(0, 120) : "",
    lat: hasNear ? lat : "",
    lng: hasNear ? lng : "",
    radius: hasNear ? (RADII.map(String).includes(radius) ? radius : "5") : "",
  };
}

/** Query for GET /listings/public/search. */
export function toApiQuery(f: SearchFilters) {
  const sort = SORTS[f.sort];
  return {
    keywords: f.keywords,
    city: f.city,
    type: f.type ? flatTypeToQuery(f.type) : "",
    min_rent: f.min_rent,
    max_rent: f.max_rent,
    sort_by: sort.sort_by,
    sortOrder: sort.sortOrder,
    limit: PAGE_SIZE,
    offset: (f.page - 1) * PAGE_SIZE,
    landmark_coords: f.lat && f.lng ? JSON.stringify([{ lat: Number(f.lat), lng: Number(f.lng), radius_km: Number(f.radius || 5) }]) : "",
  };
}

/** Explore URL for the given filters, dropping empty values and the default sort/page. */
export function exploreHref(f: Partial<SearchFilters>) {
  const qs = new URLSearchParams();
  for (const [key, value] of Object.entries(f)) {
    if (value === "" || value === undefined) continue;
    if (key === "sort" && value === "newest") continue;
    if (key === "page" && value === 1) continue;
    qs.set(key, String(value));
  }
  const s = qs.toString();
  return s ? `/explore?${s}` : "/explore";
}

export const activeFilterCount = (f: SearchFilters) =>
  [f.city, f.type, f.min_rent || f.max_rent, f.near].filter(Boolean).length;
