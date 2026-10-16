"use client";

import Link from "next/link";
import { useActionState } from "react";
import { ArrowRight, Mail, MailCheck } from "lucide-react";
import { FormAlert } from "@/components/auth/auth-shell";
import { Field } from "@/components/common/field";
import { Button, buttonVariants } from "@/components/ui/button";
import { requestPasswordReset, type ResetState } from "../actions";

export function ForgotForm() {
  const [state, action, pending] = useActionState<ResetState, FormData>(requestPasswordReset, {});

  if (state.sent) {
    return (
      <div className="grid gap-5">
        <span className="grid size-12 place-items-center rounded-md bg-secondary text-secondary-foreground">
          <MailCheck className="size-5" aria-hidden />
        </span>
        <h1 className="font-display text-4xl font-semibold">Check your email</h1>
        <p className="text-muted-foreground">
          If an account exists for <span className="font-medium text-foreground">{state.values?.email}</span>, we&apos;ve sent a link to reset your password.        </p>
        <p className="text-sm text-muted-foreground">Didn&apos;t get it? Check your spam folder, or try again in a few minutes.</p>
        <Link href="/login" className={buttonVariants({ size: "xl", className: "mt-2 w-full" })}>
          Back to sign in
        </Link>
      </div>
    );
  }

  return (
    <form action={action} className="grid gap-5" noValidate>
      {state.error && <FormAlert>{state.error}</FormAlert>}
      <Field
        label="Email"
        name="email"
        type="email"
        icon={Mail}
        placeholder="you@example.com"
        autoComplete="email"
        autoFocus
        defaultValue={state.values?.email}
        error={state.fieldErrors?.email}
        required
      />
      <Button type="submit" size="xl" className="mt-1 w-full" loading={pending}>
        Send reset link {!pending && <ArrowRight aria-hidden />}
      </Button>
    </form>
  );
}
