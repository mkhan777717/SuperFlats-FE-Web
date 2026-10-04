import type { Metadata } from "next";
import { BarChart3, Building2, Users } from "lucide-react";
import { AuthShell, FormHeader, SwitchAuth } from "@/components/auth/auth-shell";
import { RegisterForm } from "./register-form";

export const metadata: Metadata = { title: "Create account" };

const OWNER_POINTS = [
  { icon: Building2, title: "Properties, flats and listings", text: "Publish vacant flats and manage every unit in one place." },
  { icon: Users, title: "Tenants and contracts", text: "Keep tenant records, bookings and ID documents together." },
  { icon: BarChart3, title: "Rent on autopilot", text: "Monthly rent bills are generated for every active booking." },
];

export default async function RegisterPage({ searchParams }: PageProps<"/register">) {
  const { next, type } = await searchParams;
  const nextPath = typeof next === "string" ? next : undefined;
  const isOwner = type === "owner";

  return (
    <AuthShell points={isOwner ? OWNER_POINTS : undefined} panelTitle={isOwner ? "Run your rentals without the paperwork." : undefined}>
      <FormHeader title="Create your account" subtitle="It's free and takes less than a minute." />
      <RegisterForm next={nextPath} initialType={isOwner ? "owner" : "renter"} />
      <SwitchAuth text="Already have an account?" href={nextPath ? `/login?next=${encodeURIComponent(nextPath)}` : "/login"} cta="Sign in" />
    </AuthShell>
  );
}
