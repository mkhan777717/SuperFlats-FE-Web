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
import type { Flat, OwnerProperty } from "@/lib/types";
import { FlatForm } from "./flat-form";
import { FormSheet } from "./form-bits";
import { PropertyForm } from "./property-form";

export function AddPropertyButton({ canUploadVideo = true }: { canUploadVideo?: boolean }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <Plus aria-hidden /> Add property
      </Button>
      <FormSheet open={open} onOpenChange={setOpen} title="Add property" description="Building details, address and how many units it has." wide>
        <PropertyForm onDone={() => setOpen(false)} canUploadVideo={canUploadVideo} />
      </FormSheet>
    </>
  );
}

/** Edit and delete buttons on the property page. Only admins may change or delete a property. */
export function PropertyActions({ property }: { property: OwnerProperty }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const remove = async () => {
    setDeleting(true);
    try {
      await clientApi(`/properties/${property.id}`, { method: "DELETE" });
      toast.success("Property deleted");
      router.push("/dashboard/properties");
      router.refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Couldn't delete the property");
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
            <AlertDialogTitle>Delete {property.name}?</AlertDialogTitle>
            <AlertDialogDescription>This removes the property and its photos. This can&apos;t be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep property</AlertDialogCancel>
            <AlertDialogAction onClick={remove}>Delete property</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <FormSheet open={open} onOpenChange={setOpen} title="Edit property" wide>
        <PropertyForm property={property} onDone={() => setOpen(false)} canUploadVideo />
      </FormSheet>
    </>
  );
}

export function AddFlatButton({ property, isAdmin, canUploadVideo = true }: { property: OwnerProperty; isAdmin: boolean; canUploadVideo?: boolean }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <Plus aria-hidden /> Add flat
      </Button>
      <FormSheet open={open} onOpenChange={setOpen} title="Add flat" description={property.name}>
        <FlatForm property={property} onDone={() => setOpen(false)} canDeletePhotos={isAdmin} canUploadVideo={canUploadVideo} />
      </FormSheet>
    </>
  );
}

export function FlatRowActions({ property, flat, isAdmin, canUploadVideo = true }: { property: OwnerProperty; flat: Flat; isAdmin: boolean; canUploadVideo?: boolean }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const remove = async () => {
    setDeleting(true);
    try {
      await clientApi(`/flats/${flat.id}`, { method: "DELETE" });
      toast.success(`Flat ${flat.unit_number} deleted`);
      router.refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Couldn't delete the flat");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="flex justify-end gap-1">
      <Button size="sm" variant="ghost" onClick={() => setOpen(true)} className="normal-case tracking-normal">
        <Pencil aria-hidden /> Edit
      </Button>
      {isAdmin && (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button size="sm" variant="ghost" loading={deleting} className="text-destructive normal-case tracking-normal hover:text-destructive" aria-label={`Delete flat ${flat.unit_number}`}>
              <Trash2 aria-hidden />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete flat {flat.unit_number}?</AlertDialogTitle>
              <AlertDialogDescription>Its photos are removed and the unit slot is returned to the property.</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Keep flat</AlertDialogCancel>
              <AlertDialogAction onClick={remove}>Delete flat</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
      <FormSheet open={open} onOpenChange={setOpen} title={`Flat ${flat.unit_number}`} description={property.name}>
        <FlatForm property={property} flat={flat} onDone={() => setOpen(false)} canDeletePhotos={isAdmin} canUploadVideo={canUploadVideo} />
      </FormSheet>
    </div>
  );
}
