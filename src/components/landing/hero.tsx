import Image from "next/image";
import Link from "next/link";
import { CalendarCheck, Heart, MapPin, Search, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FLAT_TYPES } from "@/lib/config";
import building from "../../../public/images/hero-building.jpg";
import livingRoom from "../../../public/images/living-room.jpg";

export function Hero() {
  return (
    <section className="bg-brand-wash relative overflow-hidden">
      <div className="container-page grid items-center gap-12 py-12 sm:py-16 lg:grid-cols-[1.05fr_1fr] lg:py-24">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1.5 text-xs font-semibold text-muted-foreground shadow-soft">
            <Sparkles className="size-3.5 text-highlight" aria-hidden /> Rental flats, direct from owners
          </span>
          <h1 className="mt-5 text-4xl leading-[1.08] font-extrabold sm:text-5xl lg:text-6xl">
            Find a flat you&apos;ll love <span className="text-primary">coming home to.</span>
          </h1>
          <p className="mt-5 max-w-xl text-lg text-muted-foreground">
            Search flats by area, budget and size, save the ones you like and book a visit with the owner — no middlemen, no back-and-forth.
          </p>

          <form action="/explore" role="search" className="mt-8 flex flex-col gap-2 rounded-2xl border bg-card p-2 shadow-lift sm:flex-row">
            <label className="relative flex-1">
              <span className="sr-only">Area, society or city</span>
              <MapPin className="pointer-events-none absolute top-1/2 left-3.5 size-5 -translate-y-1/2 text-primary" aria-hidden />
              <input
                name="keywords"
                placeholder="Area, society or city"
                className="h-12 w-full rounded-xl bg-transparent pr-3 pl-11 text-base outline-none placeholder:text-muted-foreground focus-visible:bg-muted/60"
              />
            </label>
            <label className="sm:w-40">
              <span className="sr-only">Flat type</span>
              <select name="type" defaultValue="" className="h-12 w-full rounded-xl bg-muted/70 px-3 text-sm font-medium outline-none focus-visible:ring-3 focus-visible:ring-ring/50">
                <option value="">Any size</option>
                {FLAT_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </label>
            <Button type="submit" size="xl" className="sm:px-7">
              <Search aria-hidden /> Search
            </Button>
          </form>

          <div className="mt-5 flex flex-wrap items-center gap-2 text-sm">
            <span className="text-muted-foreground">Popular:</span>
            {FLAT_TYPES.slice(0, 4).map((t) => (
              <Link
                key={t}
                href={`/explore?type=${encodeURIComponent(t)}`}
                className="rounded-full border bg-card px-3 py-1 font-medium transition hover:border-primary/40 hover:text-primary"
              >
                {t}
              </Link>
            ))}
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-xl lg:max-w-none" aria-hidden>
          <div className="relative aspect-[5/4] overflow-hidden rounded-[2rem] shadow-lift">
            <Image src={livingRoom} alt="" fill priority placeholder="blur" sizes="(min-width: 1024px) 45vw, 90vw" className="object-cover" />
          </div>
          <div className="absolute -bottom-8 -left-4 hidden w-40 overflow-hidden rounded-3xl border-4 border-background shadow-lift sm:block lg:-left-10 lg:w-48">
            <Image src={building} alt="" placeholder="blur" sizes="200px" className="aspect-[3/4] object-cover" />
          </div>
          <div className="absolute top-6 -right-2 flex items-center gap-3 rounded-2xl border bg-card/95 p-3 pr-4 shadow-lift backdrop-blur sm:-right-6">
            <span className="grid size-10 place-items-center rounded-xl bg-success-soft text-success">
              <CalendarCheck className="size-5" />
            </span>
            <span className="text-sm leading-tight">
              <span className="block font-semibold">Visit requested</span>
              <span className="text-muted-foreground">Sat · 11:00 AM</span>
            </span>
          </div>
          <div className="absolute right-8 -bottom-5 flex items-center gap-2 rounded-full border bg-card/95 px-4 py-2.5 text-sm font-semibold shadow-lift backdrop-blur">
            <Heart className="size-4 fill-destructive text-destructive" /> Saved to shortlist
          </div>
        </div>
      </div>
    </section>
  );
}
