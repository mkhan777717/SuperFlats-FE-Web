"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { SlidersHorizontal } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { clientApi } from "@/lib/client-api";
import type { Appointment, EmployeePage, Employee } from "@/lib/types";
import { FormError, FormSection, FormSheet, SelectField, TextAreaField, TextField } from "./form-bits";
import { useOptions } from "./use-options";

const pad = (n: number) => String(n).padStart(2, "0");
/** ISO → value for <input type="datetime-local"> in the viewer's own time zone. */
const toLocalInput = (iso: string) => {
  const d = new Date(iso);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

/**
 * Manage one viewing: assign an agent, reschedule, change status, add notes.
 * Mirrors the Admin app's appointment sheet. The agent is stored by user id.
 */
export function ManageViewingButton({ viewing }: { viewing: Appointment }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string>();
  const team = useOptions<Employee>(open ? "/employees?limit=100&offset=0" : null, (d) => (d as EmployeePage).employees);
  const agents = team.items.filter((e) => e.user && e.status !== "inactive");

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const d = new FormData(e.currentTarget);
    const when = String(d.get("scheduled_at") ?? "");
    const employee = String(d.get("employee_id") ?? "");
    const status = String(d.get("status") ?? "");
    const feedback = String(d.get("feedback") ?? "").trim();

    const body: Record<string, unknown> = {};
    const iso = when ? new Date(when).toISOString() : "";
    if (iso && iso !== new Date(viewing.scheduled_at).toISOString()) body.scheduled_at = iso;
    const employeeId = employee ? Number(employee) : null;
    if (employeeId !== (viewing.employee_id ?? null)) body.employee_id = employeeId;
    if (status && status !== viewing.status) body.status = status;
    if (feedback !== (viewing.feedback ?? "")) body.feedback = feedback;

    setFormError(undefined);
    if (!Object.keys(body).length) return setOpen(false);
    setSaving(true);
    try {
      await clientApi(`/appointments/${viewing.id}`, { method: "PATCH", body: JSON.stringify(body) });
      toast.success("Viewing updated");
      router.refresh();
      setOpen(false);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Couldn't update the viewing");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Button size="sm" variant="outline" onClick={() => setOpen(true)} className="normal-case tracking-normal">
        <SlidersHorizontal aria-hidden /> Manage
      </Button>
      <FormSheet open={open} onOpenChange={setOpen} title="Manage viewing" description={viewing.listing?.title ?? undefined}>
        <form onSubmit={submit} className="grid gap-8">
          <FormSection title="Schedule">
            <TextField label="Date and time" name="scheduled_at" type="datetime-local" defaultValue={toLocalInput(viewing.scheduled_at)} hint="Changing this reschedules the visit." />
            <SelectField label="Assigned agent" name="employee_id" defaultValue={viewing.employee_id ? String(viewing.employee_id) : ""} key={agents.length} disabled={team.loading} error={team.error}>
              <option value="">{team.loading ? "Loading team…" : "Not assigned"}</option>
              {agents.map((e) => (
                <option key={e.id} value={e.user!.id}>
                  {e.user!.name} · {e.user!.role === "admin" ? "Admin" : "Agent"}
                </option>
              ))}
            </SelectField>
          </FormSection>
          <FormSection title="Outcome">
            <SelectField label="Status" name="status" defaultValue={viewing.status}>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </SelectField>
            <TextAreaField label="Notes / feedback" name="feedback" defaultValue={viewing.feedback ?? ""} rows={4} maxLength={2000} placeholder="How did the visit go?" />
          </FormSection>
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
