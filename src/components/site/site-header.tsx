import Link from "next/link";
import { Logo } from "@/components/common/logo";
import { ThemeToggle } from "@/components/common/theme-toggle";
import { Button } from "@/components/ui/button";
import { getOptionalUser } from "@/lib/api";
import { DesktopNav, MobileNav, type NavLink } from "./site-nav";
import { UserMenu } from "./user-menu";

const GUEST_LINKS: NavLink[] = [
  { href: "/explore", label: "Browse flats" },
  { href: "/saved", label: "Saved" },
  { href: "/register?type=owner", label: "List property" },
];

const RENTER_LINKS: NavLink[] = [
  { href: "/explore", label: "Explore" },
  { href: "/saved", label: "Saved" },
  { href: "/visits", label: "My visits" },
];

export async function SiteHeader() {
  const user = await getOptionalUser();
  const links = user ? (user.role === "client" ? RENTER_LINKS : [{ href: "/dashboard", label: "Dashboard" }, ...RENTER_LINKS]) : GUEST_LINKS;

  return (
    <header className="sticky top-0 z-40 border-b bg-card/90 backdrop-blur">
      <div className="container-page flex h-16 items-center gap-6">
        <Logo />
        <DesktopNav links={links} />
        <div className="ml-auto flex items-center gap-1.5">
          <ThemeToggle />
          {user ? (
            <UserMenu user={user} />
          ) : (
            <>
              <Button asChild variant="ghost" className="hidden sm:inline-flex">
                <Link href="/login">Log in</Link>
              </Button>
              <Button asChild className="hidden sm:inline-flex">
                <Link href="/register">Sign up</Link>
              </Button>
            </>
          )}
          <MobileNav links={links} signedIn={!!user} />
        </div>
      </div>
    </header>
  );
}
