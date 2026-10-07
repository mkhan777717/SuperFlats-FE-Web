import Link from "next/link";
import { Mail } from "lucide-react";
import { Logo } from "@/components/common/logo";
import { SITE } from "@/lib/config";

const COLUMNS = [
  {
    title: "For Renters",
    links: [
      { href: "/explore", label: "Browse Properties" },
      { href: "/saved", label: "Saved Properties" },
      { href: "/visits", label: "My Visits" },
      { href: "/profile", label: "Profile" },
    ],
  },
  {
    title: "For Owners",
    links: [
      { href: "/register?type=owner", label: "List Your Property" },
      { href: "/dashboard", label: "Manage Listings" },
      { href: "/dashboard", label: "View Bookings" },
      { href: "/dashboard", label: "Plan & Pricing" },
    ],
  },
  {
    title: "Account",
    links: [
      { href: "/login", label: "Log in" },
      { href: "/register", label: "Sign up" },
      { href: "/forgot-password", label: "Forgot password" },
      { href: `mailto:${SITE.supportEmail}`, label: "Help & Support" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t bg-muted/70">
      <div className="container-page grid gap-10 py-14 md:grid-cols-[1.3fr_repeat(3,1fr)_1.3fr]">
        <div className="max-w-xs">
          <Logo />
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">Rental platform for finding and listing flats directly with owners.</p>
        </div>
        {COLUMNS.map((col) => (
          <div key={col.title}>
            <h3 className="font-semibold">{col.title}</h3>
            <ul className="mt-4 grid gap-2.5">
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
        <div className="md:border-l md:pl-10">
          <h3 className="font-semibold">Need help?</h3>
          <a href={`mailto:${SITE.supportEmail}`} className="mt-4 inline-flex items-center gap-2.5 text-[0.9375rem] font-medium text-primary hover:underline dark:text-foreground">
            <Mail className="size-5" aria-hidden /> {SITE.supportEmail}
          </a>
          <p className="mt-6 border-t pt-5 text-xs text-muted-foreground">
            © {new Date().getFullYear()} {SITE.name}. All rights reserved.
          </p>
          <p className="mt-2 flex gap-4 text-xs">
            <Link href="/privacy" className="text-muted-foreground hover:text-foreground">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-muted-foreground hover:text-foreground">
              Terms of Service
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
