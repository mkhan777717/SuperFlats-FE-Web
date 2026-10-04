import { CalendarDays, Heart, Search, User, type LucideIcon } from "lucide-react";

export type NavItem = { href: string; label: string; icon: LucideIcon };

export const TENANT_NAV: NavItem[] = [
  { href: "/explore", label: "Explore", icon: Search },
  { href: "/saved", label: "Saved", icon: Heart },
  { href: "/visits", label: "My Visits", icon: CalendarDays },
  { href: "/profile", label: "Profile", icon: User },
];

export const isActive = (pathname: string, href: string) =>
  pathname === href || pathname.startsWith(`${href}/`) || (href === "/explore" && pathname.startsWith("/listings"));
