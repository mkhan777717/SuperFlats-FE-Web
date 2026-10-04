import Image from "next/image";
import Link from "next/link";
import { CalendarCheck, CheckCircle2, Heart, IndianRupee, Search, type LucideIcon } from "lucide-react";
import { Tilt } from "@/components/common/tilt";
import { Button } from "@/components/ui/button";
import interior from "../../../public/images/apartment-interior.jpg";

function SectionTitle({ eyebrow, title, text, light }: { eyebrow: string; title: string; text?: string; light?: boolean }) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <p className={light ? "text-sm font-semibold text-primary" : "text-sm font-semibold text-primary"}>{eyebrow}</p>
      <h2 className="mt-2 text-3xl font-extrabold sm:text-5xl">{title}</h2>
      {text && <p className={light ? "mt-4 text-lg text-white/70" : "mt-4 text-lg text-muted-foreground"}>{text}</p>}
    </div>
  );
}

const STEPS: { icon: LucideIcon; title: string; text: string }[] = [
  { icon: Search, title: "Search", text: "Filter by area, budget and flat size, or find flats near your office or college." },
  { icon: Heart, title: "Save", text: "Tap the heart to shortlist a flat and compare your favourites later." },
  { icon: CalendarCheck, title: "Visit", text: "Pick a day and time. The owner confirms and you can track it anytime." },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="container-page scroll-mt-20 py-24 sm:py-32">
      <SectionTitle eyebrow="How it works" title="Three steps to your next home" />
      <ol className="mx-auto mt-16 grid max-w-5xl gap-6 md:grid-cols-3">
        {STEPS.map(({ icon: Icon, title, text }, i) => (
          <li key={title}>
            <Tilt className="group rounded-3xl">
              <div className="flex h-full flex-col items-center rounded-3xl border bg-card p-8 text-center shadow-lift">
                <span className="relative grid size-16 place-items-center rounded-2xl bg-accent text-accent-foreground shadow-soft [transform:translateZ(30px)]">
                  <Icon className="size-7" aria-hidden />
                  <span className="absolute -top-2 -right-2 grid size-7 place-items-center rounded-full bg-primary text-xs font-bold text-primary-foreground shadow-soft">
                    {i + 1}
                  </span>
                </span>
                <h3 className="mt-6 text-xl font-bold">{title}</h3>
                <p className="mt-2 text-muted-foreground">{text}</p>
              </div>
            </Tilt>
          </li>
        ))}
      </ol>
    </section>
  );
}

const OWNER_POINTS = ["Publish vacant flats in minutes", "Confirm visits and assign your agents", "Track tenants, contracts and monthly rent"];

export function ForOwners() {
  return (
    <section id="owners" className="scroll-mt-20 bg-ink py-24 text-ink-foreground sm:py-32">
      <div className="container-page grid items-center gap-16 lg:grid-cols-2">
        <div className="text-center lg:text-left">
          <p className="text-sm font-semibold text-primary">For property owners</p>
          <h2 className="mt-2 text-3xl font-extrabold sm:text-5xl">Fill your flats faster</h2>
          <p className="mt-4 text-lg opacity-70">List flats, manage visits, tenants and rent from one simple dashboard.</p>
          <ul className="mx-auto mt-8 grid max-w-sm gap-3 text-left lg:mx-0">
            {OWNER_POINTS.map((p) => (
              <li key={p} className="flex items-center gap-3">
                <CheckCircle2 className="size-5 shrink-0 text-primary" aria-hidden />
                {p}
              </li>
            ))}
          </ul>
          <div className="mt-10 flex flex-wrap justify-center gap-3 lg:justify-start">
            <Button asChild size="xl">
              <Link href="/register?type=owner">List your property</Link>
            </Button>
            <Button asChild size="xl" variant="ghost" className="opacity-90 hover:bg-white/10 hover:text-inherit dark:hover:bg-black/10">
              <Link href="/login">Owner sign in</Link>
            </Button>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-lg [perspective:1200px]" aria-hidden>
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-float [transform:rotateY(-10deg)_rotateX(4deg)]">
            <Image src={interior} alt="" fill placeholder="blur" sizes="(min-width: 1024px) 40vw, 90vw" className="object-cover" />
          </div>
          <div className="animate-float absolute -bottom-6 left-2 z-10 flex items-center gap-3 rounded-2xl bg-card p-3 pr-5 text-card-foreground shadow-float sm:-left-10">
            <span className="grid size-10 place-items-center rounded-xl bg-success-soft text-success">
              <IndianRupee className="size-5" />
            </span>
            <span className="text-sm leading-tight">
              <span className="block font-semibold">Rent marked paid</span>
              <span className="text-muted-foreground">Flat B-204</span>
            </span>
          </div>
          <div className="animate-float absolute -top-5 right-2 z-10 flex items-center gap-3 rounded-2xl bg-card p-3 pr-5 text-card-foreground shadow-float [animation-delay:-3s] sm:-right-8">
            <span className="grid size-10 place-items-center rounded-xl bg-accent text-accent-foreground">
              <CalendarCheck className="size-5" />
            </span>
            <span className="text-sm leading-tight">
              <span className="block font-semibold">Visit confirmed</span>
              <span className="text-muted-foreground">Sat · 11:00 AM</span>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

export function FinalCta() {
  return (
    <section className="container-page py-24 sm:py-28">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-3xl font-extrabold sm:text-5xl">Ready to move?</h2>
        <p className="mt-4 text-lg text-muted-foreground">Create a free account and start shortlisting flats today.</p>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Button asChild size="xl">
            <Link href="/register">Create free account</Link>
          </Button>
          <Button asChild size="xl" variant="outline">
            <Link href="/explore">Browse flats</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
