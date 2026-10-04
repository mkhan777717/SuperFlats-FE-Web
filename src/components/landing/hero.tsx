import Image from "next/image";
import Link from "next/link";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FLAT_TYPES } from "@/lib/config";
import heroPhoto from "../../../public/images/hero-living.jpg";

/** Full-width photo with a centered headline and a frosted search bar floating on top. */
export function Hero() {
  return (
    <section className="container-page pt-4 sm:pt-6">
      <div className="relative isolate flex min-h-[560px] items-center justify-center overflow-hidden rounded-[2rem] px-4 py-20 shadow-float sm:min-h-[640px]">
        <Image src={heroPhoto} alt="" fill priority placeholder="blur" sizes="(min-width: 1280px) 1250px, 100vw" className="-z-10 object-cover" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black/55 via-black/35 to-black/65" />

        <div className="flex w-full max-w-3xl flex-col items-center text-center text-white">
          <span className="rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-sm font-medium backdrop-blur-md">Rental flats, straight from owners</span>
          <h1 className="mt-6 text-4xl leading-[1.05] font-extrabold drop-shadow-sm sm:text-6xl lg:text-7xl">Find a home you&apos;ll love</h1>
          <p className="mt-5 max-w-xl text-lg text-white/85 sm:text-xl">Search flats near you, save your favourites and book a visit in a few taps.</p>

          <form action="/explore" role="search" className="glass mt-10 flex w-full max-w-2xl flex-col gap-2 rounded-2xl p-2 shadow-float sm:flex-row sm:items-center">
            <label className="relative flex-1">
              <span className="sr-only">Area, society or city</span>
              <Search className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-foreground/60" aria-hidden />
              <input
                name="keywords"
                placeholder="Search by area, society or city"
                className="h-14 w-full rounded-xl bg-transparent pr-4 pl-12 text-base text-foreground outline-none placeholder:text-foreground/55"
              />
            </label>
            <Button type="submit" size="xl" className="h-14 px-9 text-base">
              Search
            </Button>
          </form>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            {FLAT_TYPES.map((t) => (
              <Link
                key={t}
                href={`/explore?type=${encodeURIComponent(t)}`}
                className="rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-sm font-semibold backdrop-blur-md transition hover:bg-white/25"
              >
                {t}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
