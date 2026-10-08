"use client";

import { useState } from "react";
import { Pencil, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Listing } from "@/lib/types";
import { FormSheet } from "./form-bits";
import { ListingForm } from "./listing-form";
import { RowAction } from "./row-action";

export function AddListingButton() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <Plus aria-hidden /> Add listing
      </Button>
      <FormSheet open={open} onOpenChange={setOpen} title="Add listing" description="Advertise a flat to renters.">
        {open && <ListingForm onDone={() => setOpen(false)} />}
      </FormSheet>
    </>
  );
}

/** Edit and delete a listing. The backend only lets admins change or remove listings. */
export function ListingRowActions({ listing }: { listing: Listing }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button size="sm" variant="ghost" onClick={() => setOpen(true)} className="normal-case tracking-normal">
        <Pencil aria-hidden /> Edit
      </Button>
      <RowAction
        path={`/listings/${listing.id}`}
        method="DELETE"
        label="Delete"
        success="Listing deleted"
        variant="ghost"
        confirm={{ title: "Delete this listing?", description: "Renters will no longer see it, and saved copies disappear from their shortlists. The flat itself is kept.", action: "Delete listing" }}
      />
      <FormSheet open={open} onOpenChange={setOpen} title="Edit listing" description={`${listing.flat?.property?.name ?? ""} · Unit ${listing.flat?.unit_number ?? ""}`}>
        {open && <ListingForm listing={listing} onDone={() => setOpen(false)} />}
      </FormSheet>
    </>
  );
}
