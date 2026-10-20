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
    <div className="flex flex-col items-center rounded-3xl border border-white/80 bg-white/75 px-6 py-14 text-center backdrop-blur-2xl shadow-[0_8px_32px_rgba(11,25,44,0.06),inset_0_1px_1px_rgba(255,255,255,0.85)]">
      <span className="grid size-14 place-items-center rounded-2xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-md">
        <LogIn className="size-6" aria-hidden />
      </span>
      <h3 className="mt-5 text-2xl font-semibold tracking-tight">Sign in to view available properties</h3>
      <p className="mt-2 max-w-md text-base text-muted-foreground">Create a free account to browse every listing, save properties and book viewings.</p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Button asChild size="lg" variant="gold" className="rounded-xl shadow-md font-semibold">
          <Link href="/register">Create free account</Link>
        </Button>
        <Button asChild size="lg" variant="outline" className="rounded-xl">
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
              className="group relative flex items-center gap-4 rounded-2xl border border-white/80 bg-white/75 p-4.5 backdrop-blur-xl shadow-[0_4px_20px_-4px_rgba(11,25,44,0.05),inset_0_1px_1px_rgba(255,255,255,0.85)] transition-all duration-300 hover:-translate-y-1 hover:border-gold/40 hover:bg-white hover:shadow-[0_16px_36px_-6px_rgba(11,25,44,0.1)] active:scale-[0.98]"
            >
              <div className="grid size-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/10 text-primary transition-all duration-300 group-hover:scale-105 group-hover:from-gold/20 group-hover:border-gold/30 group-hover:text-gold-strong">
                <Icon className="size-6 stroke-[1.6]" aria-hidden />
              </div>
              <span className="min-w-0">
                <span className="block font-semibold text-foreground text-base tracking-tight">{type}</span>
                <span className="text-xs font-medium text-muted-foreground">{label}</span>
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
      <Reveal className="mt-6 flex flex-wrap items-center gap-3">
        {POPULAR.map((p) => (
          <Link
            key={p.href}
            href={p.href}
            className="group inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/70 px-4 py-2 text-[0.875rem] font-medium text-slate-800 backdrop-blur-md shadow-[0_2px_8px_-2px_rgba(11,25,44,0.05),inset_0_1px_1px_rgba(255,255,255,0.8)] transition-all duration-200 hover:-translate-y-0.5 hover:border-gold/40 hover:bg-white hover:shadow-soft active:scale-95"
          >
            <span>{p.label}</span>
            <ArrowRight className="size-3.5 text-gold-strong transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden />
          </Link>
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
      <Reveal className="grid items-center gap-8 overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-primary via-slate-900 to-ink p-6 text-primary-foreground shadow-float backdrop-blur-2xl sm:p-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)_auto] lg:gap-10">
        <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-white/10 shadow-lg">
          <Image src={interior} alt="A furnished living room in a rental flat" fill placeholder="blur" sizes="(min-width: 1024px) 25vw, 90vw" className="object-cover" />
        </div>
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold tracking-wider text-gold uppercase backdrop-blur-md">
            For property owners
          </div>
          <h2 className="mt-3 font-display text-3xl font-semibold sm:text-4xl">List your property with Superflats</h2>
          <p className="mt-2 text-base text-white/80">Reach renters, manage viewings and handle everything from one place.</p>
          <Button asChild variant="gold" size="xl" className="mt-6 rounded-xl font-semibold shadow-lg">
            <Link href="/register?type=owner">
              List your property <ArrowRight aria-hidden />
            </Link>
          </Button>
        </div>
        <ul className="grid grid-cols-3 border-white/15 lg:border-l lg:pl-6">
          {OWNER_FEATURES.map(({ icon: Icon, label }, i) => (
            <li key={label} className={`flex flex-col items-center gap-3 px-4 py-2 text-center text-sm ${i > 0 ? "border-l border-white/15" : ""}`}>
              <div className="grid size-12 place-items-center rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-gold shadow-sm">
                <Icon className="size-6" aria-hidden />
              </div>
              <span className="font-medium text-white/90">{label}</span>
            </li>
          ))}
        </ul>
      </Reveal>
    </section>
  );
}
