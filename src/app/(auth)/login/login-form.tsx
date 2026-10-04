"use client";

import Link from "next/link";
import { useActionState } from "react";
import { ArrowRight, Lock, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/input";
import { FormAlert } from "@/components/auth/auth-shell";
import { login, type FormState } from "../actions";

export function LoginForm({ next, expired }: { next?: string; expired?: boolean }) {
  const [state, action, pending] = useActionState<FormState, FormData>(login, {});

  return (
    <form action={action} className="space-y-5" noValidate>
      {expired && !state.error && <FormAlert tone="info">Your session expired. Please sign in again.</FormAlert>}
      {state.error && <FormAlert>{state.error}</FormAlert>}
      <input type="hidden" name="next" value={next ?? ""} />
      <Field
        label="Email Address"
        name="email"
        type="email"
        icon={Mail}
        placeholder="you@example.com"
        autoComplete="email"
        defaultValue={state.values?.email}
        error={state.fieldErrors?.email}
        required
      />
      <Field
        label="Password"
        name="password"
        type="password"
        icon={Lock}
        placeholder="••••••••"
        autoComplete="current-password"
        error={state.fieldErrors?.password}
        labelAside={
          <Link href="/forgot-password" className="text-sm font-medium text-brand-600 hover:underline">
            Forgot password?
          </Link>
        }
        required
      />
      <Button type="submit" size="lg" className="w-full" loading={pending}>
        Sign In <ArrowRight className="size-4" aria-hidden />
      </Button>
    </form>
  );
}
