"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { ImagePlus, Star, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { clientApi } from "@/lib/client-api";
import type { Photo } from "@/lib/types";

const MAX_MB = 15;

/**
 * Upload and remove photos. The backend stores one file per request (field "photo"),
 * allows up to `max` photos and makes the first one the cover.
 */
export function PhotoManager({
  photos,
  uploadPath,
  deleteBase,
  max = 10,
  canDelete = true,
}: {
  photos: Photo[];
  /** e.g. `/properties/upload-photo/12` */
  uploadPath: string;
  /** Photo id is appended, e.g. `/properties/12/photos` → `/properties/12/photos/34`. A plain string so server pages can pass it. */
  deleteBase: string;
  max?: number;
  canDelete?: boolean;
}) {
  const router = useRouter();
  const input = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<number | null>(null);
  const sorted = [...photos].sort((a, b) => Number(b.is_primary) - Number(a.is_primary));
  const left = max - photos.length;

  const upload = async (files: FileList) => {
    const list = [...files].slice(0, Math.max(0, left));
    if (files.length > list.length) toast.warning(`Only ${left} more photo${left === 1 ? "" : "s"} allowed.`);
    let done = 0;
    for (const [i, file] of list.entries()) {
      if (!file.type.startsWith("image/")) {
        toast.error(`${file.name} is not an image.`);
        continue;
      }
      if (file.size > MAX_MB * 1024 * 1024) {
        toast.error(`${file.name} is larger than ${MAX_MB} MB.`);
        continue;
      }
      setUploading(`Uploading ${i + 1} of ${list.length}…`);
      try {
        const body = new FormData();
        body.append("photo", file);
        await clientApi(uploadPath, { method: "POST", body });
        done++;
      } catch (e) {
        toast.error(e instanceof Error ? e.message : `Couldn't upload ${file.name}`);
      }
    }
    setUploading(null);
    if (input.current) input.current.value = "";
    if (done) {
      toast.success(`${done} photo${done === 1 ? "" : "s"} uploaded`);
      router.refresh();
    }
  };

  const remove = async (id: number) => {
    setDeleting(id);
    try {
      await clientApi(`${deleteBase}/${id}`, { method: "DELETE" });
      toast.success("Photo removed");
      router.refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Couldn't remove the photo");
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="grid gap-4">
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {sorted.map((p) => (
          <li key={p.id} className="group relative aspect-[4/3] overflow-hidden rounded-sm border bg-muted">
            <Image src={p.photo_url} alt={p.name ?? ""} fill sizes="200px" className="object-cover" />
            {p.is_primary && (
              <span className="absolute top-2 left-2 inline-flex items-center gap-1 rounded-sm bg-primary px-1.5 py-0.5 text-[10px] font-semibold text-primary-foreground uppercase">
                <Star className="size-3" aria-hidden /> Cover
              </span>
            )}
            {canDelete && (
              <button
                type="button"
                onClick={() => remove(p.id)}
                disabled={deleting === p.id}
                className="absolute top-2 right-2 grid size-8 place-items-center rounded-sm bg-white/90 text-destructive opacity-100 shadow-soft transition hover:bg-white disabled:opacity-50 sm:opacity-0 sm:group-hover:opacity-100 sm:focus-visible:opacity-100"
                aria-label="Remove photo"
              >
                <Trash2 className="size-4" />
              </button>
            )}
          </li>
        ))}
        {left > 0 && (
          <li>
            <button
              type="button"
              onClick={() => input.current?.click()}
              disabled={!!uploading}
              className="flex aspect-[4/3] w-full flex-col items-center justify-center gap-2 rounded-sm border-2 border-dashed text-sm text-muted-foreground transition hover:border-gold hover:text-foreground disabled:opacity-60"
            >
              <ImagePlus className="size-6" aria-hidden />
              {uploading ?? "Add photos"}
            </button>
          </li>
        )}
      </ul>
      <input ref={input} type="file" accept="image/*" multiple className="sr-only" onChange={(e) => e.target.files?.length && upload(e.target.files)} />
      <p className="text-xs text-muted-foreground">
        {photos.length} of {max} photos. The first photo is used as the cover. JPG or PNG up to {MAX_MB} MB each.
      </p>
      {!photos.length && (
        <Button type="button" variant="outline" className="w-fit" onClick={() => input.current?.click()} loading={!!uploading}>
          <ImagePlus aria-hidden /> Upload photos
        </Button>
      )}
    </div>
  );
}
