"use client";

import { useEffect, useMemo, useRef } from "react";
import { Video as VideoIcon, X } from "lucide-react";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { MAX_VIDEO_MB, MAX_VIDEO_MINUTES, MAX_VIDEOS, checkVideoFile, formatFileSize } from "@/lib/videos";

/**
 * Pick videos before the record exists (Owner, Admin, and Agent).
 * Files stay in parent state with local previews; after the property/flat is created,
 * the form uploads them with `uploadQueuedVideos` from `@/lib/videos`.
 */
export function VideoPicker({ files, onChange }: { files: File[]; onChange: (files: File[]) => void }) {
  const input = useRef<HTMLInputElement>(null);
  const previews = useMemo(() => files.map((f) => ({ file: f, url: URL.createObjectURL(f) })), [files]);
  useEffect(() => () => previews.forEach((p) => URL.revokeObjectURL(p.url)), [previews]);
  const left = MAX_VIDEOS - files.length;

  const add = (list: FileList) => {
    const picked: File[] = [];
    for (const f of list) {
      const error = checkVideoFile(f);
      if (error) toast.error(error);
      else picked.push(f);
    }
    if (picked.length > left) {
      toast.error(`You can add ${left} more video${left === 1 ? "" : "s"} (max ${MAX_VIDEOS}).`);
      picked.splice(left);
    }
    if (picked.length) onChange([...files, ...picked]);
    if (input.current) input.current.value = "";
  };

  return (
    <div className="grid gap-2">
      <Label>Videos</Label>
      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {previews.map(({ file, url }, i) => (
          <li key={url} className="overflow-hidden rounded-sm border bg-muted">
            <div className="relative aspect-video bg-black">
              {/* Some formats (e.g. MKV, HEVC MOV) can't preview in every browser; they still upload and get converted. */}
              <video src={url} controls playsInline preload="metadata" className="size-full object-contain" />
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
        {left > 0 && (
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
        accept="video/*,.mkv,.avi,.3gp,.wmv,.flv,.mts,.m2ts"
        multiple
        className="sr-only"
        onChange={(e) => e.target.files?.length && add(e.target.files)}
      />
      <p className="text-xs text-muted-foreground">
        Any video format, up to {MAX_VIDEO_MB} MB and {MAX_VIDEO_MINUTES} minutes each, max {MAX_VIDEOS}. Uploaded when you save, then compressed to MP4.
      </p>
    </div>
  );
}
