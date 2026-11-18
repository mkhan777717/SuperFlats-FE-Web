"use client";

import { useEffect, useMemo, useRef } from "react";
import { Video as VideoIcon, X } from "lucide-react";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";

const MAX_MB = 100;

function formatFileSize(bytes: number) {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * Pick videos before the record exists (Owner / Admin only).
 * Files stay in parent state with local previews; once the backend video endpoint is ready,
 * pass them to `uploadQueuedVideos` after creating the record.
 */
export function VideoPicker({ files, onChange, max = 3 }: { files: File[]; onChange: (files: File[]) => void; max?: number }) {
  const input = useRef<HTMLInputElement>(null);
  const previews = useMemo(() => files.map((f) => ({ file: f, url: URL.createObjectURL(f) })), [files]);
  useEffect(() => () => previews.forEach((p) => URL.revokeObjectURL(p.url)), [previews]);

  const add = (list: FileList) => {
    const picked: File[] = [];
    for (const f of list) {
      if (!f.type.startsWith("video/")) toast.error(`${f.name} is not a video.`);
      else if (f.size > MAX_MB * 1024 * 1024) toast.error(`${f.name} is larger than ${MAX_MB} MB.`);
      else picked.push(f);
    }
    const room = max - files.length;
    if (picked.length > room) toast.warning(`Only ${max} video${max === 1 ? "" : "s"} allowed.`);
    onChange([...files, ...picked.slice(0, Math.max(0, room))]);
    if (input.current) input.current.value = "";
  };

  return (
    <div className="grid gap-2">
      <Label>Videos</Label>
      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {previews.map(({ file, url }, i) => (
          <li key={url} className="overflow-hidden rounded-sm border bg-muted">
            <div className="relative aspect-video bg-black">
              <video src={url} controls preload="metadata" className="size-full object-cover" />
              <button
                type="button"
                onClick={() => onChange(files.filter((_, j) => j !== i))}
                className="absolute top-1.5 right-1.5 grid size-6 place-items-center rounded-sm bg-white/90 text-destructive shadow-soft hover:bg-white"
                aria-label={`Remove ${file.name}`}
              >
                <X className="size-3.5" />
              </button>
            </div>
            <div className="flex items-center justify-between gap-2 bg-card px-2.5 py-1.5 text-xs">
              <span className="truncate font-medium text-foreground">{file.name}</span>
              <span className="shrink-0 text-muted-foreground">{formatFileSize(file.size)}</span>
            </div>
          </li>
        ))}
        {files.length < max && (
          <li>
            <button
              type="button"
              onClick={() => input.current?.click()}
              className="flex aspect-video w-full flex-col items-center justify-center gap-1.5 rounded-sm border-2 border-dashed text-xs text-muted-foreground transition hover:border-gold hover:text-foreground"
            >
              <VideoIcon className="size-5" aria-hidden /> Add videos
            </button>
          </li>
        )}
      </ul>
      <input
        ref={input}
        type="file"
        accept="video/mp4,video/webm,video/quicktime,video/*"
        multiple
        className="sr-only"
        onChange={(e) => e.target.files?.length && add(e.target.files)}
      />
      <p className="text-xs text-muted-foreground">
        Up to {max} videos (MP4, WebM or MOV, up to {MAX_MB} MB each).
      </p>
    </div>
  );
}

/** Ready-to-wire helper once the backend accepts one `"video"` file per request. */
export async function uploadQueuedVideos(files: File[], upload: (body: FormData) => Promise<unknown>) {
  let ok = 0;
  for (const f of files) {
    const body = new FormData();
    body.append("video", f);
    try {
      await upload(body);
      ok++;
    } catch {
      // Reported by the caller as "x of y uploaded".
    }
  }
  return ok;
}
