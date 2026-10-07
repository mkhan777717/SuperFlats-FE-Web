import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BedDouble, BedSingle, Building, Building2, CalendarCheck, ChartColumn, LogIn, Sofa, Users, type LucideIcon } from "lucide-react";
import { Reveal, Stagger, StaggerItem } from "@/components/common/motion";
import { FavoriteButton } from "@/components/listings/favorite-button";
import { ListingCard } from "@/components/listings/listing-card";
import { Button } from "@/components/ui/button";
import type { Listing } from "@/lib/types";
import interior from "../../../public/images/hero-living.jpg";

export function SectionHeader({ title, href, cta = "View all" }: { title: string; href?: string; cta?: string }) {
  return (
    <div className="flex items-end justify-between gap-6">
      <div>
        <h2 className="font-display text-3xl font-medium text-primary sm:text-[2.4rem]">{title}</h2>
        <span className="gold-rule mt-4" aria-hidden />
      </div>
      {href && (
        <Link href={href} className="caps group flex shrink-0 items-center gap-1.5 text-gold-strong hover:underline">
          {cta} <ArrowRight className="size-4 transition group-hover:translate-x-0.5" aria-hidden />
        </Link>
      )}
    </div>
  );
}

export function ListingGrid({ listings, favorites, signedIn, priority }: { listings: Listing[]; favorites: Set<number>; signedIn: boolean; priority?: boolean }) {
  return (
    <Stagger as="ul" stagger={0.07} className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {listings.map((listing, i) => (
        <StaggerItem as="li" key={listing.id}>
          <ListingCard
            listing={listing}
            priority={priority && i < 4}
            action={<FavoriteButton listingId={listing.id} initial={favorites.has(listing.id)} signedIn={signedIn} />}
          />
        </StaggerItem>
      ))}
    </Stagger>
  );
}

/** Shown in place of listings while the backend still requires login to browse. */
export function SignInToBrowse() {
  return (
    <div className="flex flex-col items-center rounded-lg border bg-muted/50 px-6 py-14 text-center">
      <span className="grid size-12 place-items-center rounded-full bg-primary text-primary-foreground">
        <LogIn className="size-5" aria-hidden />
      </span>
      <h3 className="mt-5 text-xl font-semibold">Sign in to view available properties</h3>
      <p className="mt-1.5 max-w-md text-muted-foreground">Create a free account to browse every listing, save properties and book viewings.</p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Button asChild size="lg" variant="gold">
          <Link href="/register">Create free account</Link>
        </Button>
        <Button asChild size="lg" variant="outline">
          <Link href="/login">Log in</Link>
        </Button>
      </div>
    </div>
  );
}

const TYPES: { type: string; label: string; icon: LucideIcon }[] = [
  { type: "1RK", label: "Compact", icon: BedSingle },
  { type: "1BHK", label: "Cozy", icon: Sofa },
  { type: "2BHK", label: "Popular", icon: BedDouble },
  { type: "3BHK", label: "Spacious", icon: Building },
  { type: "3BHK+", label: "Premium", icon: Building2 },
];

export function PropertyTypes() {
  return (
    <section className="container-page pt-4 pb-14">
      <SectionHeader title="Explore by property type" href="/explore" cta="View all types" />
      <Stagger as="ul" stagger={0.06} className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {TYPES.map(({ type, label, icon: Icon }) => (
          <StaggerItem as="li" key={type}>
            <Link
              href={`/explore?type=${encodeURIComponent(type)}`}
              className="flex items-center gap-4 rounded-lg border bg-card px-5 py-5 transition hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-lift"
            >
              <Icon className="size-9 shrink-0 stroke-[1.4] text-primary dark:text-foreground" aria-hidden />
              <span>
                <span className="block font-semibold">{type}</span>
                <span className="text-sm text-muted-foreground">{label}</span>
              </span>
            </Link>
          </StaggerItem>
        ))}
      </Stagger>
    </section>
  );
}

const POPULAR = [
  { label: "2BHK under ₹25,000", href: "/explore?type=2BHK&max_rent=25000" },
  { label: "1BHK under ₹15,000", href: "/explore?type=1BHK&max_rent=15000" },
  { label: "1RK under ₹10,000", href: "/explore?type=1RK&max_rent=10000" },
  { label: "3BHK flats", href: "/explore?type=3BHK" },
  { label: "Newest listings", href: "/explore" },
];

export function PopularSearches() {
  return (
    <section className="container-page pb-14">
      <h2 className="font-display text-3xl font-medium text-primary sm:text-[2.4rem]">Popular searches</h2>
      <span className="gold-rule mt-4" aria-hidden />
      <Reveal className="mt-5 flex flex-wrap items-center gap-y-3">
        {POPULAR.map((p, i) => (
          <span key={p.href} className="flex items-center">
            {i > 0 && <span className="mx-5 hidden h-5 w-px bg-border sm:block" aria-hidden />}
            <Link href={p.href} className="group mr-5 flex items-center gap-2 text-[0.9375rem] text-primary hover:underline sm:mr-0 dark:text-foreground">
              {p.label} <ArrowRight className="size-4 text-gold transition group-hover:translate-x-0.5" aria-hidden />
            </Link>
          </span>
        ))}
      </Reveal>
    </section>
  );
}

const OWNER_FEATURES: { icon: LucideIcon; label: string }[] = [
  { icon: CalendarCheck, label: "Viewing requests" },
  { icon: Users, label: "Tenant records" },
  { icon: ChartColumn, label: "Rent tracking" },
];

export function OwnerBand() {
  return (
    <section id="owners" className="container-page scroll-mt-24 pb-16">
      <Reveal className="grid items-center gap-8 overflow-hidden rounded-lg bg-primary p-5 text-primary-foreground shadow-lift sm:p-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)_auto] lg:gap-10 dark:bg-ink">
        <div className="relative aspect-[16/10] overflow-hidden rounded-md">
          <Image src={interior} alt="A furnished living room in a rental flat" fill placeholder="blur" sizes="(min-width: 1024px) 25vw, 90vw" className="object-cover" />
        </div>
        <div>
          <p className="eyebrow">For property owners</p>
          <h2 className="mt-2 font-display text-3xl font-semibold">List your property with Superflats</h2>
          <p className="mt-2 text-white/80">Reach renters, manage viewings and handle everything from one place.</p>
          <Button asChild variant="gold" size="xl" className="mt-6">
            <Link href="/register?type=owner">
              List your property <ArrowRight aria-hidden />
            </Link>
          </Button>
        </div>
        <ul className="grid grid-cols-3 border-white/15 lg:border-l lg:pl-4">
          {OWNER_FEATURES.map(({ icon: Icon, label }, i) => (
            <li key={label} className={`flex flex-col items-center gap-2 px-5 py-2 text-center text-sm ${i > 0 ? "border-l border-white/15" : ""}`}>
              <Icon className="size-7 text-gold" aria-hidden />
              {label}
            </li>
          ))}
        </ul>
      </Reveal>
    </section>
  );
}
