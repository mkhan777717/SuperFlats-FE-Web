import type { Metadata } from "next";
import Link from "next/link";
import { AuthShell, FormHeader } from "@/components/auth/auth-shell";
import { buttonVariants } from "@/components/ui/button";
import { ResetForm } from "./reset-form";

export const metadata: Metadata = { title: "Reset password", robots: { index: false } };

/** Opened from the link in the reset email: /reset-password?token=… */
export default async function ResetPasswordPage({ searchParams }: PageProps<"/reset-password">) {
  const { token } = await searchParams;
  const value = typeof token === "string" ? token : "";

  return (
    <AuthShell>
      {value ? (
        <>
          <FormHeader title="Set a new password" subtitle="Choose a password you haven't used here before." />
          <ResetForm token={value} />
        </>
      ) : (
        <>
          <FormHeader title="Link not valid" subtitle="This reset link is missing or incomplete. Request a new one and open it from your email." />
          <Link href="/forgot-password" className={buttonVariants({ size: "xl", className: "w-full" })}>
            Request a new link
          </Link>
        </>
      )}
    </AuthShell>
  );
}
