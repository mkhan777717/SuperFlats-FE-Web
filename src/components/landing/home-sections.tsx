import Image from "next/image";
import Link from "next/link";
import { ArrowRight, LogIn } from "lucide-react";
import { FavoriteButton } from "@/components/listings/favorite-button";
import { ListingCard } from "@/components/listings/listing-card";
import { Button } from "@/components/ui/button";
import { FLAT_TYPES } from "@/lib/config";
import type { Listing } from "@/lib/types";
import { cn } from "@/lib/utils";
import building from "../../../public/images/hero-building.jpg";
import { ListingRail } from "./listing-rail";

export function SectionHeader({ title, subtitle, href, cta = "See all" }: { title: string; subtitle?: string; href?: string; cta?: string }) {
  return (
    <div className="flex items-end justify-between gap-4">
      <div>
        <h2 className="text-2xl font-extrabold sm:text-3xl">{title}</h2>
        {subtitle && <p className="mt-1 text-muted-foreground">{subtitle}</p>}
      </div>
      {href && (
        <Link href={href} className="group flex shrink-0 items-center gap-1 text-sm font-semibold text-link hover:underline">
          {cta} <ArrowRight className="size-4 transition group-hover:translate-x-0.5" aria-hidden />
        </Link>
      )}
    </div>
  );
}

type GridProps = { listings: Listing[]; favorites: Set<number>; signedIn: boolean; priority?: boolean };

const heart = (l: Listing, favorites: Set<number>, signedIn: boolean) => <FavoriteButton listingId={l.id} initial={favorites.has(l.id)} signedIn={signedIn} />;

export function ListingGrid({ listings, favorites, signedIn, priority }: GridProps) {
  return (
    <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {listings.map((l, i) => (
        <li key={l.id}>
          <ListingCard listing={l} priority={priority && i < 3} action={heart(l, favorites, signedIn)} />
        </li>
      ))}
    </ul>
  );
}

export function ListingRow({ listings, favorites, signedIn, label }: GridProps & { label: string }) {
  return (
    <ListingRail label={label}>
      {listings.map((l) => (
        <li key={l.id} className="w-[82%] shrink-0 snap-start sm:w-[46%] lg:w-[31.5%]">
          <ListingCard listing={l} action={heart(l, favorites, signedIn)} />
        </li>
      ))}
    </ListingRail>
  );
}

/** Size filter as a segmented bar under the hero. */
export function SizeBar({ className }: { className?: string }) {
  return (
    <nav aria-label="Browse by flat size" className={cn("flex flex-wrap items-center justify-center gap-2", className)}>
      <span className="mr-1 text-sm font-medium text-muted-foreground">Popular sizes</span>
      {FLAT_TYPES.map((t) => (
        <Link
          key={t}
          href={`/explore?type=${encodeURIComponent(t)}`}
          className="rounded-full border bg-card px-4 py-1.5 text-sm font-semibold shadow-soft transition hover:-translate-y-0.5 hover:border-primary hover:text-primary"
        >
          {t}
        </Link>
      ))}
    </nav>
  );
}

/** Shown instead of listings while the backend still requires login to browse. */
export function SignInToBrowse() {
  return (
    <div className="flex flex-col items-center rounded-3xl border bg-card px-6 py-14 text-center shadow-soft">
      <span className="grid size-14 place-items-center rounded-2xl bg-accent text-accent-foreground">
        <LogIn className="size-6" aria-hidden />
      </span>
      <h3 className="mt-5 text-xl font-bold">Sign in to see available flats</h3>
      <p className="mt-1.5 max-w-sm text-muted-foreground">It&apos;s free. Browse every listing, save favourites and book visits.</p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Button asChild size="lg">
          <Link href="/register">Create free account</Link>
        </Button>
        <Button asChild size="lg" variant="outline">
          <Link href="/login">Log in</Link>
        </Button>
      </div>
    </div>
  );
}

export function OwnerBand() {
  return (
    <section id="owners" className="container-page scroll-mt-24 pb-20 sm:pb-24">
      <div className="relative isolate overflow-hidden rounded-[2rem] bg-ink text-ink-foreground shadow-lift">
        <div className="grid items-stretch lg:grid-cols-[1.2fr_1fr]">
          <div className="flex flex-col justify-center px-6 py-12 text-center sm:px-12 lg:text-left">
            <p className="text-sm font-semibold text-primary">For property owners</p>
            <h2 className="mt-2 text-3xl font-extrabold sm:text-4xl">Have a flat to rent out?</h2>
            <p className="mt-3 text-lg opacity-70">Put it in front of renters today and manage visits, tenants and rent from your dashboard.</p>
            <div className="mt-8 flex flex-wrap justify-center gap-3 lg:justify-start">
              <Button asChild size="xl">
                <Link href="/register?type=owner">
                  List your property <ArrowRight aria-hidden />
                </Link>
              </Button>
              <Button asChild size="xl" variant="ghost" className="hover:bg-white/10 hover:text-inherit">
                <Link href="/login">Owner login</Link>
              </Button>
            </div>
          </div>
          <div className="relative min-h-64">
            <Image src={building} alt="" fill placeholder="blur" sizes="(min-width: 1024px) 45vw, 100vw" className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-transparent lg:bg-gradient-to-r" />
          </div>
        </div>
      </div>
    </section>
  );
}
