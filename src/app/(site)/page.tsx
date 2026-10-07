import { Hero } from "@/components/landing/hero";
import { ListingGrid, OwnerBand, PopularSearches, PropertyTypes, SectionHeader, SignInToBrowse } from "@/components/landing/home-sections";
import { getOptionalUser, publicApi } from "@/lib/api";
import { getFavoriteIds } from "@/lib/favorites";
import type { ListingPage } from "@/lib/types";

export default async function HomePage() {
  const [user, latest, favorites] = await Promise.all([
    getOptionalUser(),
    publicApi<ListingPage>("/listings/public/search", { limit: 8, offset: 0, sort_by: "created_at", sortOrder: "DESC" }),
    getFavoriteIds(),
  ]);

  return (
    <main>
      <Hero />

      <section className="container-page py-14">
        <SectionHeader title="Latest properties for rent" href="/explore" />
        <div className="mt-6">
          {latest.ok ? (
            latest.data.listings.length ? (
              <ListingGrid listings={latest.data.listings} favorites={favorites} signedIn={!!user} priority />
            ) : (
              <p className="text-muted-foreground">No properties are listed right now. Please check back soon.</p>
            )
          ) : (
            <SignInToBrowse />
          )}
        </div>
      </section>

      <PropertyTypes />
      <PopularSearches />
      <OwnerBand />
    </main>
  );
}
