import Link from "next/link";
import type { ReactNode } from "react";
import { SITE } from "@/lib/config";

export type LegalSection = { id: string; title: string; body: ReactNode };

/** Shared layout for Privacy Policy and Terms: title, last-updated date, contents list and sections. */
export function LegalPage({ title, intro, sections, related }: { title: string; intro: ReactNode; sections: LegalSection[]; related: { href: string; label: string } }) {
  return (
    <main className="container-page py-14 sm:py-20">
      <header className="max-w-3xl">
        <p className="eyebrow">Legal</p>
        <h1 className="mt-3 font-display text-4xl font-semibold text-primary sm:text-5xl dark:text-foreground">{title}</h1>
        <p className="mt-4 text-sm text-muted-foreground">Last updated: {SITE.legalUpdated}</p>
        <div className="mt-6 text-lg leading-relaxed text-foreground/80">{intro}</div>
      </header>

      <div className="mt-12 grid gap-12 lg:grid-cols-[240px_minmax(0,1fr)]">
        <nav aria-label="On this page" className="lg:sticky lg:top-24 lg:self-start">
          <p className="text-sm font-semibold">On this page</p>
          <ol className="mt-3 grid gap-2 border-l pl-4 text-sm">
            {sections.map((s, i) => (
              <li key={s.id}>
                <a href={`#${s.id}`} className="text-muted-foreground transition hover:text-foreground">
                  {i + 1}. {s.title}
                </a>
              </li>
            ))}
          </ol>
          <p className="mt-6 text-sm text-muted-foreground">
            See also:{" "}
            <Link href={related.href} className="font-medium text-link hover:underline">
              {related.label}
            </Link>
          </p>
        </nav>

        <article className="max-w-3xl">
          {sections.map((s, i) => (
            <section key={s.id} id={s.id} className="scroll-mt-28 border-b py-8 first:pt-0 last:border-b-0">
              <h2 className="text-xl font-semibold">
                {i + 1}. {s.title}
              </h2>
              <div className="mt-4 grid gap-4 leading-relaxed text-foreground/80 [&_a]:font-medium [&_a]:text-link [&_a]:hover:underline [&_li]:ml-5 [&_li]:list-disc [&_ul]:grid [&_ul]:gap-2">
                {s.body}
              </div>
            </section>
          ))}
        </article>
      </div>
    </main>
  );
}

export const SupportLink = () => <a href={`mailto:${SITE.supportEmail}`}>{SITE.supportEmail}</a>;
