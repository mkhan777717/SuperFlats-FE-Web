"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { clientApi } from "@/lib/client-api";
import type { Booking, Flat, OwnerProperty, PropertyPage, Tenant } from "@/lib/types";
import { FormError, FormSection, SelectField, TextField } from "./form-bits";
import { useOptions } from "./use-options";

type Errors = Partial<Record<"property" | "flat_id" | "tenant_id" | "start_date" | "end_date" | "monthly_rent" | "security_amount", string>>;

const dateOnly = (iso?: string) => (iso ? new Date(iso).toISOString().slice(0, 10) : "");

/**
 * New booking: choose a managed property, then an available flat and an available tenant
 * from it. Creating it marks both as occupied; monthly rent bills start on the 1st.
 */
export function BookingForm({ booking, onDone }: { booking?: Booking; onDone: () => void }) {
  const router = useRouter();
  const editing = !!booking;
  const [propertyId, setPropertyId] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [formError, setFormError] = useState<string>();
  const [saving, setSaving] = useState(false);

  const properties = useOptions<OwnerProperty>(editing ? null : "/properties?limit=100&offset=0&sortBy=name&sortOrder=ASC", (d) => (d as PropertyPage).properties);
  const flats = useOptions<Flat>(!editing && propertyId ? `/properties/${propertyId}/bookings/flats/available` : null, (d) => d as Flat[]);
  const tenants = useOptions<Tenant>(!editing && propertyId ? `/properties/${propertyId}/tenants/available` : null, (d) => d as Tenant[]);

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const d = new FormData(e.currentTarget);
    const get = (k: string) => String(d.get(k) ?? "").trim();
    const body: Record<string, unknown> = {
      start_date: get("start_date"),
      end_date: get("end_date"),
      monthly_rent: Number(get("monthly_rent")),
      security_amount: Number(get("security_amount") || 0),
      security_type: get("security_type") || "deposit",
    };
    if (editing) body.status = get("status");

    const next: Errors = {};
    if (!editing && !propertyId) next.property = "Choose a property.";
    if (!editing && !get("flat_id")) next.flat_id = "Choose a flat.";
    if (!editing && !get("tenant_id")) next.tenant_id = "Choose a tenant.";
    if (!body.start_date) next.start_date = "Choose the start date.";
    if (!body.end_date) next.end_date = "Choose the end date.";
    else if (body.start_date && String(body.end_date) <= String(body.start_date)) next.end_date = "End date must be after the start date.";
    if (!(Number(body.monthly_rent) > 0)) next.monthly_rent = "Enter the monthly rent.";
    if (!(Number(body.security_amount) >= 0)) next.security_amount = "Enter 0 or more.";
    setErrors(next);
    setFormError(undefined);
    if (Object.keys(next).length) return;

    setSaving(true);
    try {
      if (editing) {
        await clientApi(`/bookings/${booking.id}`, { method: "PATCH", body: JSON.stringify(body) });
        toast.success("Booking updated");
      } else {
        await clientApi("/bookings", { method: "POST", body: JSON.stringify({ ...body, flat_id: Number(get("flat_id")), tenant_id: Number(get("tenant_id")) }) });
        toast.success("Booking created. The flat and tenant are now occupied.");
      }
      router.refresh();
      onDone();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Couldn't save the booking");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={submit} className="grid gap-8" noValidate>
      {!editing ? (
        <FormSection title="Who and where">
          <SelectField label="Property" value={propertyId} onChange={(e) => setPropertyId(e.target.value)} error={errors.property ?? properties.error} disabled={properties.loading}>
            <option value="">{properties.loading ? "Loading properties…" : "Choose property"}</option>
            {properties.items.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </SelectField>
          <SelectField
            label="Flat"
            name="flat_id"
            defaultValue=""
            key={`f${propertyId}`}
            disabled={!propertyId || flats.loading}
            error={errors.flat_id ?? flats.error}
            hint={propertyId && !flats.loading && !flats.items.length ? "No available flats in this property." : undefined}
          >
            <option value="">{!propertyId ? "Choose a property first" : flats.loading ? "Loading flats…" : "Choose flat"}</option>
            {flats.items.map((f) => (
              <option key={f.id} value={f.id}>
                {f.unit_number} · {f.type}
              </option>
            ))}
          </SelectField>
          <SelectField
            label="Tenant"
            name="tenant_id"
            defaultValue=""
            key={`t${propertyId}`}
            disabled={!propertyId || tenants.loading}
            error={errors.tenant_id ?? tenants.error}
            hint={propertyId && !tenants.loading && !tenants.items.length ? "No available tenants for this property. Add the tenant first under Tenants." : undefined}
          >
            <option value="">{!propertyId ? "Choose a property first" : tenants.loading ? "Loading tenants…" : "Choose tenant"}</option>
            {tenants.items.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name} · {t.phone_number}
              </option>
            ))}
          </SelectField>
        </FormSection>
      ) : (
        <p className="text-sm text-muted-foreground">
          {booking.tenant?.name} · Unit {booking.flat?.unit_number}, {booking.flat?.property?.name}
        </p>
      )}

      <FormSection title="Contract">
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField label="Start date" name="start_date" type="date" defaultValue={dateOnly(booking?.start_date)} error={errors.start_date} required />
          <TextField label="End date" name="end_date" type="date" defaultValue={dateOnly(booking?.end_date)} error={errors.end_date} required />
          <TextField label="Monthly rent (₹)" name="monthly_rent" type="number" min={1} inputMode="numeric" defaultValue={booking ? String(Number(booking.monthly_rent)) : ""} error={errors.monthly_rent} required />
          <TextField label="Security amount (₹)" name="security_amount" type="number" min={0} inputMode="numeric" defaultValue={booking ? String(Number(booking.security_amount)) : ""} error={errors.security_amount} required />
          <SelectField label="Security type" name="security_type" defaultValue={booking?.security_type ?? "deposit"}>
            <option value="deposit">Deposit</option>
            <option value="lease">Lease</option>
          </SelectField>
          {editing && (
            <SelectField label="Status" name="status" defaultValue={booking.status} hint="Ending or cancelling frees the flat and tenant.">
              <option value="active">Active</option>
              <option value="ended">Ended</option>
              <option value="cancelled">Cancelled</option>
            </SelectField>
          )}
        </div>
      </FormSection>

      <FormError>{formError}</FormError>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="ghost" onClick={onDone}>
          Cancel
        </Button>
        <Button type="submit" loading={saving}>
          {editing ? "Save changes" : "Create booking"}
        </Button>
      </div>
    </form>
  );
}
