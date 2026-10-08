"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { clientApi } from "@/lib/client-api";
import type { Flat, Listing, OwnerProperty, PropertyPage } from "@/lib/types";
import { FormError, FormSection, SelectField, TextAreaField, TextField } from "./form-bits";
import { useOptions } from "./use-options";

type Errors = Partial<Record<"property" | "flat" | "title" | "description" | "monthly_rent" | "security_amount", string>>;

/**
 * New listing: choose a property, then one of its flats that isn't listed yet.
 * Editing changes the advert only (the flat stays the same).
 */
export function ListingForm({ listing, onDone }: { listing?: Listing; onDone: () => void }) {
  const router = useRouter();
  const editing = !!listing;
  const [propertyId, setPropertyId] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [formError, setFormError] = useState<string>();
  const [saving, setSaving] = useState(false);

  const properties = useOptions<OwnerProperty>(editing ? null : "/properties?limit=100&offset=0&sortBy=name&sortOrder=ASC", (d) => (d as PropertyPage).properties);
  const flats = useOptions<Flat>(!editing && propertyId ? `/properties/${propertyId}/listings/flats/available` : null, (d) => d as Flat[]);

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const d = new FormData(e.currentTarget);
    const get = (k: string) => String(d.get(k) ?? "").trim();
    const body: Record<string, unknown> = {
      title: get("title"),
      description: get("description"),
      monthly_rent: Number(get("monthly_rent")),
      security_amount: Number(get("security_amount") || 0),
      security_type: get("security_type") || "deposit",
      status: get("status") || "active",
    };
    const next: Errors = {};
    if (!editing && !propertyId) next.property = "Choose a property.";
    if (!editing && !get("flat_id")) next.flat = "Choose a flat.";
    if (String(body.title).length < 5) next.title = "Use at least 5 characters.";
    if (body.description && String(body.description).length < 10) next.description = "Write at least 10 characters, or leave it empty.";
    if (!(Number(body.monthly_rent) > 0)) next.monthly_rent = "Enter the monthly rent.";
    if (!(Number(body.security_amount) >= 0)) next.security_amount = "Enter 0 or more.";
    setErrors(next);
    setFormError(undefined);
    if (Object.keys(next).length) return;

    setSaving(true);
    try {
      if (editing) {
        await clientApi(`/listings/${listing.id}`, { method: "PATCH", body: JSON.stringify(body) });
        toast.success("Listing updated");
      } else {
        await clientApi("/listings", { method: "POST", body: JSON.stringify({ ...body, flat_id: Number(get("flat_id")) }) });
        toast.success(body.status === "active" ? "Listing is live" : "Listing saved");
      }
      router.refresh();
      onDone();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Couldn't save the listing");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={submit} className="grid gap-8" noValidate>
      {!editing && (
        <FormSection title="Flat">
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
            key={propertyId}
            error={errors.flat ?? flats.error}
            disabled={!propertyId || flats.loading}
            hint={propertyId && !flats.loading && !flats.items.length ? "Every flat in this property already has a listing. Add a flat first." : undefined}
          >
            <option value="">{!propertyId ? "Choose a property first" : flats.loading ? "Loading flats…" : "Choose flat"}</option>
            {flats.items.map((f) => (
              <option key={f.id} value={f.id}>
                {f.unit_number} · {f.type}
                {f.title ? ` · ${f.title}` : ""}
              </option>
            ))}
          </SelectField>
        </FormSection>
      )}

      <FormSection title="Advert">
        <TextField label="Title" name="title" defaultValue={listing?.title} placeholder="e.g. Sunny 2BHK near the park" error={errors.title} required />
        <TextAreaField label="Description" name="description" defaultValue={listing?.description ?? ""} rows={4} placeholder="What renters should know about the flat" error={errors.description} />
      </FormSection>

      <FormSection title="Price">
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField label="Monthly rent (₹)" name="monthly_rent" type="number" min={1} inputMode="numeric" defaultValue={listing ? String(Number(listing.monthly_rent)) : ""} error={errors.monthly_rent} required />
          <TextField label="Security amount (₹)" name="security_amount" type="number" min={0} inputMode="numeric" defaultValue={listing ? String(Number(listing.security_amount)) : ""} error={errors.security_amount} required />
          <SelectField label="Security type" name="security_type" defaultValue={listing?.security_type ?? "deposit"}>
            <option value="deposit">Deposit</option>
            <option value="lease">Lease</option>
          </SelectField>
          <SelectField label="Status" name="status" defaultValue={listing?.status ?? "active"} hint="Only active listings are shown to renters.">
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="closed">Closed</option>
          </SelectField>
        </div>
      </FormSection>

      <FormError>{formError}</FormError>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="ghost" onClick={onDone}>
          Cancel
        </Button>
        <Button type="submit" loading={saving}>
          {editing ? "Save changes" : "Create listing"}
        </Button>
      </div>
    </form>
  );
}
