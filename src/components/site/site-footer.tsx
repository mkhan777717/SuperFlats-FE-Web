import Link from "next/link";
import { Logo } from "@/components/common/logo";
import { SITE } from "@/lib/config";

const COLUMNS = [
  {
    title: "Renters",
    links: [
      { href: "/explore", label: "Find a flat" },
      { href: "/saved", label: "Saved flats" },
      { href: "/visits", label: "My visits" },
    ],
  },
  {
    title: "Owners",
    links: [
      { href: "/register?type=owner", label: "List your property" },
      { href: "/dashboard", label: "Owner dashboard" },
      { href: "/#owners", label: "Features" },
    ],
  },
  {
    title: "Support",
    links: [
      { href: `mailto:${SITE.supportEmail}`, label: "Contact us" },
      { href: "/forgot-password", label: "Account help" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t bg-card">
      <div className="container-page grid gap-10 py-12 md:grid-cols-[1.5fr_repeat(3,1fr)]">
        <div className="max-w-xs">
          <Logo />
          <p className="mt-4 text-sm text-muted-foreground">{SITE.description}</p>
        </div>
        {COLUMNS.map((col) => (
          <div key={col.title}>
            <h3 className="text-sm font-semibold">{col.title}</h3>
            <ul className="mt-3 grid gap-2">
              {col.links.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="text-sm text-muted-foreground transition hover:text-foreground">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t">
        <p className="container-page py-5 text-xs text-muted-foreground">
          © {new Date().getFullYear()} {SITE.name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
