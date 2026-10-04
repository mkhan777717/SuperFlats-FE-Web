"use client";

import { useActionState } from "react";
import { ArrowRight, Lock, Mail, Phone, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/input";
import { FormAlert } from "@/components/auth/auth-shell";
import { register, type FormState } from "../actions";

export function RegisterForm({ next }: { next?: string }) {
  const [state, action, pending] = useActionState<FormState, FormData>(register, {});
  const v = state.values ?? {};
  const e = state.fieldErrors ?? {};

  return (
    <form action={action} className="space-y-5" noValidate>
      {state.error && <FormAlert>{state.error}</FormAlert>}
      <input type="hidden" name="next" value={next ?? ""} />
      <Field label="Full Name" name="name" icon={User} placeholder="John Doe" autoComplete="name" defaultValue={v.name} error={e.name} required />
      <Field
        label="Email Address"
        name="email"
        type="email"
        icon={Mail}
        placeholder="you@example.com"
        autoComplete="email"
        defaultValue={v.email}
        error={e.email}
        required
      />
      <Field
        label="Phone Number"
        name="phone_number"
        type="tel"
        inputMode="numeric"
        icon={Phone}
        placeholder="98765 43210"
        autoComplete="tel-national"
        defaultValue={v.phone_number}
        error={e.phone_number}
        required
      />
      <Field
        label="Password"
        name="password"
        type="password"
        icon={Lock}
        placeholder="Min. 8 characters"
        autoComplete="new-password"
        minLength={8}
        error={e.password}
        required
      />
      <Button type="submit" size="lg" className="w-full" loading={pending}>
        Continue <ArrowRight className="size-4" aria-hidden />
      </Button>
    </form>
  );
}
