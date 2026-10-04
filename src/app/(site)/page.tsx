import { Hero } from "@/components/landing/hero";
import { ListingGrid, ListingRow, OwnerBand, SectionHeader, SignInToBrowse, SizeBar } from "@/components/landing/home-sections";
import { getOptionalUser, publicApi } from "@/lib/api";
import { getFavoriteIds } from "@/lib/favorites";
import type { ListingPage } from "@/lib/types";

const BUDGET_MAX = 15000;

export default async function HomePage() {
  const [user, fresh, budget, favorites] = await Promise.all([
    getOptionalUser(),
    publicApi<ListingPage>("/listings/public/search", { limit: 6, offset: 0, sort_by: "created_at", sortOrder: "DESC" }),
    publicApi<ListingPage>("/listings/public/search", { limit: 8, offset: 0, max_rent: BUDGET_MAX, sort_by: "monthly_rent", sortOrder: "ASC" }),
    getFavoriteIds(),
  ]);
  const signedIn = !!user;

  return (
    <main>
      <Hero liveCount={fresh.ok ? fresh.data.totalItems : undefined} />
      <SizeBar className="container-page mt-8" />

      <section className="container-page grid gap-8 pt-16 pb-12 sm:pt-20">
        <SectionHeader title="Fresh listings" subtitle="The newest flats on Superflats" href="/explore" cta="See all flats" />
        {fresh.ok ? (
          fresh.data.listings.length ? (
            <ListingGrid listings={fresh.data.listings} favorites={favorites} signedIn={signedIn} priority />
          ) : (
            <p className="text-muted-foreground">No flats are listed right now. Check back soon.</p>
          )
        ) : (
          <SignInToBrowse />
        )}
      </section>

      {budget.ok && budget.data.listings.length > 0 && (
        <section className="container-page grid gap-6 pt-6 pb-16">
          <SectionHeader
            title={`Under ₹${BUDGET_MAX.toLocaleString("en-IN")} a month`}
            subtitle="Lowest rent first"
            href={`/explore?max_rent=${BUDGET_MAX}&sort=rent_asc`}
          />
          <ListingRow label="Budget flats" listings={budget.data.listings} favorites={favorites} signedIn={signedIn} />
        </section>
      )}

      <OwnerBand />
    </main>
  );
}
