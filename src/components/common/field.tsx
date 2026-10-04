"use client";

import { Eye, EyeOff, type LucideIcon } from "lucide-react";
import { useId, useState, type ComponentProps, type ReactNode } from "react";
import { cn } from "@/lib/cn";

export const inputClass =
  "h-13 w-full rounded-2xl border border-line bg-surface px-4 text-[15px] text-ink placeholder:text-ink-faint " +
  "transition focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/15 disabled:bg-muted";

type FieldProps = ComponentProps<"input"> & {
  label: string;
  icon?: LucideIcon;
  error?: string;
  hint?: ReactNode;
  labelAside?: ReactNode;
};

export function Field({ label, icon: Icon, error, hint, labelAside, className, type, id, ...rest }: FieldProps) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const [reveal, setReveal] = useState(false);
  const isPassword = type === "password";

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label htmlFor={inputId} className="text-sm font-medium text-ink">
          {label}
        </label>
        {labelAside}
      </div>
      <div className="relative">
        {Icon && <Icon className="pointer-events-none absolute left-4 top-1/2 size-[18px] -translate-y-1/2 text-ink-faint" aria-hidden />}
        <input
          id={inputId}
          type={isPassword && reveal ? "text" : type}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : undefined}
          className={cn(inputClass, Icon && "pl-11", isPassword && "pr-12", error && "border-red-400", className)}
          {...rest}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setReveal((r) => !r)}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-ink-faint hover:text-ink"
            aria-label={reveal ? "Hide password" : "Show password"}
          >
            {reveal ? <EyeOff className="size-[18px]" /> : <Eye className="size-[18px]" />}
          </button>
        )}
      </div>
      {error ? (
        <p id={`${inputId}-error`} className="text-sm text-red-600">
          {error}
        </p>
      ) : (
        hint && <p className="text-sm text-ink-faint">{hint}</p>
      )}
    </div>
  );
}
