import Image from "next/image";
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
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-background/65 via-background/30 to-transparent sm:from-background/85 sm:via-background/50 sm:to-transparent" />
      <div className="absolute inset-x-0 bottom-0 -z-10 h-36 bg-gradient-to-t from-background/80 to-transparent" />
      {/* Soft wash under the transparent header */}
      <div className="absolute inset-x-0 top-0 -z-10 h-24 bg-gradient-to-b from-background/60 to-transparent" />

      <div className="container-page pt-[calc(72px+2rem)] pb-14 sm:pt-[calc(72px+5rem)] sm:pb-20">
        {/* On mobile: subtle frosted glass so text is crisp without hiding the photo */}
        <div className="max-w-xl rounded-[22px] bg-white/60 p-5 backdrop-blur-md border border-white/60 shadow-[0_4px_24px_-4px_rgba(11,25,44,0.08)] sm:bg-transparent sm:p-0 sm:backdrop-blur-none sm:border-0 sm:shadow-none">
          <p className={`eyebrow ${ENTER}`}>Rent smarter</p>
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
