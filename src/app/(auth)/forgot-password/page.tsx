import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, KeyRound } from "lucide-react";
import { AuthShell } from "@/components/auth/auth-shell";
import { buttonVariants } from "@/components/ui/button";
import { SITE } from "@/lib/config";

export const metadata: Metadata = { title: "Forgot password" };

// The backend has no password-reset endpoint yet, so this routes people to support
// instead of pretending to send a reset link.
export default function ForgotPasswordPage() {
  const subject = encodeURIComponent(`Password reset for my ${SITE.name} account`);

  return (
    <AuthShell>
      <Link href="/login" className="mb-8 inline-flex w-fit items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" aria-hidden /> Back to sign in
      </Link>
      <span className="mb-5 grid size-12 place-items-center rounded-2xl bg-secondary text-secondary-foreground">
        <KeyRound className="size-5" aria-hidden />
      </span>
      <h1 className="text-3xl font-bold">Forgot your password?</h1>
      <p className="mt-2 text-muted-foreground">Email us from the address you signed up with and we&apos;ll help you reset it.</p>
      <a href={`mailto:${SITE.supportEmail}?subject=${subject}`} className={buttonVariants({ size: "xl", className: "mt-8 w-full" })}>
        Email {SITE.supportEmail}
      </a>
      <p className="mt-4 text-sm text-muted-foreground">Still signed in on the Superflats app? You can change your password from your profile there.</p>
    </AuthShell>
  );
}
