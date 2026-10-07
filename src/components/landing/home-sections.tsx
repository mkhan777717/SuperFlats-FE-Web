import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, BedDouble, CalendarCheck, Building2, CheckCircle2, IndianRupee, LogIn, Users } from "lucide-react";
import { Reveal, Stagger, StaggerItem } from "@/components/common/motion";
import { Tilt } from "@/components/common/tilt";
import { FavoriteButton } from "@/components/listings/favorite-button";
import { ListingCard } from "@/components/listings/listing-card";
import { Button } from "@/components/ui/button";
import { FLAT_TYPES } from "@/lib/config";
import type { Listing } from "@/lib/types";
import interior from "../../../public/images/hero-living.jpg";

export function SectionHeader({ eyebrow, title, href, cta = "View all" }: { eyebrow?: string; title: string; href?: string; cta?: string }) {
  return (
    <div className="flex items-end justify-between gap-6">
      <div>
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h2 className="mt-2 font-display text-3xl font-semibold sm:text-4xl">{title}</h2>
      </div>
      {href && (
        <Link href={href} className="group flex shrink-0 items-center gap-1.5 text-sm font-semibold text-link hover:underline">
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

const TYPE_TEXT: Record<string, string> = {
  "1RK": "Room with kitchen",
  "1BHK": "One bedroom",
  "2BHK": "Two bedrooms",
  "3BHK": "Three bedrooms",
  "3BHK+": "Four or more",
};

export function PropertyTypes() {
  return (
    <section className="bg-muted/60">
      <div className="container-page py-20">
        <SectionHeader eyebrow="Browse" title="Explore by property type" />
        <Stagger as="ul" stagger={0.06} className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {FLAT_TYPES.map((type) => (
            <StaggerItem as="li" key={type}>
              <Tilt className="rounded-lg" max={8}>
                <Link
                  href={`/explore?type=${encodeURIComponent(type)}`}
                  className="group flex h-full flex-col justify-between gap-8 rounded-lg border bg-card p-5 shadow-soft transition-shadow hover:shadow-lift"
                >
                  <span className="flex items-center justify-between">
                    <span className="grid size-11 place-items-center rounded-md bg-accent text-accent-foreground [transform:translateZ(24px)]">
                      <BedDouble className="size-5" aria-hidden />
                    </span>
                    <ArrowUpRight className="size-5 text-muted-foreground transition group-hover:text-foreground" aria-hidden />
                  </span>
                  <span>
                    <span className="block text-xl font-bold">{type}</span>
                    <span className="text-sm text-muted-foreground">{TYPE_TEXT[type]}</span>
                  </span>
                </Link>
              </Tilt>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

const BUDGET_LINKS: Record<string, number[]> = {
  "1RK": [8000, 12000],
  "1BHK": [12000, 18000],
  "2BHK": [20000, 30000],
  "3BHK": [30000, 45000],
};

/** Portal-style quick links: size × budget, each a pre-filtered search. */
export function PopularSearches() {
  return (
    <section className="container-page py-20">
      <SectionHeader eyebrow="Popular searches" title="Find a home within your budget" />
      <Reveal className="mt-10 grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
        {Object.entries(BUDGET_LINKS).map(([type, budgets]) => (
          <div key={type}>
            <h3 className="border-b pb-3 text-sm font-semibold">{type} flats for rent</h3>
            <ul className="mt-3 grid gap-2.5">
              {budgets.map((b) => (
                <li key={b}>
                  <Link href={`/explore?type=${encodeURIComponent(type)}&max_rent=${b}`} className="text-sm text-muted-foreground transition hover:text-link">
                    {type} under ₹{b.toLocaleString("en-IN")}
                  </Link>
                </li>
              ))}
              <li>
                <Link href={`/explore?type=${encodeURIComponent(type)}&sort=rent_asc`} className="text-sm text-muted-foreground transition hover:text-link">
                  Cheapest {type} first
                </Link>
              </li>
            </ul>
          </div>
        ))}
      </Reveal>
    </section>
  );
}

const OWNER_POINTS = [
  { icon: Building2, text: "Publish properties, flats and listings with photos" },
  { icon: CalendarCheck, text: "Confirm viewing requests and assign your agents" },
  { icon: Users, text: "Keep tenants, contracts and ID documents together" },
  { icon: IndianRupee, text: "Monthly rent bills generated automatically" },
];

export function OwnerSection() {
  return (
    <section id="owners" className="scroll-mt-24 overflow-hidden bg-ink text-ink-foreground">
      <div className="container-page grid items-center gap-16 py-24 lg:grid-cols-2">
        <Reveal>
          <p className="eyebrow">For owners &amp; property managers</p>
          <h2 className="mt-3 font-display text-3xl leading-tight font-semibold sm:text-5xl">Rent out faster. Manage everything in one place.</h2>
          <ul className="mt-8 grid gap-4">
            {OWNER_POINTS.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-3 text-white/85">
                <span className="grid size-9 shrink-0 place-items-center rounded-md bg-white/10 text-gold">
                  <Icon className="size-[18px]" aria-hidden />
                </span>
                {text}
              </li>
            ))}
          </ul>
          <div className="mt-10 flex flex-wrap gap-3">
            <Button asChild size="xl" variant="gold">
              <Link href="/register?type=owner">
                List your property <ArrowRight aria-hidden />
              </Link>
            </Button>
            <Button asChild size="xl" variant="ghost" className="text-white hover:bg-white/10 hover:text-white">
              <Link href="/login">Owner login</Link>
            </Button>
          </div>
        </Reveal>

        <div className="relative mx-auto w-full max-w-xl [perspective:1400px]" aria-hidden>
          <Reveal className="relative aspect-[4/3] overflow-hidden rounded-lg shadow-float ring-1 ring-white/10 [transform:rotateY(-12deg)_rotateX(5deg)]">
            <Image src={interior} alt="" fill placeholder="blur" sizes="(min-width: 1024px) 40vw, 90vw" className="object-cover" />
          </Reveal>
          <div className="animate-float absolute -bottom-6 left-2 z-10 flex items-center gap-3 rounded-lg bg-card p-3 pr-5 text-card-foreground shadow-float sm:-left-8">
            <span className="grid size-10 place-items-center rounded-md bg-success-soft text-success">
              <CheckCircle2 className="size-5" />
            </span>
            <span className="text-sm leading-tight">
              <span className="block font-semibold">Rent received</span>
              <span className="text-muted-foreground">Flat B-204 · October</span>
            </span>
          </div>
          <div className="animate-float absolute -top-6 right-2 z-10 flex items-center gap-3 rounded-lg bg-card p-3 pr-5 text-card-foreground shadow-float [animation-delay:-3s] sm:-right-6">
            <span className="grid size-10 place-items-center rounded-md bg-accent text-accent-foreground">
              <CalendarCheck className="size-5" />
            </span>
            <span className="text-sm leading-tight">
              <span className="block font-semibold">Viewing confirmed</span>
              <span className="text-muted-foreground">Sat · 11:00 AM</span>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
