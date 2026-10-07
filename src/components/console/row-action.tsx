"use client";

import { useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";
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

type Props = {
  /** Backend path, e.g. `/rents/bills/12/pay`. */
  path: string;
  method?: "PATCH" | "PUT" | "DELETE" | "POST";
  body?: unknown;
  label: ReactNode;
  success: string;
  variant?: "outline" | "ghost" | "default" | "destructive";
  /** When set, asks for confirmation first. */
  confirm?: { title: string; description: string; action: string };
};

/** A small table action that calls the backend and refreshes the page. */
export function RowAction({ path, method = "PATCH", body, label, success, variant = "outline", confirm }: Props) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  const run = async () => {
    setBusy(true);
    try {
      await clientApi(path, { method, body: body === undefined ? undefined : JSON.stringify(body) });
      toast.success(success);
      router.refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  };

  const button = (
    <Button size="sm" variant={variant} loading={busy} onClick={confirm ? undefined : run} className="normal-case tracking-normal">
      {label}
    </Button>
  );

  if (!confirm) return button;

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{button}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{confirm.title}</AlertDialogTitle>
          <AlertDialogDescription>{confirm.description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={run}>{confirm.action}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
