import Image from "next/image";
import Link from "next/link";
import { MapPin, Search } from "lucide-react";
import { Doodle, Sticker, Wave } from "@/components/common/decor";
import { FLAT_TYPES } from "@/lib/config";
import heroPhoto from "../../../public/images/hero-living.jpg";

const TAGS = [
  { label: "Cozy", className: "top-[18%] -left-6" },
  { label: "Sunny", className: "top-[8%] right-6" },
  { label: "Spacious", className: "bottom-[22%] -right-4" },
];

export function Hero({ liveCount }: { liveCount?: number }) {
  return (
    <section className="relative overflow-hidden">
      <Doodle className="absolute -top-10 -left-20 w-[520px] text-primary/25" />
      <Doodle className="absolute right-[-120px] bottom-10 w-[420px] rotate-180 text-ink/10" />

      <div className="container-page relative grid items-center gap-12 pt-10 pb-16 sm:pt-16 lg:grid-cols-[1.1fr_1fr] lg:pb-20">
        <div className="text-center lg:text-left">
          <h1 className="text-[2.6rem] leading-[1.15] font-extrabold sm:text-6xl">
            Find your perfect
            <br />
            <Sticker>flat</Sticker> to rent
          </h1>
          <p className="mt-6 text-lg text-muted-foreground">
            {liveCount ? (
              <>
                <span className="font-bold text-foreground tabular">{liveCount.toLocaleString("en-IN")}</span> flats live right now, listed directly by owners.
              </>
            ) : (
              "Flats listed directly by owners. Save your favourites and book a visit."
            )}
          </p>

          <form action="/explore" role="search" className="brutal mx-auto mt-8 flex max-w-xl items-center gap-2 rounded-2xl bg-card p-1.5 lg:mx-0">
            <label className="relative flex-1">
              <span className="sr-only">Area, society or city</span>
              <MapPin className="pointer-events-none absolute top-1/2 left-3.5 size-5 -translate-y-1/2 text-primary" aria-hidden />
              <input
                name="keywords"
                placeholder='Try "Vijay Nagar" or "2BHK near metro"'
                className="h-12 w-full rounded-xl bg-transparent pr-3 pl-11 text-base outline-none placeholder:text-muted-foreground"
              />
            </label>
            <button
              type="submit"
              className="grid h-12 shrink-0 place-items-center rounded-xl border-2 border-ink bg-primary px-5 font-semibold text-primary-foreground transition hover:bg-primary/90 sm:px-7"
            >
              <span className="hidden sm:inline">Search</span>
              <Search className="size-5 sm:hidden" aria-label="Search" />
            </button>
          </form>

          <div className="mt-5 flex flex-wrap items-center justify-center gap-2 lg:justify-start">
            {FLAT_TYPES.map((t) => (
              <Link key={t} href={`/explore?type=${encodeURIComponent(t)}`} className="brutal-sm brutal-hover rounded-full bg-card px-3.5 py-1 text-sm font-semibold">
                {t}
              </Link>
            ))}
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-[440px]" aria-hidden>
          <div className="brutal relative aspect-[4/5] overflow-hidden rounded-t-[999px] rounded-b-3xl bg-accent">
            <Image src={heroPhoto} alt="" fill priority placeholder="blur" sizes="(min-width: 1024px) 440px, 90vw" className="object-cover" />
          </div>
          {TAGS.map((t, i) => (
            <span key={t.label} className={`brutal-sm animate-float absolute rounded-full bg-card px-4 py-1.5 text-sm font-semibold ${t.className}`} style={{ animationDelay: `${i * -2}s` }}>
              {t.label}
            </span>
          ))}
        </div>
      </div>
      <Wave className="text-card" />
    </section>
  );
}
