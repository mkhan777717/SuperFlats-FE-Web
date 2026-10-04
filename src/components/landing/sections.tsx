import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BedDouble,
  Building2,
  CalendarCheck,
  ClipboardList,
  FileText,
  Heart,
  IndianRupee,
  Megaphone,
  Search,
  UserCog,
  Users,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { FLAT_TYPES } from "@/lib/config";
import interior from "../../../public/images/apartment-interior.jpg";

function SectionTitle({ eyebrow, title, text, center }: { eyebrow: string; title: string; text?: string; center?: boolean }) {
  return (
    <div className={center ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      <p className="text-sm font-semibold tracking-wide text-primary uppercase">{eyebrow}</p>
      <h2 className="mt-2 text-3xl font-bold sm:text-4xl">{title}</h2>
      {text && <p className="mt-3 text-lg text-muted-foreground">{text}</p>}
    </div>
  );
}

const STEPS: { icon: LucideIcon; title: string; text: string }[] = [
  { icon: Search, title: "Search your way", text: "Filter by area, budget and flat size. Sort by newest or by rent." },
  { icon: Heart, title: "Shortlist favourites", text: "Save flats with one tap and come back to compare them any time." },
  { icon: CalendarCheck, title: "Book a visit", text: "Pick a day and time slot. The owner confirms and you track it in My visits." },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="container-page scroll-mt-20 py-20 sm:py-24">
      <SectionTitle center eyebrow="For renters" title="From search to visit in three steps" text="Everything you need to find your next flat, without calling ten brokers." />
      <ol className="mt-14 grid gap-6 md:grid-cols-3">
        {STEPS.map(({ icon: Icon, title, text }, i) => (
          <li key={title} className="relative rounded-3xl border bg-card p-7 shadow-soft">
            <span className="absolute top-6 right-7 text-5xl font-extrabold text-muted tabular">{i + 1}</span>
            <span className="grid size-12 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-sm shadow-primary/30">
              <Icon className="size-5" aria-hidden />
            </span>
            <h3 className="mt-6 text-lg font-semibold">{title}</h3>
            <p className="mt-2 text-muted-foreground">{text}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

export function BrowseByType() {
  return (
    <section className="border-y bg-card">
      <div className="container-page py-16">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <SectionTitle eyebrow="Browse" title="What size are you looking for?" />
          <Button asChild variant="outline">
            <Link href="/explore">
              View all flats <ArrowRight aria-hidden />
            </Link>
          </Button>
        </div>
        <ul className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {FLAT_TYPES.map((type) => (
            <li key={type}>
              <Link
                href={`/explore?type=${encodeURIComponent(type)}`}
                className="group flex items-center gap-3 rounded-2xl border bg-background p-4 transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lift"
              >
                <span className="grid size-11 place-items-center rounded-xl bg-secondary text-secondary-foreground transition group-hover:bg-primary group-hover:text-primary-foreground">
                  <BedDouble className="size-5" aria-hidden />
                </span>
                <span>
                  <span className="block font-semibold">{type}</span>
                  <span className="text-xs text-muted-foreground">See flats</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

const OWNER_FEATURES: { icon: LucideIcon; title: string; text: string }[] = [
  { icon: Building2, title: "Properties & flats", text: "Add buildings with photos, location and unit counts, then every flat inside them." },
  { icon: Megaphone, title: "Listings", text: "Publish vacant flats with rent and deposit, pause or close them anytime." },
  { icon: ClipboardList, title: "Visit requests", text: "See every visit renters book, confirm it and assign an agent." },
  { icon: Users, title: "Tenants & documents", text: "Keep tenant details and up to five ID documents per tenant." },
  { icon: FileText, title: "Bookings", text: "Record rental contracts; flats and tenants update automatically." },
  { icon: IndianRupee, title: "Rent tracking", text: "Rent bills are created every month. Mark them paid and see who owes what." },
  { icon: UserCog, title: "Your team", text: "Invite agents and admins to help manage properties and visits." },
];

export function ForOwners() {
  return (
    <section id="owners" className="scroll-mt-20 py-20 sm:py-24">
      <div className="container-page">
        <div className="overflow-hidden rounded-[2rem] bg-[oklch(0.22_0.1_292)] text-white shadow-lift">
          <div className="grid lg:grid-cols-[1.1fr_1fr]">
            <div className="p-8 sm:p-12">
              <p className="text-sm font-semibold tracking-wide text-highlight uppercase">For property owners</p>
              <h2 className="mt-2 text-3xl font-bold sm:text-4xl">Run every flat from one dashboard</h2>
              <p className="mt-3 text-lg text-white/70">The same tools as the Superflats Admin app, now on the web — built for owners, managers and their agents.</p>
              <ul className="mt-10 grid gap-x-8 gap-y-6 sm:grid-cols-2">
                {OWNER_FEATURES.map(({ icon: Icon, title, text }) => (
                  <li key={title} className="flex gap-3">
                    <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-white/10">
                      <Icon className="size-[18px]" aria-hidden />
                    </span>
                    <span>
                      <span className="block font-semibold">{title}</span>
                      <span className="block text-sm text-white/65">{text}</span>
                    </span>
                  </li>
                ))}
              </ul>
              <div className="mt-10 flex flex-wrap gap-3">
                <Button asChild size="xl" className="bg-highlight text-highlight-foreground shadow-none hover:bg-highlight/90">
                  <Link href="/register?type=owner">
                    List your property <ArrowRight aria-hidden />
                  </Link>
                </Button>
                <Button asChild size="xl" variant="ghost" className="text-white hover:bg-white/10 hover:text-white">
                  <Link href="/login">Owner sign in</Link>
                </Button>
              </div>
            </div>
            <div className="relative min-h-72">
              <Image src={interior} alt="A bright, furnished apartment living room" fill placeholder="blur" sizes="(min-width: 1024px) 45vw, 100vw" className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-r from-[oklch(0.22_0.1_292)] via-transparent to-transparent lg:via-[oklch(0.22_0.1_292/0.2)]" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function FinalCta() {
  return (
    <section className="container-page pb-20 sm:pb-24">
      <div className="bg-brand-wash flex flex-col items-center rounded-[2rem] border bg-card px-6 py-14 text-center">
        <h2 className="max-w-2xl text-3xl font-bold sm:text-4xl">Ready to find your next home?</h2>
        <p className="mt-3 max-w-xl text-lg text-muted-foreground">Create a free account to search flats, save your favourites and book visits.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button asChild size="xl">
            <Link href="/register">
              Create free account <ArrowRight aria-hidden />
            </Link>
          </Button>
          <Button asChild size="xl" variant="outline">
            <Link href="/explore">Browse flats</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
