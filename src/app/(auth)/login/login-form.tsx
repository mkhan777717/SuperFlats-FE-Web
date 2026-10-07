"use client";

import Link from "next/link";
import { useActionState } from "react";
import { ArrowRight, Lock, Mail } from "lucide-react";
import { FormAlert } from "@/components/auth/auth-shell";
import { Field } from "@/components/common/field";
import { Button } from "@/components/ui/button";
import { login, type FormState } from "../actions";

export function LoginForm({ next, expired }: { next?: string; expired?: boolean }) {
  const [state, action, pending] = useActionState<FormState, FormData>(login, {});

  return (
    <form action={action} className="grid gap-5" noValidate>
      {expired && !state.error && <FormAlert tone="info">Your session expired. Please sign in again.</FormAlert>}
      {state.error && <FormAlert>{state.error}</FormAlert>}
      <input type="hidden" name="next" value={next ?? ""} />
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
      <Field
        label="Password"
        name="password"
        type="password"
        icon={Lock}
        placeholder="Your password"
        autoComplete="current-password"
        error={state.fieldErrors?.password}
        labelAside={
          <Link href="/forgot-password" className="text-sm font-medium text-link hover:underline">
            Forgot password?
          </Link>
        }
        required
      />
      <Button type="submit" size="xl" className="mt-1 w-full" loading={pending}>
        Sign in {!pending && <ArrowRight aria-hidden />}
      </Button>
    </form>
  );
}
