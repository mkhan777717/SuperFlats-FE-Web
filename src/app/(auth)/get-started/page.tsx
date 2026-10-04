import type { Metadata } from "next";
import Link from "next/link";
import { Briefcase, Building2, ChevronRight, Home, type LucideIcon } from "lucide-react";
import { AsideText, AsideTitle, AuthShell } from "@/components/auth/auth-shell";
import { StatusBadge } from "@/components/common/status-badge";
import { SITE } from "@/lib/config";
import { cn } from "@/lib/cn";

export const metadata: Metadata = { title: "Get started" };

type Role = { title: string; text: string; icon: LucideIcon; tone: string; href?: string };

const roles: Role[] = [
  { title: "Tenant", text: "Find your next home to rent", icon: Home, tone: "bg-blue-50 text-blue-600", href: "/register" },
  { title: "Property Owner", text: "List & manage your properties", icon: Building2, tone: "bg-brand-50 text-brand-600" },
  { title: "Broker / Agent", text: "Connect clients with properties", icon: Briefcase, tone: "bg-purple-50 text-purple-600" },
];

export default function GetStartedPage() {
  return (
    <AuthShell
      tint="warm"
      aside={
        <>
          <AsideTitle>{SITE.name}</AsideTitle>
          <AsideText>Rental flats for tenants, and simple property management for owners and their teams.</AsideText>
        </>
      }
    >
      <h2 className="text-4xl font-bold">Welcome!</h2>
      <p className="mt-2 text-lg text-ink-soft">Choose how you want to use {SITE.name}</p>

      <ul className="mt-8 space-y-4">
        {roles.map(({ title, text, icon: Icon, tone, href }) => {
          const body = (
            <>
              <span className={cn("grid size-14 shrink-0 place-items-center rounded-2xl", tone)}>
                <Icon className="size-6" aria-hidden />
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex flex-wrap items-center gap-2 text-lg font-semibold">
                  {title}
                  {!href && <StatusBadge>Use the app for now</StatusBadge>}
                </span>
                <span className="block text-ink-soft">{text}</span>
              </span>
              {href && <ChevronRight className="size-5 text-ink-faint transition group-hover:translate-x-0.5 group-hover:text-brand-600" aria-hidden />}
            </>
          );
          return (
            <li key={title}>
              {href ? (
                <Link href={href} className="card group flex items-center gap-4 p-5 transition hover:-translate-y-0.5 hover:shadow-lg">
                  {body}
                </Link>
              ) : (
                <div className="card flex items-center gap-4 p-5 opacity-80">{body}</div>
              )}
            </li>
          );
        })}
      </ul>
      <p className="mt-4 text-sm text-ink-faint">The owner and broker web dashboards are coming soon. Until then, manage properties in the Superflats Admin app.</p>

      <p className="mt-10 text-center text-ink-soft">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-brand-600 hover:underline">
          Sign In
        </Link>
      </p>
    </AuthShell>
  );
}
