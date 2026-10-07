import Image from "next/image";
import heroPhoto from "../../../public/images/hero-apartments.jpg";
import { HeroSearch } from "./hero-search";

/*
 * Entrance runs on CSS (tw-animate), so the text and search card are in the server
 * HTML and visible before JavaScript loads.
 */
const ENTER = "animate-in fade-in slide-in-from-bottom-3 animation-duration-700 fill-mode-both ease-out motion-reduce:animate-none";

/** Headline on the left, apartments photo on the right, tabbed search card below. */
export function Hero() {
  return (
    <section className="relative isolate overflow-hidden border-b">
      <Image src={heroPhoto} alt="" fill priority placeholder="blur" sizes="100vw" className="animate-ken-burns -z-20 object-cover object-[75%_40%]" />
      {/*
        One continuous fade in the theme's background colour (light or dark), so the
        headline sits on a calm surface and there is no visible edge in either theme.
      */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-background from-0% via-background/90 via-40% to-background/5 to-80%" />
      <div className="absolute inset-x-0 bottom-0 -z-10 h-40 bg-gradient-to-t from-background/80 to-transparent" />

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
