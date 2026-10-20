import Image from "next/image";
import { Sparkles } from "lucide-react";
import heroPhoto from "../../../public/images/hero-living-room.jpg";
import { HeroSearch } from "./hero-search";

/*
 * Entrance runs on CSS (tw-animate), so the text and search card are in the server
 * HTML and visible before JavaScript loads.
 */
const ENTER = "animate-in fade-in slide-in-from-bottom-3 animation-duration-700 fill-mode-both ease-out motion-reduce:animate-none";

/** Headline on the left over the bright sky, living room on the right, tabbed search card below. */
export function Hero() {
  return (
    <section className="relative isolate -mt-[72px] overflow-hidden border-b">
      <Image src={heroPhoto} alt="" fill priority placeholder="blur" sizes="100vw" className="animate-ken-burns -z-20 object-cover object-[65%_40%] sm:object-[60%_50%]" />
      {/* Soft gradient wash: keeps the photo clearly visible on all screens */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-background/70 via-background/40 to-transparent sm:from-background/85 sm:via-background/55 sm:to-transparent" />
      <div className="absolute inset-x-0 bottom-0 -z-10 h-36 bg-gradient-to-t from-background/80 to-transparent" />
      {/* Soft wash under the transparent header */}
      <div className="absolute inset-x-0 top-0 -z-10 h-24 bg-gradient-to-b from-background/60 to-transparent" />

      {/* Subtle ambient colored light orbs for real glass refraction feel */}
      <div className="pointer-events-none absolute top-1/4 left-10 -z-10 size-72 rounded-full bg-gold/15 blur-3xl sm:size-96" aria-hidden />
      <div className="pointer-events-none absolute bottom-16 left-1/3 -z-10 size-80 rounded-full bg-primary/10 blur-3xl sm:size-96" aria-hidden />

      <div className="container-page pt-[calc(72px+2rem)] pb-14 sm:pt-[calc(72px+5rem)] sm:pb-20">
        {/* On mobile: subtle frosted glass so text is crisp without hiding the photo */}
        <div className="max-w-xl rounded-3xl bg-white/70 p-6 backdrop-blur-xl border border-white/70 shadow-[0_8px_32px_rgba(11,25,44,0.06)] sm:bg-transparent sm:p-0 sm:backdrop-blur-none sm:border-0 sm:shadow-none">
          <div className={`inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/60 px-3.5 py-1 text-xs font-semibold tracking-[0.16em] text-gold-strong uppercase backdrop-blur-md shadow-sm ${ENTER}`}>
            <Sparkles className="size-3.5 text-gold-strong" aria-hidden />
            <span>Rent smarter</span>
          </div>
          <h1 className={`mt-3 font-display text-4xl leading-[1.08] font-medium text-primary delay-100 sm:mt-4 sm:text-6xl lg:text-7xl ${ENTER}`}>
            Find Your Next <em className="text-gold-strong">Home</em> in India
          </h1>
          <p className={`mt-4 max-w-md text-base leading-relaxed text-slate-700 delay-150 sm:mt-6 sm:text-lg sm:text-foreground/80 ${ENTER}`}>
            Discover flats directly from owners and property managers. Book viewings, compare options and find a place you&apos;ll love.
          </p>
        </div>
        <div className={`mt-8 sm:mt-10 delay-200 ${ENTER}`}>
          <HeroSearch />
        </div>
      </div>
    </section>
  );
}
