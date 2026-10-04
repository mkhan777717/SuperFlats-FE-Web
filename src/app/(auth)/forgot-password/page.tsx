import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Mail } from "lucide-react";
import { AsideText, AsideTitle, AuthShell } from "@/components/auth/auth-shell";
import { buttonClass } from "@/components/ui/button";
import { SITE } from "@/lib/config";

export const metadata: Metadata = { title: "Forgot password" };

// The backend has no password-reset endpoint yet, so this screen routes people to support
// instead of pretending to send a reset link.
export default function ForgotPasswordPage() {
  const subject = encodeURIComponent(`Password reset for my ${SITE.name} account`);

  return (
    <AuthShell
      aside={
        <>
          <AsideTitle>Locked out?</AsideTitle>
          <AsideText>It happens. Our team will help you get back into your account.</AsideText>
        </>
      }
    >
      <Link href="/login" className="mb-10 inline-flex items-center gap-2 text-ink-soft hover:text-ink">
        <ArrowLeft className="size-4" aria-hidden /> Back to Sign In
      </Link>
      <span className="mb-6 grid size-16 place-items-center rounded-2xl bg-brand-50 text-brand-600">
        <Mail className="size-7" aria-hidden />
      </span>
      <h2 className="text-4xl font-bold">Forgot Password?</h2>
      <p className="mt-3 text-lg text-ink-soft">
        Email us from the address you signed up with and we&apos;ll help you reset your password.
      </p>
      <a href={`mailto:${SITE.supportEmail}?subject=${subject}`} className={buttonClass("primary", "lg", "mt-8 w-full")}>
        Email {SITE.supportEmail}
      </a>
      <p className="mt-4 text-sm text-ink-faint">Signed in on the Superflats app? You can change your password from Profile.</p>
    </AuthShell>
  );
}
