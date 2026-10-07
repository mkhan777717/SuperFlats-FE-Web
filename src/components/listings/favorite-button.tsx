"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Heart } from "lucide-react";
import { motion } from "motion/react";
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
  // Bumped only when the user saves, so the heart pops on taps, not on page load.
  const [pops, setPops] = useState(0);

  const toggle = () => {
    if (!signedIn) {
      router.push(`/login?next=${encodeURIComponent(pathname)}`);
      return;
    }
    const next = !saved;
    setSaved(next);
    if (next) setPops((n) => n + 1);
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
        "grid size-8 place-items-center rounded-full bg-white text-neutral-900 shadow-soft transition hover:scale-110 active:scale-95",
        className,
      )}
    >
      <motion.span key={pops} initial={pops ? { scale: 0.4 } : false} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 500, damping: 12 }} className="grid">
        <Heart className={cn("size-4 transition-colors", saved ? "fill-red-500 text-red-500" : "text-red-500")} aria-hidden />
      </motion.span>
    </button>
  );
}
