import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { BadgeCheck, CalendarCheck, Heart, type LucideIcon } from "lucide-react";
import { Logo } from "@/components/common/logo";
import { ThemeToggle } from "@/components/common/theme-toggle";
import { SITE } from "@/lib/config";
import { cn } from "@/lib/utils";
import hero from "../../../public/images/hero-building.jpg";

type Point = { icon: LucideIcon; title: string; text: string };

const DEFAULT_POINTS: Point[] = [
  { icon: BadgeCheck, title: "Listed by owners", text: "Every flat comes straight from the people who manage it." },
  { icon: Heart, title: "Shortlist in one tap", text: "Save flats and compare them whenever you like." },
  { icon: CalendarCheck, title: "Book visits online", text: "Pick a slot and the owner confirms it with you." },
];

/** Form on the left, photo panel with what Superflats offers on the right. */
export function AuthShell({ children, points = DEFAULT_POINTS, panelTitle }: { children: ReactNode; points?: Point[]; panelTitle?: string }) {
  return (
    <div className="grid min-h-dvh flex-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
      <div className="flex min-w-0 flex-col px-5 py-6 sm:px-10">
        <div className="flex items-center justify-between">
          <Logo />
          <ThemeToggle />
        </div>
        <main className="mx-auto flex w-full max-w-[26rem] flex-1 flex-col justify-center py-10">{children}</main>
        <p className="text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} {SITE.name} ·{" "}
          <a href={`mailto:${SITE.supportEmail}`} className="hover:text-foreground">
            Help
          </a>
        </p>
      </div>

      <aside className="relative hidden p-3 lg:block">
        <div className="relative h-full overflow-hidden rounded-2xl">
          <Image src={hero} alt="" fill priority placeholder="blur" sizes="55vw" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/10" />
          <div className="relative flex h-full flex-col justify-end p-10 text-white xl:p-14">
            <h2 className="max-w-md text-3xl leading-tight font-bold xl:text-4xl">{panelTitle ?? "Your next home is a few taps away."}</h2>
            <ul className="mt-10 grid gap-5">
              {points.map(({ icon: Icon, title, text }) => (
                <li key={title} className="flex gap-4">
                  <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-white/15 backdrop-blur">
                    <Icon className="size-5" aria-hidden />
                  </span>
                  <span>
                    <span className="block font-semibold">{title}</span>
                    <span className="block text-sm text-white/75">{text}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </aside>
    </div>
  );
}

export function FormHeader({ title, subtitle }: { title: string; subtitle: ReactNode }) {
  return (
    <header className="mb-8">
      <h1 className="text-3xl font-bold">{title}</h1>
      <p className="mt-2 text-muted-foreground">{subtitle}</p>
    </header>
  );
}

export function FormAlert({ children, tone = "error" }: { children: ReactNode; tone?: "error" | "info" }) {
  return (
    <div
      role={tone === "error" ? "alert" : "status"}
      className={cn("rounded-xl px-4 py-3 text-sm", tone === "error" ? "bg-destructive-soft text-destructive" : "bg-secondary text-secondary-foreground")}
    >
      {children}
    </div>
  );
}

export function SwitchAuth({ text, href, cta }: { text: string; href: string; cta: string }) {
  return (
    <p className="mt-8 text-center text-sm text-muted-foreground">
      {text}{" "}
      <Link href={href} className="font-semibold text-link hover:underline">
        {cta}
      </Link>
    </p>
  );
}
