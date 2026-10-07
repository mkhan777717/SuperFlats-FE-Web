import Image from "next/image";
import heroPhoto from "../../../public/images/hero-apartments.jpg";
import { HeroSearch } from "./hero-search";

/*
 * Entrance runs on CSS (tw-animate), so the text and search card are in the server
 * HTML and visible before JavaScript loads.
 */
const ENTER = "animate-in fade-in slide-in-from-bottom-3 animation-duration-700 fill-mode-both ease-out motion-reduce:animate-none";

/** Headline on a light sky on the left, apartments photo on the right, tabbed search card below. */
export function Hero() {
  return (
    <section className="relative isolate overflow-hidden border-b bg-gradient-to-b from-[oklch(0.95_0.03_70)] to-background">
      {/* Photo sits in the right two thirds (as in the design) and fades into the page. */}
      <div className="absolute inset-y-0 right-0 -z-10 w-full lg:w-[66%]">
        <Image src={heroPhoto} alt="" fill priority placeholder="blur" sizes="(min-width: 1024px) 66vw, 100vw" className="animate-ken-burns object-cover object-[60%_45%]" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent lg:from-[oklch(0.95_0.03_70)] lg:via-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background/80 to-transparent" />
      </div>

      <div className="container-page pt-14 pb-16 sm:pt-20 sm:pb-20">
        <div className="max-w-xl">
          <p className={`eyebrow ${ENTER}`}>Rent smarter</p>
          <h1 className={`mt-4 font-display text-5xl leading-[1.04] font-semibold text-primary delay-100 sm:text-7xl dark:text-foreground ${ENTER}`}>
            Find Your Next Home in India
          </h1>
          <p className={`mt-6 max-w-md text-lg text-foreground/80 delay-150 ${ENTER}`}>
            Discover flats directly from owners and property managers. Book viewings, compare options and find a place you&apos;ll love.
          </p>
        </div>
        <div className={`mt-10 delay-200 ${ENTER}`}>
          <HeroSearch />
        </div>
      </div>
    </section>
  );
}
