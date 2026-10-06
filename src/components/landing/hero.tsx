import Image from "next/image";
import { BedDouble, IndianRupee, MapPin, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FLAT_TYPES } from "@/lib/config";
import heroPhoto from "../../../public/images/hero-building.jpg";

const BUDGETS = [10000, 15000, 20000, 30000, 50000, 75000];

/*
 * Entrance runs on CSS (tw-animate), so the search panel is in the server HTML and
 * visible before JavaScript loads.
 */
const ENTER = "animate-in fade-in slide-in-from-bottom-3 animation-duration-700 fill-mode-both ease-out motion-reduce:animate-none";

function Field({ icon: Icon, label, children }: { icon: typeof MapPin; label: string; children: React.ReactNode }) {
  return (
    <label className="flex min-w-0 flex-1 flex-col gap-1.5">
      <span className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">{label}</span>
      <span className="relative flex items-center">
        <Icon className="pointer-events-none absolute left-3 size-4 text-muted-foreground" aria-hidden />
        {children}
      </span>
    </label>
  );
}

const control =
  "h-12 w-full rounded-md border border-input bg-card pr-3 pl-9 text-[0.9375rem] text-foreground outline-none transition focus:border-ring focus:ring-3 focus:ring-ring/20";

/** Full-width property photo with a classic search panel: location, type, budget. */
export function Hero({ liveCount }: { liveCount?: number }) {
  return (
    <section className="relative isolate">
      <Image src={heroPhoto} alt="" fill priority placeholder="blur" sizes="100vw" className="animate-ken-burns -z-10 object-cover object-[50%_35%]" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[oklch(0.2_0.045_258/0.85)] via-[oklch(0.2_0.045_258/0.6)] to-[oklch(0.2_0.045_258/0.85)]" />

      <div className="container-page flex flex-col items-center pt-20 pb-24 text-center text-white sm:pt-28 sm:pb-32">
        <p className={`eyebrow ${ENTER}`}>Properties for rent · Direct from owners</p>
        <h1 className={`mt-5 max-w-4xl font-display text-4xl leading-[1.1] font-semibold delay-100 sm:text-6xl ${ENTER}`}>Find the right home to rent</h1>
        <p className={`mt-5 max-w-2xl text-lg text-white/80 delay-150 ${ENTER}`}>
          {liveCount
            ? `${liveCount.toLocaleString("en-IN")} properties available, with rent and deposit shown upfront.`
            : "Browse flats listed by their owners, with rent and deposit shown upfront."}
        </p>

        <form action="/explore" role="search" className={`mt-10 w-full max-w-5xl rounded-lg bg-card text-left text-foreground shadow-float delay-200 ${ENTER}`}>
          <div className="flex border-b px-5" role="tablist" aria-label="Search type">
            <span role="tab" aria-selected className="relative -mb-px border-b-2 border-gold px-1 py-3.5 text-sm font-semibold">
              Rent
            </span>
          </div>
          <div className="grid gap-4 p-5 md:grid-cols-[1.6fr_1fr_1fr_auto] md:items-end">
            <Field icon={MapPin} label="Location">
              <input name="keywords" placeholder="Area, society or city" className={control} />
            </Field>
            <Field icon={BedDouble} label="Property type">
              <select name="type" defaultValue="" className={`${control} cursor-pointer appearance-none`}>
                <option value="">All types</option>
                {FLAT_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </Field>
            <Field icon={IndianRupee} label="Max rent">
              <select name="max_rent" defaultValue="" className={`${control} cursor-pointer appearance-none`}>
                <option value="">Any price</option>
                {BUDGETS.map((b) => (
                  <option key={b} value={b}>
                    ₹{b.toLocaleString("en-IN")} / month
                  </option>
                ))}
              </select>
            </Field>
            <Button type="submit" size="xl" className="w-full md:w-auto md:px-8">
              <Search aria-hidden /> Search
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
}
