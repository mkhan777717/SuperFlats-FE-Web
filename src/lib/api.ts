import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { API_URL } from "./config";
import { getAccessToken } from "./session";
import type { User } from "./types";

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

/** The backend reports errors as `{ message }` or `{ error }` depending on the controller. */
export async function readError(res: Response) {
  try {
    const body = await res.json();
    return String(body.message ?? body.error ?? `Request failed (${res.status})`);
  } catch {
    return `Request failed (${res.status})`;
  }
}

type Query = Record<string, string | number | undefined | null>;

export function buildUrl(path: string, query?: Query) {
  const url = new URL(`${API_URL}${path.startsWith("/") ? path : `/${path}`}`);
  for (const [key, value] of Object.entries(query ?? {})) {
    if (value !== undefined && value !== null && value !== "") url.searchParams.set(key, String(value));
  }
  return url;
}

/**
 * Server-side call to the Superflats backend with the signed-in user's token.
 * A 401 sends the user through `/auth/refresh`, which rotates the tokens or signs them out.
 */
export async function api<T>(path: string, { query, returnTo, ...init }: RequestInit & { query?: Query; returnTo?: string } = {}): Promise<T> {
  const token = await getAccessToken();
  const res = await fetch(buildUrl(path, query), {
    ...init,
    cache: "no-store",
    headers: {
      Accept: "application/json",
      ...(init.body ? { "Content-Type": "application/json" } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init.headers,
    },
  });

  if (res.status === 401) {
    redirect(`/auth/refresh?next=${encodeURIComponent(returnTo ?? "/explore")}`);
  }
  if (!res.ok) throw new ApiError(res.status, await readError(res));
  return res.json() as Promise<T>;
}

/**
 * Signed-in user for public pages: never redirects, just returns null when there is
 * no valid session (expired tokens are handled once the visitor opens a private page).
 */
export const getOptionalUser = cache(async (): Promise<User | null> => {
  const token = await getAccessToken();
  if (!token) return null;
  try {
    const res = await fetch(buildUrl("/user/me"), {
      cache: "no-store",
      headers: { Accept: "application/json", Authorization: `Bearer ${token}` },
    });
    return res.ok ? ((await res.json()) as User) : null;
  } catch {
    return null;
  }
});

/** Profile of the signed-in user, deduplicated per request. Null when signed out. */
export const getCurrentUser = cache(async (): Promise<User | null> => {
  if (!(await getAccessToken())) return null;
  return api<User>("/user/me");
});
