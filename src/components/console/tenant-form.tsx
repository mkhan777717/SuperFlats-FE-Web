"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { clientApi } from "@/lib/client-api";
import type { OwnerProperty, PropertyPage, Tenant } from "@/lib/types";
import { FormError, FormSection, SelectField, TextField } from "./form-bits";
import { useOptions } from "./use-options";

type Errors = Partial<Record<"property_id" | "name" | "phone_number", string>>;

/** Add or edit a tenant record (name, phone, property). Status is set by bookings. */
export function TenantForm({ tenant, onDone }: { tenant?: Tenant; onDone: (id?: number) => void }) {
  const router = useRouter();
  const editing = !!tenant;
  const [errors, setErrors] = useState<Errors>({});
  const [formError, setFormError] = useState<string>();
  const [saving, setSaving] = useState(false);
  const properties = useOptions<OwnerProperty>("/properties?limit=100&offset=0&sortBy=name&sortOrder=ASC", (d) => (d as PropertyPage).properties);

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const d = new FormData(e.currentTarget);
    const body = {
      property_id: Number(d.get("property_id")),
      name: String(d.get("name") ?? "").trim(),
      phone_number: String(d.get("phone_number") ?? "").replace(/\D/g, ""),
    };
    const next: Errors = {};
    if (!body.property_id) next.property_id = "Choose a property.";
    if (body.name.length < 2) next.name = "Enter the tenant's name.";
    if (!/^\d{10,15}$/.test(body.phone_number)) next.phone_number = "Phone number must be 10 to 15 digits.";
    setErrors(next);
    setFormError(undefined);
    if (Object.keys(next).length) return;

    setSaving(true);
    try {
      if (editing) {
        await clientApi(`/tenants/${tenant.id}`, { method: "PATCH", body: JSON.stringify(body) });
        toast.success("Tenant updated");
        router.refresh();
        onDone();
      } else {
        const res = await clientApi<{ tenant: Tenant }>("/tenants", { method: "POST", body: JSON.stringify(body) });
        toast.success("Tenant added");
        router.refresh();
        onDone(res.tenant.id);
      }
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Couldn't save the tenant");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={submit} className="grid gap-8" noValidate>
      <FormSection title="Tenant">
        <SelectField label="Property" name="property_id" defaultValue={tenant?.property_id ? String(tenant.property_id) : ""} error={errors.property_id ?? properties.error} disabled={properties.loading} key={properties.items.length}>
          <option value="">{properties.loading ? "Loading properties…" : "Choose property"}</option>
          {properties.items.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </SelectField>
        <TextField label="Full name" name="name" defaultValue={tenant?.name} autoComplete="off" error={errors.name} required />
        <TextField label="Mobile number" name="phone_number" type="tel" inputMode="numeric" defaultValue={tenant?.phone_number} placeholder="10-digit mobile number" error={errors.phone_number} required />
        <p className="text-xs text-muted-foreground">The tenant becomes “occupied” automatically when you create a booking for them.</p>
      </FormSection>
      <FormError>{formError}</FormError>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="ghost" onClick={() => onDone()}>
          Cancel
        </Button>
        <Button type="submit" loading={saving}>
          {editing ? "Save changes" : "Add tenant"}
        </Button>
      </div>
    </form>
  );
}
