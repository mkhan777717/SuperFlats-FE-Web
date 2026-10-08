"use client";

import { useEffect, useState } from "react";
import { clientApi } from "@/lib/client-api";

/**
 * Loads options for a dropdown from the backend (e.g. properties, available flats).
 * Pass `null` as the path to skip loading until a parent choice is made.
 */
export function useOptions<T>(path: string | null, pick: (data: unknown) => T[]) {
  const [state, setState] = useState<{ path: string | null; items: T[]; error?: string; loading: boolean }>({ path: null, items: [], loading: false });

  useEffect(() => {
    if (!path) return;
    let cancelled = false;
    // Defer so the loading state isn't set synchronously inside the effect.
    Promise.resolve()
      .then(() => {
        if (!cancelled) setState({ path, items: [], loading: true });
        return clientApi<unknown>(path);
      })
      .then((data) => !cancelled && setState({ path, items: pick(data), loading: false }))
      .catch((e) => !cancelled && setState({ path, items: [], loading: false, error: e instanceof Error ? e.message : "Couldn't load options" }));
    return () => {
      cancelled = true;
    };
    // `pick` is a stable selector supplied inline by callers.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path]);

  return path && state.path === path ? state : { items: [] as T[], loading: !!path, error: undefined };
}
