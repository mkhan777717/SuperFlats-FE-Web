"use client";

import { useActionState, useState } from "react";
import { ArrowRight, Building2, Home, Lock, Mail, Phone, User } from "lucide-react";
import { FormAlert } from "@/components/auth/auth-shell";
import { Field } from "@/components/common/field";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { register, type FormState } from "../actions";

type AccountType = "renter" | "owner";

const TYPES: { value: AccountType; title: string; text: string; icon: typeof Home }[] = [
  { value: "renter", title: "Find a home", text: "Browse and visit flats", icon: Home },
  { value: "owner", title: "List property", text: "Manage flats & tenants", icon: Building2 },
];

export function RegisterForm({ next, initialType }: { next?: string; initialType: AccountType }) {
  const [state, action, pending] = useActionState<FormState, FormData>(register, {});
  const [type, setType] = useState<AccountType>(initialType);
  const v = state.values ?? {};
  const e = state.fieldErrors ?? {};

  return (
    <form action={action} className="grid gap-5" noValidate>
      <fieldset>
        <legend className="mb-2 text-sm font-medium">I want to</legend>
        <div className="grid grid-cols-2 gap-3">
          {TYPES.map(({ value, title, text, icon: Icon }) => {
            const active = type === value;
            return (
              <label
                key={value}
                className={cn(
                  "relative flex cursor-pointer flex-col gap-2 rounded-2xl border-2 p-4 transition has-focus-visible:ring-3 has-focus-visible:ring-ring/50",
                  active ? "border-primary bg-secondary/60" : "border-border hover:border-primary/40",
                )}
              >
                <input type="radio" name="account_type" value={value} checked={active} onChange={() => setType(value)} className="sr-only" />
                <span className={cn("grid size-9 place-items-center rounded-xl", active ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground")}>
                  <Icon className="size-[18px]" aria-hidden />
                </span>
                <span>
                  <span className="block text-sm font-semibold">{title}</span>
                  <span className="block text-xs text-muted-foreground">{text}</span>
                </span>
              </label>
            );
          })}
        </div>
      </fieldset>

      {state.error && <FormAlert>{state.error}</FormAlert>}
      <input type="hidden" name="next" value={next ?? ""} />
      <Field label="Full name" name="name" icon={User} placeholder="Your name" autoComplete="name" defaultValue={v.name} error={e.name} required />
      <Field label="Email" name="email" type="email" icon={Mail} placeholder="you@example.com" autoComplete="email" defaultValue={v.email} error={e.email} required />
      <Field
        label="Mobile number"
        name="phone_number"
        type="tel"
        inputMode="numeric"
        icon={Phone}
        placeholder="10-digit mobile number"
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
        placeholder="At least 8 characters"
        autoComplete="new-password"
        minLength={8}
        error={e.password}
        required
      />
      <Button type="submit" size="xl" className="mt-1 w-full" loading={pending}>
        {type === "owner" ? "Create owner account" : "Create account"} {!pending && <ArrowRight aria-hidden />}
      </Button>
      {type === "owner" && (
        <p className="-mt-1 text-center text-xs text-muted-foreground">We set up a workspace for your properties. You can invite your team later.</p>
      )}
    </form>
  );
}
