import Link from "next/link";
import { ArrowRight, BedDouble, Building2, LogIn } from "lucide-react";
import { Sticker } from "@/components/common/decor";
import { FavoriteButton } from "@/components/listings/favorite-button";
import { ListingCard } from "@/components/listings/listing-card";
import { Button } from "@/components/ui/button";
import { FLAT_TYPES } from "@/lib/config";
import type { Listing } from "@/lib/types";

export function SectionHeader({ title, href, cta = "View all listings" }: { title: string; href?: string; cta?: string }) {
  return (
    <div className="flex items-end justify-between gap-4">
      <h2 className="text-2xl font-extrabold sm:text-3xl">{title}</h2>
      {href && (
        <Button asChild variant="outline" className="shrink-0">
          <Link href={href}>
            <span className="hidden sm:inline">{cta}</span>
            <span className="sm:hidden">View all</span>
            <ArrowRight aria-hidden />
          </Link>
        </Button>
      )}
    </div>
  );
}

export function ListingGrid({ listings, favorites, signedIn, priority }: { listings: Listing[]; favorites: Set<number>; signedIn: boolean; priority?: boolean }) {
  return (
    <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {listings.map((listing, i) => (
        <li key={listing.id}>
          <ListingCard
            listing={listing}
            priority={priority && i < 3}
            action={<FavoriteButton listingId={listing.id} initial={favorites.has(listing.id)} signedIn={signedIn} />}
          />
        </li>
      ))}
    </ul>
  );
}

/** Shown in place of listings while the backend still requires login to browse. */
export function SignInToBrowse() {
  return (
    <div className="brutal flex flex-col items-center rounded-3xl bg-card px-6 py-14 text-center">
      <span className="grid size-14 place-items-center rounded-2xl border-2 border-ink bg-accent text-accent-foreground">
        <LogIn className="size-6" aria-hidden />
      </span>
      <h3 className="mt-5 text-xl font-bold">Sign in to see all flats</h3>
      <p className="mt-1.5 max-w-sm text-muted-foreground">Create a free account or sign in to browse listings, save favourites and book visits.</p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Button asChild size="lg">
          <Link href="/register">Sign up free</Link>
        </Button>
        <Button asChild size="lg" variant="outline">
          <Link href="/login">Log in</Link>
        </Button>
      </div>
    </div>
  );
}

export function BrowseBySize() {
  return (
    <div className="grid gap-6">
      <h2 className="text-center text-2xl font-extrabold sm:text-3xl">Browse by size</h2>
      <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {FLAT_TYPES.map((type) => (
          <li key={type}>
            <Link href={`/explore?type=${encodeURIComponent(type)}`} className="brutal brutal-hover flex flex-col items-center gap-2 rounded-2xl bg-card px-4 py-6">
              <span className="grid size-12 place-items-center rounded-xl border-2 border-ink bg-accent text-accent-foreground">
                <BedDouble className="size-6" aria-hidden />
              </span>
              <span className="text-lg font-extrabold">{type}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function OwnerBand() {
  return (
    <section id="owners" className="container-page scroll-mt-24 pb-20">
      <div className="brutal relative overflow-hidden rounded-3xl bg-ink px-6 py-12 text-ink-foreground sm:px-12">
        <div className="relative flex flex-col items-center gap-8 text-center lg:flex-row lg:justify-between lg:text-left">
          <div className="flex flex-col items-center gap-5 lg:flex-row">
            <span className="grid size-16 shrink-0 place-items-center rounded-2xl border-2 border-current bg-primary text-primary-foreground">
              <Building2 className="size-8" aria-hidden />
            </span>
            <div>
              <h2 className="text-2xl font-extrabold sm:text-4xl">
                Own a flat? <Sticker className="shadow-[4px_4px_0_0_var(--ink-foreground)]">List it</Sticker>
              </h2>
              <p className="mt-3 text-lg opacity-75">Reach renters, confirm visits and track rent from one dashboard.</p>
            </div>
          </div>
          <Button asChild size="xl" className="shrink-0 border-ink-foreground shadow-[3px_3px_0_0_var(--ink-foreground)]">
            <Link href="/register?type=owner">
              Post your property <ArrowRight aria-hidden />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
