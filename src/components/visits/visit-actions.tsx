"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { MessageSquare, X } from "lucide-react";
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
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { clientApi } from "@/lib/client-api";
import type { AppointmentStatus } from "@/lib/types";

/** Cancel an upcoming visit, or leave feedback on a completed one. */
export function VisitActions({ id, status, feedback }: { id: number; status: AppointmentStatus; feedback?: string | null }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [open, setOpen] = useState(false);
  const [text, setText] = useState(feedback ?? "");

  const cancel = async () => {
    setBusy(true);
    try {
      await clientApi(`/appointments/${id}/cancel`, { method: "PATCH", body: JSON.stringify({ status: "cancelled" }) });
      toast.success("Visit cancelled");
      router.refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Couldn't cancel the visit");
    } finally {
      setBusy(false);
    }
  };

  const saveFeedback = async () => {
    if (!text.trim()) return;
    setBusy(true);
    try {
      await clientApi(`/appointments/${id}/feedback`, { method: "PATCH", body: JSON.stringify({ feedback: text.trim() }) });
      toast.success("Thanks for your feedback");
      setOpen(false);
      router.refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Couldn't save your feedback");
    } finally {
      setBusy(false);
    }
  };

  if (status === "pending" || status === "confirmed") {
    return (
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="outline" size="sm" loading={busy}>
            <X aria-hidden /> Cancel visit
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel this visit?</AlertDialogTitle>
            <AlertDialogDescription>The owner will see that you cancelled. You can request a new time from the property page.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep visit</AlertDialogCancel>
            <AlertDialogAction onClick={cancel}>Cancel visit</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  if (status === "completed") {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            <MessageSquare aria-hidden /> {feedback ? "Edit feedback" : "Add feedback"}
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>How was your visit?</DialogTitle>
          </DialogHeader>
          <Textarea value={text} onChange={(e) => setText(e.target.value)} maxLength={2000} placeholder="Share what you liked or what could be better" rows={5} />
          <DialogFooter>
            <Button onClick={saveFeedback} loading={busy} disabled={!text.trim()}>
              Save feedback
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return null;
}
