import type { Metadata } from "next";
import { SearchX } from "lucide-react";
import { EmptyState } from "@/components/common/empty-state";
import { Pagination } from "@/components/common/pagination";
import { ListingGrid, SignInToBrowse } from "@/components/landing/home-sections";
import { ExploreShell } from "@/components/listings/explore-shell";
import { FavoriteButton } from "@/components/listings/favorite-button";
import { ListingCard } from "@/components/listings/listing-card";
import { ListingsMap } from "@/components/listings/listings-map";
import { ActiveFilters, SearchFilters } from "@/components/listings/search-filters";
import { getOptionalUser, publicApi } from "@/lib/api";
import { getFavoriteIds } from "@/lib/favorites";
import { exploreHref, parseFilters, toApiQuery } from "@/lib/search";
import type { ListingPage } from "@/lib/types";

export const metadata: Metadata = { title: "Explore flats" };

export default async function ExplorePage({ searchParams }: PageProps<"/explore">) {
  const filters = parseFilters(await searchParams);
  const [user, result, favorites] = await Promise.all([
    getOptionalUser(),
    publicApi<ListingPage>("/listings/public/search", toApiQuery(filters)),
    getFavoriteIds(),
  ]);

  const heading =
    filters.near === "you"
      ? "Flats near you"
      : filters.near === "Map area"
        ? "Flats in this area"
        : filters.near
          ? `Flats near ${filters.near.split(",")[0]}`
          : filters.city
            ? `Flats in ${filters.city}`
            : filters.type
              ? `${filters.type} flats for rent`
              : "Flats for rent";

  const pagination = result.ok && (
    <Pagination className="mt-4" page={filters.page} totalPages={result.data.totalPages} href={(page: number) => exploreHref({ ...filters, page })} />
  );

  return (
    <div className="grid gap-10">
      <ExploreShell
        filters={filters}
        controls={
          <header className="grid gap-6">
            <div>
              <p className="eyebrow">Properties for rent</p>
              <h1 className="mt-2 font-display text-3xl font-semibold sm:text-4xl">{heading}</h1>
              {result.ok && (
                <p className="mt-2 text-muted-foreground tabular">
                  {result.data.totalItems === 1 ? "1 flat available" : `${result.data.totalItems.toLocaleString("en-IN")} flats available`}
                </p>
              )}
            </div>
            <SearchFilters />
          </header>
        }
      >
        <div className="mt-8 grid gap-8">
          <ActiveFilters />
          {!result.ok ? (
            <SignInToBrowse />
          ) : filters.view === "map" ? (
            // Map view: results list on the left, sticky map on the right (map first on phones).
            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
              <div className="order-2 grid content-start gap-6 lg:order-1">
                {result.data.listings.length ? (
                  <ul className="grid gap-5 sm:grid-cols-2">
                    {result.data.listings.map((listing, i) => (
                      <li key={listing.id}>
                        <ListingCard
                          listing={listing}
                          priority={i < 2}
                          action={<FavoriteButton listingId={listing.id} initial={favorites.has(listing.id)} signedIn={!!user} />}
                        />
                      </li>
                    ))}
                  </ul>
                ) : (
                  <EmptyState icon={SearchX} title="No flats in this area">
                    Move the map and tap “Search this area”, or clear the filters above.
                  </EmptyState>
                )}
                {pagination}
              </div>
              <div className="order-1 lg:sticky lg:top-24 lg:order-2 lg:self-start">
                <ListingsMap listings={result.data.listings} />
              </div>
            </div>
          ) : result.data.listings.length ? (
            <>
              <ListingGrid listings={result.data.listings} favorites={favorites} signedIn={!!user} priority />
              {pagination}
            </>
          ) : (
            <EmptyState icon={SearchX} title="No flats match your search" className="mx-auto max-w-xl">
              Try a wider budget, another flat type or a bigger distance, or clear the filters above.
            </EmptyState>
          )}
        </div>
      </ExploreShell>
    </div>
  );
}
