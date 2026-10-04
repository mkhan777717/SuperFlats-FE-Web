import type { Metadata } from "next";
import { AuthShell, FormHeader, SwitchAuth } from "@/components/auth/auth-shell";
import { LoginForm } from "./login-form";

export const metadata: Metadata = { title: "Sign in" };

export default async function LoginPage({ searchParams }: PageProps<"/login">) {
  const { next, expired } = await searchParams;
  const nextPath = typeof next === "string" ? next : undefined;
  const withNext = (path: string) => (nextPath ? `${path}?next=${encodeURIComponent(nextPath)}` : path);

  return (
    <AuthShell>
      <FormHeader title="Welcome back" subtitle="Sign in to see your saved flats, visits and properties." />
      <LoginForm next={nextPath} expired={expired === "1"} />
      <SwitchAuth text="New to Superflats?" href={withNext("/register")} cta="Create an account" />
    </AuthShell>
  );
}
