"use client";

import Link from "next/link";
import { useActionState } from "react";
import { ArrowRight, CircleCheck, Lock } from "lucide-react";
import { FormAlert } from "@/components/auth/auth-shell";
import { Field } from "@/components/common/field";
import { Button, buttonVariants } from "@/components/ui/button";
import { resetPassword, type ResetState } from "../actions";

export function ResetForm({ token }: { token: string }) {
  const [state, action, pending] = useActionState<ResetState, FormData>(resetPassword, {});

  if (state.done) {
    return (
      <div className="grid gap-5">
        <span className="grid size-12 place-items-center rounded-md bg-secondary text-secondary-foreground">
          <CircleCheck className="size-5" aria-hidden />
        </span>
        <h1 className="font-display text-4xl font-semibold">Password changed</h1>
        <p className="text-muted-foreground">Your password has been reset. Sign in with your new password.</p>
        <Link href="/login" className={buttonVariants({ size: "xl", className: "mt-2 w-full" })}>
          Sign in
        </Link>
      </div>
    );
  }

  return (
    <form action={action} className="grid gap-5" noValidate>
      {state.error && (
        <FormAlert>
          {state.error}{" "}
          <Link href="/forgot-password" className="font-semibold underline">
            Request a new link
          </Link>
        </FormAlert>
      )}
      <input type="hidden" name="token" value={token} />
      <Field
        label="New password"
        name="password"
        type="password"
        icon={Lock}
        placeholder="At least 8 characters"
        autoComplete="new-password"
        autoFocus
        error={state.fieldErrors?.password}
        required
      />
      <Field
        label="Confirm new password"
        name="confirm"
        type="password"
        icon={Lock}
        placeholder="Type it again"
        autoComplete="new-password"
        error={state.fieldErrors?.confirm}
        required
      />
      <Button type="submit" size="xl" className="mt-1 w-full" loading={pending}>
        Set new password {!pending && <ArrowRight aria-hidden />}
      </Button>
    </form>
  );
}
