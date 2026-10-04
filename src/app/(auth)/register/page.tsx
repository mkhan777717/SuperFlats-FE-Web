import type { Metadata } from "next";
import Link from "next/link";
import { Check } from "lucide-react";
import { AsideText, AsideTitle, AuthShell, FormHeader } from "@/components/auth/auth-shell";
import { SITE } from "@/lib/config";
import { RegisterForm } from "./register-form";

export const metadata: Metadata = { title: "Create account" };

const perks = ["Browse flats listed directly by owners", "Save the ones you like", "Book a visit in a few taps", "Free to get started"];

export default async function RegisterPage({ searchParams }: PageProps<"/register">) {
  const { next } = await searchParams;
  const nextPath = typeof next === "string" ? next : undefined;

  return (
    <AuthShell
      aside={
        <>
          <AsideTitle>Join {SITE.name} Today</AsideTitle>
          <AsideText>Everything you need to find your next home.</AsideText>
          <ul className="mt-8 space-y-4">
            {perks.map((perk) => (
              <li key={perk} className="flex items-center gap-3 text-lg">
                <span className="grid size-7 place-items-center rounded-full bg-white/20">
                  <Check className="size-4" aria-hidden />
                </span>
                {perk}
              </li>
            ))}
          </ul>
        </>
      }
    >
      <FormHeader title="Create Account" subtitle="Fill in your details to get started" />
      <RegisterForm next={nextPath} />
      <p className="mt-8 text-center text-ink-soft">
        Already have an account?{" "}
        <Link href={nextPath ? `/login?next=${encodeURIComponent(nextPath)}` : "/login"} className="font-medium text-brand-600 hover:underline">
          Sign In
        </Link>
      </p>
    </AuthShell>
  );
}
