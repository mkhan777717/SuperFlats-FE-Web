/** Browser-side calls go through the `/api/sf` route handler, which adds the session token. */
export async function clientApi<T>(path: string, init: RequestInit = {}): Promise<T> {
  const isForm = init.body instanceof FormData;
  const res = await fetch(`/api/sf${path}`, {
    ...init,
    headers: {
      Accept: "application/json",
      ...(init.body && !isForm ? { "Content-Type": "application/json" } : {}),
      ...init.headers,
    },
  });

  if (res.status === 401) {
    // A full reload (not router.push) drops any in-memory state from the expired session.
    // eslint-disable-next-line @next/next/no-location-assign-relative-destination
    window.location.assign(`/login?next=${encodeURIComponent(window.location.pathname)}&expired=1`);
    throw new Error("Your session expired. Please sign in again.");
  }

  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body.message ?? body.error ?? "Something went wrong. Please try again.");
  return body as T;
}
