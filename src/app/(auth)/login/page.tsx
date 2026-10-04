import type { Metadata } from "next";
import Link from "next/link";
import { AsideText, AsideTitle, AuthShell, FormHeader } from "@/components/auth/auth-shell";
import { SITE } from "@/lib/config";
import { LoginForm } from "./login-form";

export const metadata: Metadata = { title: "Sign in" };

export default async function LoginPage({ searchParams }: PageProps<"/login">) {
  const { next, expired } = await searchParams;
  const nextPath = typeof next === "string" ? next : undefined;

  return (
    <AuthShell
      aside={
        <>
          <AsideTitle>Welcome back to {SITE.name}</AsideTitle>
          <AsideText>Pick up where you left off — your saved flats and booked visits are waiting.</AsideText>
        </>
      }
    >
      <FormHeader title="Sign In" subtitle="Enter your credentials to access your account" />
      <LoginForm next={nextPath} expired={expired === "1"} />
      <p className="mt-8 text-center text-ink-soft">
        Don&apos;t have an account?{" "}
        <Link href={nextPath ? `/register?next=${encodeURIComponent(nextPath)}` : "/register"} className="font-medium text-brand-600 hover:underline">
          Create Account
        </Link>
      </p>
    </AuthShell>
  );
}
