import "server-only";
import { cache } from "react";
import { publicApi } from "./api";
import { getAccessToken } from "./session";
import type { ListingPage } from "./types";

/** IDs of the listings the signed-in user has saved, so hearts render filled. Empty when signed out. */
export const getFavoriteIds = cache(async (): Promise<Set<number>> => {
  if (!(await getAccessToken())) return new Set();
  const res = await publicApi<ListingPage>("/favorites", { limit: 200, offset: 0 });
  return new Set(res.ok ? res.data.listings.map((l) => l.id) : []);
});
