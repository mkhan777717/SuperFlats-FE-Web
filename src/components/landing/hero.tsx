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
      <Image src={heroPhoto} alt="" fill priority placeholder="blur" sizes="100vw" className="animate-ken-burns -z-20 object-cover object-[60%_50%]" />
      {/* Mobile-optimized high-contrast wash & desktop panoramic gradient */}
      <div className="absolute inset-0 -z-10 bg-background/85 backdrop-blur-[2px] sm:backdrop-blur-none sm:bg-transparent" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-background/95 via-background/85 to-background/95 sm:bg-gradient-to-r sm:from-background/95 sm:via-background/80 sm:via-45% sm:to-transparent sm:to-75%" />
      <div className="absolute inset-x-0 bottom-0 -z-10 h-48 bg-gradient-to-t from-background via-background/80 to-transparent" />
      {/* Soft wash under the transparent header so its links stay readable over the photo. */}
      <div className="absolute inset-x-0 top-0 -z-10 h-32 bg-gradient-to-b from-background/95 to-transparent" />

      <div className="container-page pt-[calc(72px+3rem)] pb-16 sm:pt-[calc(72px+5rem)] sm:pb-20">
        <div className="max-w-xl">
          <p className={`eyebrow ${ENTER}`}>Rent smarter</p>
          <h1 className={`mt-4 font-display text-4xl leading-[1.08] font-medium text-primary delay-100 sm:text-6xl lg:text-7xl ${ENTER}`}>
            Find Your Next <em className="text-gold-strong">Home</em> in India
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
