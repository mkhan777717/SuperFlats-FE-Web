import type { Metadata } from "next";
import { SearchX } from "lucide-react";
import { ListingCard } from "@/components/listings/listing-card";
import { SearchFilters } from "@/components/listings/search-filters";
import { ButtonLink } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Pagination } from "@/components/ui/pagination";
import { api, getCurrentUser } from "@/lib/api";
import { exploreHref, parseFilters, toApiQuery } from "@/lib/search";
import type { ListingPage } from "@/lib/types";

export const metadata: Metadata = { title: "Explore flats" };

export default async function ExplorePage({ searchParams }: PageProps<"/explore">) {
  const params = await searchParams;
  const filters = parseFilters(params);
  const returnTo = exploreHref(filters);

  const [user, result] = await Promise.all([
    getCurrentUser(),
    api<ListingPage>("/listings/public/search", { query: toApiQuery(filters), returnTo }),
  ]);

  const firstName = user?.name.split(" ")[0];
  const heading = filters.keywords ? `Results for “${filters.keywords}”` : filters.city ? `Flats in ${filters.city}` : "Find your next home";

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <section className="hero-gradient relative overflow-hidden rounded-[1.75rem] px-6 py-8 text-white sm:px-10 sm:py-10">
        <div className="absolute -right-16 -top-20 size-64 rounded-full bg-white/10" aria-hidden />
        <div className="absolute -bottom-24 right-24 size-48 rounded-full bg-white/5" aria-hidden />
        <p className="relative text-white/80">{firstName ? `Welcome back, ${firstName}` : "Welcome"}</p>
        <h1 className="relative mt-1 text-3xl font-bold sm:text-4xl">{heading}</h1>
        <p className="relative mt-3 text-lg text-white/85">
          {result.totalItems === 1 ? "1 flat available" : `${result.totalItems.toLocaleString("en-IN")} flats available`}
        </p>
      </section>

      <SearchFilters filters={filters} />

      {result.listings.length ? (
        <>
          <ul className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {result.listings.map((listing, i) => (
              <li key={listing.id}>
                <ListingCard listing={listing} priority={i < 3} />
              </li>
            ))}
          </ul>
          <Pagination page={filters.page} totalPages={result.totalPages} href={(page) => exploreHref({ ...filters, page })} />
        </>
      ) : (
        <EmptyState
          icon={SearchX}
          title="No flats match your search"
          action={
            <ButtonLink href="/explore" variant="outline">
              Clear filters
            </ButtonLink>
          }
        >
          Try another city, a wider rent range or a different flat type.
        </EmptyState>
      )}
    </div>
  );
}
