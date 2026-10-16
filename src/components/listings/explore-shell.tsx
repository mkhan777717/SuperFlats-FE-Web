"use client";

import { useRouter } from "next/navigation";
import { createContext, useContext, useTransition, type ReactNode } from "react";
import { exploreHref, type SearchFilters } from "@/lib/search";
import { cn } from "@/lib/utils";

type Ctx = { filters: SearchFilters; apply: (patch: Partial<SearchFilters>) => void; pending: boolean };
const ExploreCtx = createContext<Ctx | null>(null);

export const useExplore = () => {
  const ctx = useContext(ExploreCtx);
  if (!ctx) throw new Error("useExplore must be used inside <ExploreShell>");
  return ctx;
};

/**
 * Holds the current filters and navigates on change. Results stay server-rendered;
 * while the next page loads they fade so the user sees the filter took effect.
 */
export function ExploreShell({ filters, controls, children }: { filters: SearchFilters; controls: ReactNode; children: ReactNode }) {
  const router = useRouter();
  const [pending, start] = useTransition();

  const apply = (patch: Partial<SearchFilters>) => {
    const next = { ...filters, page: 1, ...patch };
    const href = exploreHref(next);
    start(() => {
      router.push(href, { scroll: false });
      // Force re-fetch when URL would be the same (e.g. clearing all filters from /explore)
      router.refresh();
    });
  };

  return (
    <ExploreCtx.Provider value={{ filters, apply, pending }}>
      {controls}
      <div aria-busy={pending} className={cn("transition-opacity duration-200", pending && "pointer-events-none opacity-50")}>
        {children}
      </div>
    </ExploreCtx.Provider>
  );
}
