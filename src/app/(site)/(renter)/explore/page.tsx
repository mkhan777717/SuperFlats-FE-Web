import type { Metadata } from "next";
import { SearchX } from "lucide-react";
import { EmptyState } from "@/components/common/empty-state";
import { Pagination } from "@/components/common/pagination";
import { ExploreShell } from "@/components/listings/explore-shell";
import { ListingCard } from "@/components/listings/listing-card";
import { ActiveFilters, SearchFilters } from "@/components/listings/search-filters";
import { api } from "@/lib/api";
import { exploreHref, parseFilters, toApiQuery } from "@/lib/search";
import type { ListingPage } from "@/lib/types";

export const metadata: Metadata = { title: "Explore flats" };

export default async function ExplorePage({ searchParams }: PageProps<"/explore">) {
  const filters = parseFilters(await searchParams);
  const result = await api<ListingPage>("/listings/public/search", { query: toApiQuery(filters), returnTo: exploreHref(filters) });

  const heading = filters.near
    ? `Flats near ${filters.near.split(",")[0]}`
    : filters.city
      ? `Flats in ${filters.city}`
      : filters.type
        ? `${filters.type} flats for rent`
        : "Flats for rent";

  return (
    <div className="grid gap-10">
      <ExploreShell
        filters={filters}
        controls={
          <header className="grid gap-6 text-center">
            <div>
              <h1 className="text-3xl font-extrabold sm:text-4xl">{heading}</h1>
              <p className="mt-2 text-muted-foreground tabular">
                {result.totalItems === 1 ? "1 flat available" : `${result.totalItems.toLocaleString("en-IN")} flats available`}
              </p>
            </div>
            <SearchFilters />
          </header>
        }
      >
        <div className="mt-8 grid gap-8">
          <ActiveFilters />
          {result.listings.length ? (
            <>
              <ul className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
                {result.listings.map((listing, i) => (
                  <li key={listing.id}>
                    <ListingCard listing={listing} priority={i < 3} />
                  </li>
                ))}
              </ul>
              <Pagination className="mt-4" page={filters.page} totalPages={result.totalPages} href={(page: number) => exploreHref({ ...filters, page })} />
            </>
          ) : (
            <EmptyState icon={SearchX} title="No flats match your search" className="mx-auto max-w-xl">
              Try a wider budget, another flat type or a bigger distance — or clear the filters above.
            </EmptyState>
          )}
        </div>
      </ExploreShell>
    </div>
  );
}
