"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Pencil, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { clientApi } from "@/lib/client-api";
import type { Employee } from "@/lib/types";
import { FormError, FormSection, FormSheet, SelectField, TextField } from "./form-bits";

type Errors = Partial<Record<"name" | "email" | "phone_number" | "password", string>>;

/** Adds a team member: creates their login (email + password) inside your company. Admins only. */
function AddMemberForm({ onDone }: { onDone: () => void }) {
  const router = useRouter();
  const [errors, setErrors] = useState<Errors>({});
  const [formError, setFormError] = useState<string>();
  const [saving, setSaving] = useState(false);

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const d = new FormData(e.currentTarget);
    const get = (k: string) => String(d.get(k) ?? "").trim();
    const body = {
      name: get("name"),
      email: get("email"),
      phone_number: get("phone_number").replace(/\D/g, ""),
      password: String(d.get("password") ?? ""),
      role: get("role") || "agent",
      status: get("status") || "active",
    };
    const next: Errors = {};
    if (!body.name) next.name = "Enter their name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) next.email = "Enter a valid email address.";
    if (!/^\d{10,15}$/.test(body.phone_number)) next.phone_number = "Phone number must be 10 to 15 digits.";
    if (body.password.length < 8) next.password = "Password must be at least 8 characters.";
    setErrors(next);
    setFormError(undefined);
    if (Object.keys(next).length) return;

    setSaving(true);
    try {
      await clientApi("/employees", { method: "POST", body: JSON.stringify(body) });
      toast.success(`${body.name} added. Share their email and password so they can log in.`);
      router.refresh();
      onDone();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Couldn't add the team member");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={submit} className="grid gap-8" noValidate>
      <FormSection title="Member">
        <TextField label="Full name" name="name" autoComplete="off" error={errors.name} required />
        <TextField label="Email" name="email" type="email" autoComplete="off" error={errors.email} hint="They log in with this email." required />
        <TextField label="Mobile number" name="phone_number" type="tel" inputMode="numeric" error={errors.phone_number} required />
        <TextField label="Temporary password" name="password" type="password" autoComplete="new-password" minLength={8} error={errors.password} hint="At least 8 characters. They can change it from their profile." required />
      </FormSection>
      <FormSection title="Access">
        <div className="grid gap-4 sm:grid-cols-2">
          <SelectField label="Role" name="role" defaultValue="agent" hint="Agents handle viewings; admins can also edit and delete.">
            <option value="agent">Agent</option>
            <option value="admin">Admin</option>
          </SelectField>
          <SelectField label="Status" name="status" defaultValue="active">
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </SelectField>
        </div>
      </FormSection>
      <FormError>{formError}</FormError>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="ghost" onClick={onDone}>
          Cancel
        </Button>
        <Button type="submit" loading={saving}>
          Add member
        </Button>
      </div>
    </form>
  );
}

export function AddMemberButton() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <UserPlus aria-hidden /> Add member
      </Button>
      <FormSheet open={open} onOpenChange={setOpen} title="Add team member" description="Creates a login for them in your company.">
        {open && <AddMemberForm onDone={() => setOpen(false)} />}
      </FormSheet>
    </>
  );
}

/** Change role and status. Both are always sent: the backend clears whichever one is missing. */
export function EditMemberButton({ employee }: { employee: Employee }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string>();

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const d = new FormData(e.currentTarget);
    setSaving(true);
    setFormError(undefined);
    try {
      await clientApi(`/employees/${employee.id}`, { method: "PUT", body: JSON.stringify({ role: d.get("role"), status: d.get("status") }) });
      toast.success("Access updated");
      router.refresh();
      setOpen(false);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Couldn't update access");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Button size="sm" variant="ghost" onClick={() => setOpen(true)} className="normal-case tracking-normal">
        <Pencil aria-hidden /> Edit
      </Button>
      <FormSheet open={open} onOpenChange={setOpen} title={`Edit ${employee.user?.name ?? "member"}`} description={employee.user?.email}>
        <form onSubmit={submit} className="grid gap-6">
          <SelectField label="Role" name="role" defaultValue={employee.user?.role === "admin" ? "admin" : "agent"} hint="Your company must keep at least one admin.">
            <option value="agent">Agent</option>
            <option value="admin">Admin</option>
          </SelectField>
          <SelectField label="Status" name="status" defaultValue={employee.status ?? "active"}>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </SelectField>
          <FormError>{formError}</FormError>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" loading={saving}>
              Save
            </Button>
          </div>
        </form>
      </FormSheet>
    </>
  );
}
