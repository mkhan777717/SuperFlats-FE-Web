"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { clientApi } from "@/lib/client-api";
import type { Tenant } from "@/lib/types";
import { FormSheet } from "./form-bits";
import { TenantForm } from "./tenant-form";

export function AddTenantButton() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <Plus aria-hidden /> Add tenant
      </Button>
      <FormSheet open={open} onOpenChange={setOpen} title="Add tenant">
        {open && (
          <TenantForm
            onDone={(id) => {
              setOpen(false);
              if (id) router.push(`/dashboard/tenants/${id}`);
            }}
          />
        )}
      </FormSheet>
    </>
  );
}

export function TenantActions({ tenant }: { tenant: Tenant }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const remove = async () => {
    setDeleting(true);
    try {
      await clientApi(`/tenants/${tenant.id}`, { method: "DELETE" });
      toast.success("Tenant deleted");
      router.push("/dashboard/tenants");
      router.refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Couldn't delete the tenant");
      setDeleting(false);
    }
  };

  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)}>
        <Pencil aria-hidden /> Edit
      </Button>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="ghost" loading={deleting} className="text-destructive hover:text-destructive">
            <Trash2 aria-hidden /> Delete
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {tenant.name}?</AlertDialogTitle>
            <AlertDialogDescription>
              {tenant.status === "occupied" ? "This tenant has an active booking. End the booking first, then delete the tenant." : "The tenant record is removed. This can't be undone."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep tenant</AlertDialogCancel>
            <AlertDialogAction onClick={remove} disabled={tenant.status === "occupied"}>
              Delete tenant
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <FormSheet open={open} onOpenChange={setOpen} title="Edit tenant">
        {open && <TenantForm tenant={tenant} onDone={() => setOpen(false)} />}
      </FormSheet>
    </>
  );
}
