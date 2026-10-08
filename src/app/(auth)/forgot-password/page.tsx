import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AuthShell, FormHeader, SwitchAuth } from "@/components/auth/auth-shell";
import { ForgotForm } from "./forgot-form";

export const metadata: Metadata = { title: "Forgot password" };

export default function ForgotPasswordPage() {
  return (
    <AuthShell>
      <Link href="/login" className="mb-8 inline-flex w-fit items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" aria-hidden /> Back to sign in
      </Link>
      <FormHeader title="Forgot your password?" subtitle="Enter the email you signed up with and we'll send you a link to set a new one." />
      <ForgotForm />
      <SwitchAuth text="Remembered it?" href="/login" cta="Sign in" />
    </AuthShell>
  );
}
