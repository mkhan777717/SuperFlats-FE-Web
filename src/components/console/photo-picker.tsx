"use client";

/* eslint-disable @next/next/no-img-element -- local blob previews can't go through next/image */
import { useEffect, useMemo, useRef } from "react";
import { ImagePlus, X } from "lucide-react";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";

const MAX_MB = 15;

/**
 * Pick photos before the record exists. Files are kept in the parent's state and
 * uploaded right after the record is created (see `uploadQueued`).
 */
export function PhotoPicker({ files, onChange, max = 10 }: { files: File[]; onChange: (files: File[]) => void; max?: number }) {
  const input = useRef<HTMLInputElement>(null);
  const previews = useMemo(() => files.map((f) => URL.createObjectURL(f)), [files]);
  useEffect(() => () => previews.forEach((u) => URL.revokeObjectURL(u)), [previews]);

  const add = (list: FileList) => {
    const picked: File[] = [];
    for (const f of list) {
      if (!f.type.startsWith("image/")) toast.error(`${f.name} is not an image.`);
      else if (f.size > MAX_MB * 1024 * 1024) toast.error(`${f.name} is larger than ${MAX_MB} MB.`);
      else picked.push(f);
    }
    const room = max - files.length;
    if (picked.length > room) toast.warning(`Only ${max} photos allowed.`);
    onChange([...files, ...picked.slice(0, Math.max(0, room))]);
    if (input.current) input.current.value = "";
  };

  return (
    <div className="grid gap-2">
      <Label>Photos</Label>
      <ul className="grid grid-cols-3 gap-2 sm:grid-cols-4">
        {previews.map((src, i) => (
          <li key={src} className="relative aspect-[4/3] overflow-hidden rounded-sm border bg-muted">
            <img src={src} alt="" className="size-full object-cover" />
            {i === 0 && <span className="absolute top-1 left-1 rounded-sm bg-primary px-1.5 py-0.5 text-[10px] font-semibold text-primary-foreground uppercase">Cover</span>}
            <button
              type="button"
              onClick={() => onChange(files.filter((_, j) => j !== i))}
              className="absolute top-1 right-1 grid size-6 place-items-center rounded-sm bg-white/90 text-destructive shadow-soft"
              aria-label="Remove photo"
            >
              <X className="size-3.5" />
            </button>
          </li>
        ))}
        {files.length < max && (
          <li>
            <button
              type="button"
              onClick={() => input.current?.click()}
              className="flex aspect-[4/3] w-full flex-col items-center justify-center gap-1 rounded-sm border-2 border-dashed text-xs text-muted-foreground transition hover:border-gold hover:text-foreground"
            >
              <ImagePlus className="size-5" aria-hidden /> Add photos
            </button>
          </li>
        )}
      </ul>
      <input ref={input} type="file" accept="image/*" multiple className="sr-only" onChange={(e) => e.target.files?.length && add(e.target.files)} />
      <p className="text-xs text-muted-foreground">Up to {max} photos, uploaded when you save. The first one is the cover.</p>
    </div>
  );
}

/** Uploads picked files one by one (the backend accepts one "photo" per request). Returns how many succeeded. */
export async function uploadQueued(files: File[], upload: (body: FormData) => Promise<unknown>) {
  let ok = 0;
  for (const f of files) {
    const body = new FormData();
    body.append("photo", f);
    try {
      await upload(body);
      ok++;
    } catch {
      // Reported by the caller as "x of y uploaded".
    }
  }
  return ok;
}
