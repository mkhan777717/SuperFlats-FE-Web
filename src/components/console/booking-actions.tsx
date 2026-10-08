"use client";

import { useState } from "react";
import { Pencil, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Booking } from "@/lib/types";
import { BookingForm } from "./booking-form";
import { FormSheet } from "./form-bits";
import { RowAction } from "./row-action";

export function AddBookingButton() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <Plus aria-hidden /> New booking
      </Button>
      <FormSheet open={open} onOpenChange={setOpen} title="New booking" description="Rent a flat to a tenant.">
        {open && <BookingForm onDone={() => setOpen(false)} />}
      </FormSheet>
    </>
  );
}

export function BookingRowActions({ booking }: { booking: Booking }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex justify-end gap-1">
      <Button size="sm" variant="ghost" onClick={() => setOpen(true)} className="normal-case tracking-normal">
        <Pencil aria-hidden /> Edit
      </Button>
      {booking.status === "active" && (
        <RowAction
          path={`/bookings/${booking.id}`}
          body={{ status: "ended" }}
          label="End"
          success="Booking ended. The flat and tenant are available again."
          variant="ghost"
          confirm={{
            title: "End this booking?",
            description: "The flat becomes available and the tenant is freed for a new booking. No more rent bills will be created.",
            action: "End booking",
          }}
        />
      )}
      <RowAction
        path={`/bookings/${booking.id}`}
        method="DELETE"
        label="Delete"
        success="Booking deleted"
        variant="ghost"
        confirm={{ title: "Delete this booking?", description: "The record is removed and the flat and tenant become available. Use “End” instead to keep the history.", action: "Delete booking" }}
      />
      <FormSheet open={open} onOpenChange={setOpen} title="Edit booking">
        {open && <BookingForm booking={booking} onDone={() => setOpen(false)} />}
      </FormSheet>
    </div>
  );
}
