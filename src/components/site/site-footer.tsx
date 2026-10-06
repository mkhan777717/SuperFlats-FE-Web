import Link from "next/link";
import { Mail } from "lucide-react";
import { Logo } from "@/components/common/logo";
import { FLAT_TYPES, SITE } from "@/lib/config";

const COLUMNS = [
  {
    title: "Rent",
    links: [{ href: "/explore", label: "All properties" }, ...FLAT_TYPES.map((t) => ({ href: `/explore?type=${encodeURIComponent(t)}`, label: `${t} for rent` }))],
  },
  {
    title: "Owners",
    links: [
      { href: "/register?type=owner", label: "List your property" },
      { href: "/dashboard", label: "Owner dashboard" },
      { href: "/login", label: "Owner login" },
    ],
  },
  {
    title: "Account",
    links: [
      { href: "/saved", label: "Saved properties" },
      { href: "/visits", label: "My visits" },
      { href: "/forgot-password", label: "Account help" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="bg-ink text-ink-foreground">
      <div className="container-page grid gap-12 py-16 md:grid-cols-[1.4fr_repeat(3,1fr)]">
        <div className="max-w-xs">
          <Logo light />
          <p className="mt-5 text-sm leading-relaxed text-white/60">{SITE.description}</p>
          <a href={`mailto:${SITE.supportEmail}`} className="mt-6 inline-flex items-center gap-2 text-sm text-white/80 hover:text-gold">
            <Mail className="size-4" aria-hidden /> {SITE.supportEmail}
          </a>
        </div>
        {COLUMNS.map((col) => (
          <div key={col.title}>
            <h3 className="eyebrow">{col.title}</h3>
            <ul className="mt-4 grid gap-2.5">
              {col.links.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="text-sm text-white/70 transition hover:text-white">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-white/10">
        <div className="container-page flex flex-col gap-2 py-6 text-xs text-white/50 sm:flex-row sm:justify-between">
          <p>
            © {new Date().getFullYear()} {SITE.name}. All rights reserved.
          </p>
          <p>Properties are listed by their owners and managers.</p>
        </div>
      </div>
    </footer>
  );
}
