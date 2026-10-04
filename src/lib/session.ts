import "server-only";
import { cookies } from "next/headers";
import type { Role } from "./types";

export const ACCESS_COOKIE = "sf_access";
export const REFRESH_COOKIE = "sf_refresh";
export const ROLE_COOKIE = "sf_role";

// The backend issues 360-day access tokens and 90-day refresh tokens.
const MAX_AGE = 60 * 60 * 24 * 90;

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: MAX_AGE,
};

export async function getAccessToken() {
  return (await cookies()).get(ACCESS_COOKIE)?.value ?? null;
}

export async function getRefreshToken() {
  return (await cookies()).get(REFRESH_COOKIE)?.value ?? null;
}

/** Only callable from Server Actions and Route Handlers. */
export async function setSession(tokens: { accessToken: string; refreshToken: string; role?: Role }) {
  const store = await cookies();
  store.set(ACCESS_COOKIE, tokens.accessToken, cookieOptions);
  store.set(REFRESH_COOKIE, tokens.refreshToken, cookieOptions);
  if (tokens.role) store.set(ROLE_COOKIE, tokens.role, cookieOptions);
}

/** Only callable from Server Actions and Route Handlers. */
export async function clearSession() {
  const store = await cookies();
  store.delete(ACCESS_COOKIE);
  store.delete(REFRESH_COOKIE);
  store.delete(ROLE_COOKIE);
}

/** Accept only same-site relative paths, so `?next=` can't redirect off-site. */
export function safeNext(next: unknown, fallback = "/explore") {
  return typeof next === "string" && next.startsWith("/") && !next.startsWith("//") && !next.startsWith("/\\") ? next : fallback;
}
