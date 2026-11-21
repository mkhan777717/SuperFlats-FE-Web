"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import STATES from "@/data/india-states-cities.json";
import { clientApi } from "@/lib/client-api";
import { toStringArray } from "@/lib/format";
import type { OwnerProperty } from "@/lib/types";
import { AMENITY_SUGGESTIONS, FormError, FormSection, SelectField, SwitchField, TagInput, TextAreaField, TextField } from "./form-bits";
import { LocationPicker, type Coords } from "./location-picker";
import { PhotoPicker, uploadQueued } from "./photo-picker";
import { VideoPicker } from "./video-picker";
import { uploadVideosWithToast } from "./video-toast";

const UNIT_FIELDS = [
  { key: "count_1rk", label: "1RK" },
  { key: "count_1bhk", label: "1BHK" },
  { key: "count_2bhk", label: "2BHK" },
  { key: "count_3bhk", label: "3BHK" },
  { key: "count_3bhk_plus", label: "3BHK+" },
] as const;

type Errors = Partial<Record<"name" | "address" | "city" | "state" | "zipcode" | "area_sqft" | "units", string>>;

const STATE_NAMES = Object.keys(STATES as Record<string, string[]>).sort();

/** Create or edit a property. Mirrors the Admin app's property form and the backend's validation. */
export function PropertyForm({ property, onDone, canUploadVideo = true }: { property?: OwnerProperty; onDone?: () => void; canUploadVideo?: boolean }) {
  const router = useRouter();
  const editing = !!property;
  const [state, setState] = useState(property?.state ?? "");
  const [parking, setParking] = useState(!!property?.parking);
  const [managed, setManaged] = useState(property?.is_managed ?? true);
  const [amenities, setAmenities] = useState<string[]>(toStringArray(property?.amenities));
  const [coords, setCoords] = useState<Coords>(property?.latitude && property?.longitude ? { lat: Number(property.latitude), lng: Number(property.longitude) } : null);
  const [errors, setErrors] = useState<Errors>({});
  const [formError, setFormError] = useState<string>();
  const [saving, setSaving] = useState(false);
  const [newPhotos, setNewPhotos] = useState<File[]>([]);
  const [newVideos, setNewVideos] = useState<File[]>([]);
  const cities = (STATES as Record<string, string[]>)[state] ?? [];

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const d = new FormData(e.currentTarget);
    const get = (k: string) => String(d.get(k) ?? "").trim();
    const num = (k: string) => (get(k) === "" ? 0 : Number(get(k)));

    const body = {
      name: get("name"),
      description: get("description"),
      address: get("address"),
      city: get("city"),
      state: get("state"),
      zipcode: get("zipcode"),
      ...Object.fromEntries(UNIT_FIELDS.map(({ key }) => [key, num(key)])),
      ...(get("area_sqft") ? { area_sqft: Number(get("area_sqft")) } : {}),
      parking,
      is_managed: managed,
      amenities,
      ...(coords ? { latitude: coords.lat, longitude: coords.lng } : {}),
    };

    const next: Errors = {};
    if (body.name.length < 5) next.name = "Use at least 5 characters.";
    if (body.address.length < 2) next.address = "Enter the street address.";
    if (!body.state) next.state = "Choose a state.";
    if (body.city.length < 2) next.city = "Enter the city.";
    if (!/^\d{6}$/.test(body.zipcode)) next.zipcode = "PIN code must be 6 digits.";
    if (get("area_sqft") && !(Number(get("area_sqft")) > 0)) next.area_sqft = "Area must be a positive number.";
    if (UNIT_FIELDS.some(({ key }) => !Number.isInteger(num(key)) || num(key) < 0)) next.units = "Unit counts must be whole numbers.";
    else if (!editing && UNIT_FIELDS.every(({ key }) => num(key) === 0)) next.units = "Enter how many flats of at least one type the building has. You can only add flats up to these numbers.";
    setErrors(next);
    setFormError(undefined);
    if (Object.keys(next).length) return;

    setSaving(true);
    try {
      if (editing) {
        await clientApi(`/properties/${property.id}`, { method: "PATCH", body: JSON.stringify(body) });
        toast.success("Property updated");
        router.refresh();
        onDone?.();
      } else {
        const res = await clientApi<{ property: OwnerProperty }>("/properties", { method: "POST", body: JSON.stringify(body) });
        const ok = newPhotos.length
          ? await uploadQueued(newPhotos, (form) => clientApi(`/properties/upload-photo/${res.property.id}`, { method: "POST", body: form }))
          : 0;
        if (ok < newPhotos.length) toast.warning(`Property created. ${ok} of ${newPhotos.length} photos uploaded; add the rest on the property page.`);
        else toast.success(newPhotos.length ? `Property created with ${ok} photo${ok === 1 ? "" : "s"}. Add flats next.` : "Property created. Add photos and flats next.");
        if (canUploadVideo && newVideos.length) {
          await uploadVideosWithToast({ type: "Property", id: res.property.id }, newVideos, "add the rest on the property page");
        }
        onDone?.();
        router.push(`/dashboard/properties/${res.property.id}`);
      }
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Couldn't save the property");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={submit} className="grid gap-8" noValidate>
      <FormSection title="Basics">
        <TextField label="Property name" name="name" defaultValue={property?.name} placeholder="e.g. Green Valley Residency" error={errors.name} required />
        <TextAreaField label="Description" name="description" defaultValue={property?.description ?? ""} rows={3} placeholder="Building, neighbourhood and what makes it special" />
      </FormSection>

      <FormSection title="Address">
        <TextField label="Street address" name="address" defaultValue={property?.address} placeholder="Building, street, area" error={errors.address} required />
        <div className="grid gap-4 sm:grid-cols-2">
          <SelectField label="State" name="state" value={state} onChange={(e) => setState(e.target.value)} error={errors.state} required>
            <option value="">Choose state</option>
            {STATE_NAMES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
            {state && !STATE_NAMES.includes(state) && <option value={state}>{state}</option>}
          </SelectField>
          <TextField label="City" name="city" defaultValue={property?.city} list="city-options" placeholder="City" error={errors.city} required />
          <datalist id="city-options">
            {cities.map((c) => (
              <option key={c} value={c} />
            ))}
          </datalist>
        </div>
        <TextField label="PIN code" name="zipcode" defaultValue={property?.zipcode} inputMode="numeric" maxLength={6} placeholder="6 digits" error={errors.zipcode} className="sm:max-w-[50%]" required />
        <LocationPicker value={coords} onChange={setCoords} />
      </FormSection>

      <FormSection title="Units">
        <p className="-mt-2 text-sm text-muted-foreground">
          {editing ? "Units you can still add as flats, by type." : "How many flats of each type the building has. You add each flat after creating the property."}
        </p>
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
          {UNIT_FIELDS.map(({ key, label }) => (
            <TextField key={key} label={label} name={key} type="number" min={0} step={1} inputMode="numeric" defaultValue={String(property?.[key] ?? 0)} />
          ))}
        </div>
        <FormError>{errors.units}</FormError>
        <TextField label="Total area (sq ft)" name="area_sqft" type="number" min={1} defaultValue={property?.area_sqft ? String(property.area_sqft) : ""} placeholder="Optional" error={errors.area_sqft} className="sm:max-w-[50%]" />
      </FormSection>

      <FormSection title="Features">
        <SwitchField label="Parking available" checked={parking} onCheckedChange={setParking} />
        <SwitchField label="Managed by us" description="Show this property in bookings, tenants and rent." checked={managed} onCheckedChange={setManaged} />
        <TagInput label="Amenities" value={amenities} onChange={setAmenities} placeholder="Type and press Enter" suggestions={AMENITY_SUGGESTIONS} />
      </FormSection>

      {!editing && (
        <FormSection title={canUploadVideo ? "Photos & videos" : "Photos"}>
          <PhotoPicker files={newPhotos} onChange={setNewPhotos} />
          {canUploadVideo && <VideoPicker files={newVideos} onChange={setNewVideos} />}
        </FormSection>
      )}

      <FormError>{formError}</FormError>
      <div className="sticky bottom-0 -mx-6 flex justify-end gap-2 border-t bg-background px-6 py-4">
        {onDone && (
          <Button type="button" variant="ghost" onClick={onDone}>
            Cancel
          </Button>
        )}
        <Button type="submit" loading={saving}>
          {editing ? "Save changes" : "Create property"}
        </Button>
      </div>
    </form>
  );
}
