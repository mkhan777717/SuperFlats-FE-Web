"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { FLAT_TYPES } from "@/lib/config";
import { clientApi } from "@/lib/client-api";
import { toStringArray } from "@/lib/format";
import { unitsLeft } from "@/lib/units";
import type { Flat, OwnerProperty } from "@/lib/types";
import { FLAT_AMENITY_SUGGESTIONS, FormError, FormSection, SelectField, TagInput, TextAreaField, TextField } from "./form-bits";
import { PhotoManager } from "./photo-manager";
import { PhotoPicker, uploadQueued } from "./photo-picker";

type Errors = Partial<Record<"title" | "unit_number" | "type" | "area_sqft", string>>;

export function FlatForm({ property, flat, onDone, canDeletePhotos }: { property: OwnerProperty; flat?: Flat; onDone: () => void; canDeletePhotos: boolean }) {
  const router = useRouter();
  const editing = !!flat;
  const [amenities, setAmenities] = useState<string[]>(toStringArray(flat?.unique_amenities));
  const [errors, setErrors] = useState<Errors>({});
  const [formError, setFormError] = useState<string>();
  const [saving, setSaving] = useState(false);
  // New flats: photos chosen in the form, uploaded right after the flat is created.
  const [newPhotos, setNewPhotos] = useState<File[]>([]);
  const available = FLAT_TYPES.filter((t) => unitsLeft(property, t) > 0 || t === flat?.type);

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const d = new FormData(e.currentTarget);
    const get = (k: string) => String(d.get(k) ?? "").trim();
    const body = {
      title: get("title"),
      unit_number: get("unit_number").toUpperCase(),
      type: get("type"),
      flat_status: get("flat_status") || "available",
      description: get("description"),
      area_sqft: get("area_sqft") ? Number(get("area_sqft")) : null,
      unique_amenities: amenities,
    };
    const next: Errors = {};
    if (body.title.length < 3) next.title = "Use at least 3 characters.";
    if (!body.unit_number) next.unit_number = "Enter the unit or flat number.";
    if (!body.type) next.type = "Choose a type.";
    if (get("area_sqft") && !(Number(get("area_sqft")) > 0)) next.area_sqft = "Area must be a positive number.";
    setErrors(next);
    setFormError(undefined);
    if (Object.keys(next).length) return;

    setSaving(true);
    try {
      if (editing) {
        await clientApi(`/flats/${flat.id}`, { method: "PATCH", body: JSON.stringify(body) });
        toast.success("Flat updated");
      } else {
        const res = await clientApi<{ flat: Flat }>(`/properties/${property.id}/flats`, { method: "POST", body: JSON.stringify(body) });
        if (newPhotos.length) {
          const ok = await uploadQueued(newPhotos, (form) => clientApi(`/flats/${res.flat.id}/photos`, { method: "POST", body: form }));
          if (ok === newPhotos.length) toast.success(`Flat added with ${ok} photo${ok === 1 ? "" : "s"}`);
          else toast.warning(`Flat added. ${ok} of ${newPhotos.length} photos uploaded; edit the flat to retry the rest.`);
        } else {
          toast.success("Flat added");
        }
      }
      router.refresh();
      onDone();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Couldn't save the flat");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="grid gap-8">
      <form onSubmit={submit} className="grid gap-8" noValidate>
        <FormSection title="Flat">
          <TextField label="Title" name="title" defaultValue={flat?.title} placeholder="e.g. Corner 2BHK with balcony" error={errors.title} required />
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField label="Unit number" name="unit_number" defaultValue={flat?.unit_number} placeholder="e.g. B-204" error={errors.unit_number} required />
            <SelectField label="Type" name="type" defaultValue={flat?.type ?? available[0] ?? ""} error={errors.type} required>
              {!available.length && <option value="">No units left to add</option>}
              {available.map((t) => (
                <option key={t} value={t}>
                  {t}
                  {t !== flat?.type ? ` (${unitsLeft(property, t)} left)` : ""}
                </option>
              ))}
            </SelectField>
            <TextField label="Area (sq ft)" name="area_sqft" type="number" min={1} defaultValue={flat?.area_sqft ? String(flat.area_sqft) : ""} placeholder="Optional" error={errors.area_sqft} />
            <SelectField label="Status" name="flat_status" defaultValue={flat?.flat_status ?? "available"}>
              <option value="available">Available</option>
              <option value="occupied">Occupied</option>
              <option value="maintenance">Maintenance</option>
            </SelectField>
          </div>
          <TextAreaField label="Description" name="description" defaultValue={flat?.description ?? ""} rows={3} placeholder="Layout, floor, view, furnishing" />
          <TagInput label="Flat amenities" value={amenities} onChange={setAmenities} placeholder="Type and press Enter" suggestions={FLAT_AMENITY_SUGGESTIONS} />
          {!editing && <PhotoPicker files={newPhotos} onChange={setNewPhotos} />}
        </FormSection>
        {!editing && !available.length && (
          <FormError>All unit slots of this property are used. Edit the property to increase the unit counts first.</FormError>
        )}
        <FormError>{formError}</FormError>
        <div className="flex justify-end gap-2">
          <Button type="button" variant="ghost" onClick={onDone}>
            Cancel
          </Button>
          <Button type="submit" loading={saving} disabled={!editing && !available.length}>
            {editing ? "Save changes" : newPhotos.length ? `Add flat with ${newPhotos.length} photo${newPhotos.length === 1 ? "" : "s"}` : "Add flat"}
          </Button>
        </div>
      </form>

      {editing && (
        <FormSection title="Photos">
          <PhotoManager photos={flat.photos ?? []} uploadPath={`/flats/${flat.id}/photos`} deleteBase={`/flats/${flat.id}/photos`} canDelete={canDeletePhotos} />
        </FormSection>
      )}
    </div>
  );
}
