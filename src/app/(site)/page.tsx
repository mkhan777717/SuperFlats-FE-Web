import { Hero } from "@/components/landing/hero";
import { BrowseBySize, ListingGrid, OwnerBand, SectionHeader, SignInToBrowse } from "@/components/landing/home-sections";
import { getOptionalUser, publicApi } from "@/lib/api";
import { getFavoriteIds } from "@/lib/favorites";
import type { ListingPage } from "@/lib/types";

const BUDGET_MAX = 15000;

export default async function HomePage() {
  const [user, recent, budget, favorites] = await Promise.all([
    getOptionalUser(),
    publicApi<ListingPage>("/listings/public/search", { limit: 6, offset: 0, sort_by: "created_at", sortOrder: "DESC" }),
    publicApi<ListingPage>("/listings/public/search", { limit: 3, offset: 0, max_rent: BUDGET_MAX, sort_by: "monthly_rent", sortOrder: "ASC" }),
    getFavoriteIds(),
  ]);
  const signedIn = !!user;

  return (
    <main>
      <Hero liveCount={recent.ok ? recent.data.totalItems : undefined} />

      <div className="bg-card">
        <section className="container-page grid gap-8 py-14 sm:py-16">
          <SectionHeader title="Most recent listings" href="/explore" />
          {recent.ok ? (
            recent.data.listings.length ? (
              <ListingGrid listings={recent.data.listings} favorites={favorites} signedIn={signedIn} priority />
            ) : (
              <p className="text-muted-foreground">No flats are listed right now. Check back soon.</p>
            )
          ) : (
            <SignInToBrowse />
          )}
        </section>

        {budget.ok && budget.data.listings.length > 0 && (
          <section className="container-page grid gap-8 pb-14 sm:pb-16">
            <SectionHeader title={`Under ₹${BUDGET_MAX.toLocaleString("en-IN")} a month`} href={`/explore?max_rent=${BUDGET_MAX}&sort=rent_asc`} cta="See all budget flats" />
            <ListingGrid listings={budget.data.listings} favorites={favorites} signedIn={signedIn} />
          </section>
        )}
      </div>

      <section className="container-page py-16 sm:py-20">
        <BrowseBySize />
      </section>

      <OwnerBand />
    </main>
  );
}
