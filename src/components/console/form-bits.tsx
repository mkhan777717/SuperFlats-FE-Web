"use client";

import { useId, useState, type ComponentProps, type ReactNode } from "react";
import { ChevronDown, Plus, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

/** Side panel used for every create/edit form in the console. */
export function FormSheet({
  open,
  onOpenChange,
  title,
  description,
  children,
  wide,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: ReactNode;
  wide?: boolean;
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className={cn("w-full gap-0 overflow-y-auto p-0", wide ? "sm:max-w-2xl" : "sm:max-w-lg")}>
        <SheetHeader className="border-b px-6 py-5">
          <SheetTitle className="font-display text-2xl font-medium text-primary">{title}</SheetTitle>
          {description && <SheetDescription>{description}</SheetDescription>}
        </SheetHeader>
        <div className="px-6 py-6">{children}</div>
      </SheetContent>
    </Sheet>
  );
}

export function FormSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <fieldset className="grid min-w-0 gap-4">
      <legend className="mb-1 text-[0.7rem] font-semibold tracking-[0.14em] text-muted-foreground uppercase">{title}</legend>
      {children}
    </fieldset>
  );
}

type Base = { label: string; error?: string; hint?: ReactNode; className?: string };

export function TextField({ label, error, hint, className, id, ...rest }: Base & ComponentProps<"input">) {
  const auto = useId();
  const fid = id ?? auto;
  return (
    <div className={cn("grid gap-1.5", className)}>
      <Label htmlFor={fid}>{label}</Label>
      <Input id={fid} aria-invalid={!!error || undefined} {...rest} />
      {error ? <p className="text-sm text-destructive">{error}</p> : hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

export function TextAreaField({ label, error, hint, className, id, ...rest }: Base & ComponentProps<"textarea">) {
  const auto = useId();
  const fid = id ?? auto;
  return (
    <div className={cn("grid gap-1.5", className)}>
      <Label htmlFor={fid}>{label}</Label>
      <Textarea id={fid} aria-invalid={!!error || undefined} {...rest} />
      {error ? <p className="text-sm text-destructive">{error}</p> : hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

export function SelectField({ label, error, hint, className, id, children, ...rest }: Base & ComponentProps<"select">) {
  const auto = useId();
  const fid = id ?? auto;
  return (
    <div className={cn("grid gap-1.5", className)}>
      <Label htmlFor={fid}>{label}</Label>
      <span className="relative">
        <select
          id={fid}
          aria-invalid={!!error || undefined}
          className="h-10 w-full cursor-pointer appearance-none rounded-sm border border-input bg-card pr-9 pl-3 text-sm outline-none focus:border-ring focus:ring-3 focus:ring-ring/20 aria-invalid:border-destructive disabled:opacity-60"
          {...rest}
        >
          {children}
        </select>
        <ChevronDown className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
      </span>
      {error ? <p className="text-sm text-destructive">{error}</p> : hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

export function SwitchField({ label, description, checked, onCheckedChange }: { label: string; description?: string; checked: boolean; onCheckedChange: (v: boolean) => void }) {
  const id = useId();
  return (
    <div className="flex items-center justify-between gap-4 rounded-sm border px-4 py-3">
      <span>
        <Label htmlFor={id}>{label}</Label>
        {description && <span className="mt-0.5 block text-xs text-muted-foreground">{description}</span>}
      </span>
      <Switch id={id} checked={checked} onCheckedChange={onCheckedChange} />
    </div>
  );
}

/** Free-text tags (amenities). Enter or comma adds, × removes. */
export function TagInput({ label, value, onChange, placeholder, suggestions = [] }: { label: string; value: string[]; onChange: (v: string[]) => void; placeholder?: string; suggestions?: string[] }) {
  const id = useId();
  const [draft, setDraft] = useState("");
  const add = (raw: string) => {
    const tag = raw.trim().replace(/,$/, "");
    if (tag && !value.some((v) => v.toLowerCase() === tag.toLowerCase())) onChange([...value, tag]);
    setDraft("");
  };
  const unused = suggestions.filter((s) => !value.some((v) => v.toLowerCase() === s.toLowerCase()));

  return (
    <div className="grid gap-2">
      <Label htmlFor={id}>{label}</Label>
      <div className="flex gap-2">
        <Input
          id={id}
          value={draft}
          placeholder={placeholder}
          onChange={(e) => (e.target.value.endsWith(",") ? add(e.target.value) : setDraft(e.target.value))}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add(draft);
            }
          }}
        />
        <button type="button" onClick={() => add(draft)} className="grid size-10 shrink-0 place-items-center rounded-sm border hover:bg-muted" aria-label={`Add ${label.toLowerCase()}`}>
          <Plus className="size-4" />
        </button>
      </div>
      {value.length > 0 && (
        <ul className="flex flex-wrap gap-2">
          {value.map((tag) => (
            <li key={tag} className="inline-flex h-8 items-center gap-1.5 rounded-sm bg-accent pr-1.5 pl-3 text-sm text-accent-foreground">
              {tag}
              <button type="button" onClick={() => onChange(value.filter((v) => v !== tag))} className="grid size-5 place-items-center rounded-sm hover:bg-black/10" aria-label={`Remove ${tag}`}>
                <X className="size-3.5" />
              </button>
            </li>
          ))}
        </ul>
      )}
      {unused.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {unused.map((s) => (
            <button key={s} type="button" onClick={() => add(s)} className="rounded-sm border border-dashed px-2.5 py-1 text-xs text-muted-foreground hover:border-solid hover:text-foreground">
              + {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function FormError({ children }: { children?: ReactNode }) {
  if (!children) return null;
  return (
    <p role="alert" className="rounded-sm bg-destructive-soft px-3 py-2 text-sm text-destructive">
      {children}
    </p>
  );
}

export const AMENITY_SUGGESTIONS = ["Lift", "Parking", "Power backup", "Security", "CCTV", "Water supply", "Gym", "Swimming pool", "Club house", "Garden"];
export const FLAT_AMENITY_SUGGESTIONS = ["AC", "Furnished", "Semi-furnished", "Balcony", "Modular kitchen", "Wardrobe", "Geyser", "Wi-Fi"];
