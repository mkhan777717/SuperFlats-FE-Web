"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Expand, ImageOff, X } from "lucide-react";
import type { Photo } from "@/lib/types";
import { cn } from "@/lib/utils";

const arrow = "absolute top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-neutral-900 shadow-lift transition hover:bg-white";

/** Main photo with thumbnails, arrows, keyboard support and a full-screen viewer. */
export function PhotoGallery({ photos, title }: { photos: Photo[]; title: string }) {
  const [index, setIndex] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);
  const count = photos.length;
  const go = useCallback((delta: number) => setIndex((i) => (i + delta + count) % count), [count]);

  useEffect(() => {
    if (!fullscreen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setFullscreen(false);
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [fullscreen, go]);

  if (!count) {
    return (
      <div className="grid aspect-[16/10] place-items-center rounded-sm border bg-muted text-muted-foreground">
        <span className="flex flex-col items-center gap-2 text-sm">
          <ImageOff className="size-8" aria-hidden /> Photos coming soon
        </span>
      </div>
    );
  }

  const current = photos[index]!;

  return (
    <div className="grid gap-3">
      <div className="relative aspect-[16/10] overflow-hidden rounded-sm bg-muted">
        <Image src={current.photo_url} alt={`${title}, photo ${index + 1} of ${count}`} fill priority sizes="(min-width: 1024px) 65vw, 100vw" className="object-cover" />
        {count > 1 && (
          <>
            <button type="button" onClick={() => go(-1)} className={cn(arrow, "left-4")} aria-label="Previous photo">
              <ChevronLeft className="size-5" />
            </button>
            <button type="button" onClick={() => go(1)} className={cn(arrow, "right-4")} aria-label="Next photo">
              <ChevronRight className="size-5" />
            </button>
          </>
        )}
        <button
          type="button"
          onClick={() => setFullscreen(true)}
          className="absolute right-4 bottom-4 flex items-center gap-2 rounded-sm bg-black/60 px-3 py-2 text-sm text-white backdrop-blur hover:bg-black/75"
        >
          <Expand className="size-4" aria-hidden /> {index + 1} / {count}
        </button>
      </div>

      {count > 1 && (
        <div className="scrollbar-none flex gap-3 overflow-x-auto">
          {photos.map((photo, i) => (
            <button
              key={photo.id}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Show photo ${i + 1}`}
              aria-current={i === index}
              className={cn(
                "relative aspect-[4/3] w-24 shrink-0 overflow-hidden rounded-sm ring-2 ring-offset-2 ring-offset-background transition sm:w-28",
                i === index ? "ring-gold" : "opacity-70 ring-transparent hover:opacity-100",
              )}
            >
              <Image src={photo.photo_url} alt="" fill sizes="112px" className="object-cover" />
            </button>
          ))}
        </div>
      )}

      {fullscreen && (
        <div role="dialog" aria-modal="true" aria-label="Photo viewer" className="fixed inset-0 z-50 bg-black/95">
          <Image src={current.photo_url} alt={`${title}, photo ${index + 1} of ${count}`} fill sizes="100vw" className="object-contain" />
          <button
            type="button"
            onClick={() => setFullscreen(false)}
            className="absolute top-4 right-4 grid size-11 place-items-center rounded-full bg-white/15 text-white hover:bg-white/25"
            aria-label="Close photo viewer"
            autoFocus
          >
            <X className="size-5" />
          </button>
          {count > 1 && (
            <>
              <button type="button" onClick={() => go(-1)} className={cn(arrow, "left-4")} aria-label="Previous photo">
                <ChevronLeft className="size-5" />
              </button>
              <button type="button" onClick={() => go(1)} className={cn(arrow, "right-4")} aria-label="Next photo">
                <ChevronRight className="size-5" />
              </button>
            </>
          )}
          <p className="absolute bottom-6 left-1/2 -translate-x-1/2 text-sm text-white/80">
            {index + 1} / {count}
          </p>
        </div>
      )}
    </div>
  );
}
