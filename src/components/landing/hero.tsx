import Image from "next/image";
import { BedDouble, IndianRupee, MapPin, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FLAT_TYPES } from "@/lib/config";
import heroPhoto from "../../../public/images/hero-living.jpg";

const BUDGETS = [10000, 15000, 20000, 30000, 50000];

function FieldShell({ icon: Icon, label, children }: { icon: typeof MapPin; label: string; children: React.ReactNode }) {
  return (
    <label className="group flex min-w-0 flex-1 items-center gap-3 rounded-2xl px-4 py-2.5 transition hover:bg-muted focus-within:bg-muted">
      <Icon className="size-5 shrink-0 text-primary" aria-hidden />
      <span className="min-w-0 flex-1">
        <span className="block text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">{label}</span>
        {children}
      </span>
    </label>
  );
}

/** Photo hero with a search panel that overlaps its bottom edge. */
export function Hero({ liveCount }: { liveCount?: number }) {
  return (
    <section className="container-page pt-4 sm:pt-6">
      <div className="relative isolate overflow-hidden rounded-[2rem] shadow-lift">
        <Image src={heroPhoto} alt="" fill priority placeholder="blur" sizes="(min-width: 1280px) 1250px, 100vw" className="-z-10 object-cover" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black/70 via-black/40 to-black/10" />
        <div className="max-w-2xl px-6 pt-16 pb-36 text-white sm:px-12 sm:pt-24 sm:pb-44">
          {liveCount ? (
            <p className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/15 px-3.5 py-1.5 text-sm font-medium backdrop-blur-md">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex size-2 rounded-full bg-emerald-400" />
              </span>
              <span className="tabular">{liveCount.toLocaleString("en-IN")}</span> flats available now
            </p>
          ) : null}
          <h1 className="text-4xl leading-[1.08] font-extrabold sm:text-6xl">Rent a flat you&apos;ll actually love.</h1>
          <p className="mt-5 max-w-lg text-lg text-white/80">Flats listed directly by owners, with rent and deposit upfront. Shortlist in a tap and book a visit when it suits you.</p>
        </div>
      </div>

      <form
        action="/explore"
        role="search"
        className="relative z-10 mx-auto -mt-24 flex max-w-5xl flex-col gap-1 rounded-3xl border bg-card p-2 shadow-float sm:-mt-20 md:flex-row md:items-center"
      >
        <FieldShell icon={MapPin} label="Location">
          <input name="keywords" placeholder="Area, society or city" className="w-full bg-transparent text-base font-medium outline-none placeholder:font-normal placeholder:text-muted-foreground" />
        </FieldShell>
        <span className="hidden h-10 w-px bg-border md:block" aria-hidden />
        <FieldShell icon={BedDouble} label="Flat type">
          <select name="type" defaultValue="" className="w-full cursor-pointer appearance-none bg-transparent text-base font-medium outline-none">
            <option value="">Any size</option>
            {FLAT_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </FieldShell>
        <span className="hidden h-10 w-px bg-border md:block" aria-hidden />
        <FieldShell icon={IndianRupee} label="Budget">
          <select name="max_rent" defaultValue="" className="w-full cursor-pointer appearance-none bg-transparent text-base font-medium outline-none">
            <option value="">Any budget</option>
            {BUDGETS.map((b) => (
              <option key={b} value={b}>
                Up to ₹{b.toLocaleString("en-IN")}
              </option>
            ))}
          </select>
        </FieldShell>
        <Button type="submit" size="xl" className="h-14 rounded-2xl px-8 md:ml-1">
          <Search aria-hidden /> Search
        </Button>
      </form>
    </section>
  );
}
