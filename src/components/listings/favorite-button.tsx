"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Heart } from "lucide-react";
import { toast } from "sonner";
import { clientApi } from "@/lib/client-api";
import { cn } from "@/lib/utils";

/**
 * Heart toggle for a listing. Signed-out visitors are sent to sign in and come
 * straight back to the page they were on.
 */
export function FavoriteButton({ listingId, initial = false, signedIn, className }: { listingId: number; initial?: boolean; signedIn: boolean; className?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const [saved, setSaved] = useState(initial);
  const [pending, start] = useTransition();

  const toggle = () => {
    if (!signedIn) {
      router.push(`/login?next=${encodeURIComponent(pathname)}`);
      return;
    }
    const next = !saved;
    setSaved(next);
    start(async () => {
      try {
        const res = await clientApi<{ is_favorite: boolean }>(`/favorites/toggle/${listingId}`, { method: "POST" });
        setSaved(res.is_favorite);
        toast.success(res.is_favorite ? "Saved to your shortlist" : "Removed from your shortlist");
      } catch (e) {
        setSaved(!next);
        toast.error(e instanceof Error ? e.message : "Couldn't update your shortlist");
      }
    });
  };

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle();
      }}
      disabled={pending}
      aria-pressed={saved}
      aria-label={saved ? "Remove from saved" : "Save this flat"}
      className={cn(
        "grid size-9 place-items-center rounded-full border-[1.5px] border-ink bg-card shadow-[2px_2px_0_0_var(--ink)] transition hover:scale-105 active:scale-95",
        className,
      )}
    >
      <Heart className={cn("size-[18px] transition", saved ? "fill-primary text-primary" : "text-ink")} aria-hidden />
    </button>
  );
}
