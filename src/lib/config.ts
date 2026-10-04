export const SITE = {
  name: "Superflats",
  description:
    "Search rental flats listed by their owners, save the ones you like and book a visit — all in one place.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  supportEmail: process.env.NEXT_PUBLIC_SUPPORT_EMAIL ?? "support@superflats.in",
};

/** Base URL of the Superflats backend, including the `/api` prefix. Server-side only. */
export const API_URL = (process.env.SUPERFLATS_API_URL ?? "https://api.superflats.in/api").replace(/\/$/, "");

export const FLAT_TYPES = ["1RK", "1BHK", "2BHK", "3BHK", "3BHK+"] as const;
export type FlatType = (typeof FLAT_TYPES)[number];

/** The backend expects `3BHK_PLUS` in query strings because `+` is not URL-safe. */
export const flatTypeToQuery = (type: string) => (type === "3BHK+" ? "3BHK_PLUS" : type);
