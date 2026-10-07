import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Logo } from "@/components/common/logo";
import { ThemeToggle } from "@/components/common/theme-toggle";
import { Button } from "@/components/ui/button";
import { getOptionalUser } from "@/lib/api";
import { HeaderFrame } from "./header-frame";
import { DesktopNav, MobileNav, type NavLink } from "./site-nav";
import { UserMenu } from "./user-menu";

const GUEST_LINKS: NavLink[] = [
  { href: "/explore", label: "Rent" },
  { href: "/saved", label: "Saved" },
  { href: "/#owners", label: "For owners" },
];

const RENTER_LINKS: NavLink[] = [
  { href: "/explore", label: "Rent" },
  { href: "/saved", label: "Saved" },
  { href: "/visits", label: "My visits" },
];

export async function SiteHeader() {
  const user = await getOptionalUser();
  const links = user ? (user.role === "client" ? RENTER_LINKS : [{ href: "/dashboard", label: "Dashboard" }, ...RENTER_LINKS]) : GUEST_LINKS;

  return (
    <HeaderFrame>
      <div className="container-page flex h-[72px] items-stretch gap-10">
        <Logo className="self-center" />
        <DesktopNav links={links} />
        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />
          <span className="mx-1 hidden h-6 w-px bg-border sm:block" aria-hidden />
          {user ? (
            <UserMenu user={user} />
          ) : (
            <>
              <Button asChild variant="ghost" className="hidden sm:inline-flex">
                <Link href="/login">Log in</Link>
              </Button>
              <Button asChild variant="gold" className="hidden sm:inline-flex">
                <Link href="/register?type=owner">
                  List your property <ArrowRight aria-hidden />
                </Link>
              </Button>
            </>
          )}
          <MobileNav links={links} signedIn={!!user} />
        </div>
      </div>
    </HeaderFrame>
  );
}
