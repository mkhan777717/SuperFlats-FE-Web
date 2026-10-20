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
    <section className="relative isolate -mt-[60px] overflow-hidden border-b border-black/[0.06]">
      <Image src={heroPhoto} alt="" fill priority placeholder="blur" sizes="100vw" className="animate-ken-burns -z-20 object-cover object-[65%_40%] sm:object-[60%_50%]" />
      {/* Soft gradient wash: keeps the photo clearly visible while guaranteeing crisp text legibility */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-background/95 via-background/80 to-transparent sm:from-background/95 sm:via-background/75 sm:to-transparent" />
      <div className="absolute inset-x-0 bottom-0 -z-10 h-36 bg-gradient-to-t from-background/90 to-transparent" />
      {/* Soft wash under the transparent header */}
      <div className="absolute inset-x-0 top-0 -z-10 h-24 bg-gradient-to-b from-background/80 to-transparent" />



      <div className="container-page pt-[calc(60px+2rem)] pb-14 sm:pt-[calc(60px+4.5rem)] sm:pb-20">
        {/* On mobile: subtle frosted glass so text is crisp without hiding the photo */}
        <div className="max-w-xl rounded-3xl bg-white/80 p-6 backdrop-blur-2xl border border-white/80 shadow-[0_8px_32px_rgba(0,0,0,0.06)] sm:bg-transparent sm:p-0 sm:backdrop-blur-none sm:border-0 sm:shadow-none">
          <div className={`inline-flex items-center gap-2 rounded-full border border-black/[0.08] bg-white/90 px-3.5 py-1 text-xs font-medium text-foreground backdrop-blur-md shadow-sm ${ENTER}`}>
            <Sparkles className="size-3.5 text-gold-strong" aria-hidden />
            <span>Rent smarter</span>
          </div>
          <h1 className={`mt-3 font-display text-4xl leading-[1.08] font-semibold tracking-[-0.03em] text-[#1d1d1f] delay-100 sm:mt-4 sm:text-6xl lg:text-7xl ${ENTER}`}>
            Find Your Next <em className="not-italic text-transparent bg-clip-text bg-gradient-to-r from-gold-strong via-gold to-amber-600">Home</em> in India
          </h1>
          <p className={`mt-4 max-w-lg text-base leading-relaxed text-[#1d1d1f] font-normal delay-150 sm:mt-5 sm:text-[1.125rem] sm:leading-[1.6] sm:font-medium sm:text-slate-800 ${ENTER}`}>
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
