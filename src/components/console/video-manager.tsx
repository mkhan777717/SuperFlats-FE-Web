"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Trash2, Video as VideoIcon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { clientApi } from "@/lib/client-api";
import type { Video } from "@/lib/types";

const MAX_MB = 5;

type LocalVideo = {
  id: string;
  url: string;
  name: string;
  size: number;
};

function formatFileSize(bytes: number) {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * Upload and remove property/flat videos (Owner / Admin only — hidden from agents).
 * When `uploadPath` is omitted, selected videos are kept as playable local previews
 * until the backend video endpoints are wired up.
 */
export function VideoManager({
  videos = [],
  uploadPath,
  deleteBase,
  canDelete = true,
}: {
  videos?: Video[];
  /** Backend upload endpoint once ready, e.g. `/properties/upload-video/12` */
  uploadPath?: string;
  /** Backend delete base once ready, e.g. `/properties/12/videos` */
  deleteBase?: string;
  canDelete?: boolean;
}) {
  const router = useRouter();
  const input = useRef<HTMLInputElement>(null);
  const urlsRef = useRef<Set<string>>(new Set());
  const [localVideos, setLocalVideos] = useState<LocalVideo[]>([]);
  const [uploading, setUploading] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | number | null>(null);

  useEffect(() => {
    const urls = urlsRef.current;
    return () => {
      urls.forEach((u) => URL.revokeObjectURL(u));
      urls.clear();
    };
  }, []);

  const total = videos.length + localVideos.length;

  const upload = async (files: FileList) => {
    const valid: File[] = [];
    for (const file of [...files]) {
      if (!file.type.startsWith("video/")) {
        toast.error(`${file.name} is not a video.`);
        continue;
      }
      if (file.size > MAX_MB * 1024 * 1024) {
        toast.error(`${file.name} is larger than ${MAX_MB} MB.`);
        continue;
      }
      valid.push(file);
    }

    if (!valid.length) {
      if (input.current) input.current.value = "";
      return;
    }

    // UI-only preview mode until backend video endpoints are connected.
    if (!uploadPath) {
      const added: LocalVideo[] = valid.map((file) => {
        const url = URL.createObjectURL(file);
        urlsRef.current.add(url);
        return {
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          url,
          name: file.name,
          size: file.size,
        };
      });
      setLocalVideos((prev) => [...prev, ...added]);
      if (input.current) input.current.value = "";
      toast.success(`${added.length} video${added.length === 1 ? "" : "s"} added (local preview — backend upload pending)`);
      return;
    }

    let done = 0;
    for (const [i, file] of valid.entries()) {
      setUploading(`Uploading ${i + 1} of ${valid.length}…`);
      try {
        const body = new FormData();
        body.append("video", file);
        await clientApi(uploadPath, { method: "POST", body });
        done++;
      } catch (e) {
        toast.error(e instanceof Error ? e.message : `Couldn't upload ${file.name}`);
      }
    }
    setUploading(null);
    if (input.current) input.current.value = "";
    if (done) {
      toast.success(`${done} video${done === 1 ? "" : "s"} uploaded`);
      router.refresh();
    }
  };

  const removeRemote = async (id: number) => {
    if (!deleteBase) return;
    setDeleting(id);
    try {
      await clientApi(`${deleteBase}/${id}`, { method: "DELETE" });
      toast.success("Video removed");
      router.refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Couldn't remove the video");
    } finally {
      setDeleting(null);
    }
  };

  const removeLocal = (id: string) => {
    setLocalVideos((prev) => {
      const target = prev.find((v) => v.id === id);
      if (target) {
        URL.revokeObjectURL(target.url);
        urlsRef.current.delete(target.url);
      }
      return prev.filter((v) => v.id !== id);
    });
    toast.success("Video removed");
  };

  return (
    <div className="grid gap-4">
      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {videos.map((v) => (
          <li key={`remote-${v.id}`} className="group overflow-hidden rounded-sm border bg-muted">
            <div className="relative aspect-video bg-black">
              <video src={v.video_url} controls preload="metadata" className="size-full object-cover" />
              {canDelete && deleteBase && (
                <button
                  type="button"
                  onClick={() => removeRemote(v.id)}
                  disabled={deleting === v.id}
                  className="absolute top-2 right-2 grid size-8 place-items-center rounded-sm bg-white/90 text-destructive opacity-100 shadow-soft transition hover:bg-white disabled:opacity-50 sm:opacity-0 sm:group-hover:opacity-100 sm:focus-visible:opacity-100"
                  aria-label="Remove video"
                >
                  <Trash2 className="size-4" />
                </button>
              )}
            </div>
            {v.name && (
              <div className="truncate bg-card px-3 py-1.5 text-xs font-medium text-foreground">
                {v.name}
              </div>
            )}
          </li>
        ))}

        {localVideos.map((v) => (
          <li key={`local-${v.id}`} className="group overflow-hidden rounded-sm border bg-muted">
            <div className="relative aspect-video bg-black">
              <video src={v.url} controls preload="metadata" className="size-full object-cover" />
              <span className="absolute top-2 left-2 inline-flex items-center rounded-sm bg-primary px-1.5 py-0.5 text-[10px] font-semibold text-primary-foreground uppercase">
                Preview
              </span>
              {canDelete && (
                <button
                  type="button"
                  onClick={() => removeLocal(v.id)}
                  className="absolute top-2 right-2 grid size-8 place-items-center rounded-sm bg-white/90 text-destructive opacity-100 shadow-soft transition hover:bg-white sm:opacity-0 sm:group-hover:opacity-100 sm:focus-visible:opacity-100"
                  aria-label={`Remove ${v.name}`}
                >
                  <Trash2 className="size-4" />
                </button>
              )}
            </div>
            <div className="flex items-center justify-between gap-2 bg-card px-3 py-1.5 text-xs">
              <span className="truncate font-medium text-foreground">{v.name}</span>
              <span className="shrink-0 text-muted-foreground">{formatFileSize(v.size)}</span>
            </div>
          </li>
        ))}

        <li>
          <button
            type="button"
            onClick={() => input.current?.click()}
            disabled={!!uploading}
            className="flex aspect-video w-full flex-col items-center justify-center gap-2 rounded-sm border-2 border-dashed text-sm text-muted-foreground transition hover:border-gold hover:text-foreground disabled:opacity-60"
          >
            <VideoIcon className="size-6" aria-hidden />
            {uploading ?? "Add videos"}
          </button>
        </li>
      </ul>

      <input
        ref={input}
        type="file"
        accept="video/mp4,video/webm,video/quicktime,video/*"
        multiple
        className="sr-only"
        onChange={(e) => e.target.files?.length && upload(e.target.files)}
      />

      <p className="text-xs text-muted-foreground">MP4, WebM or MOV. Max limit {MAX_MB} MB.</p>

      {total === 0 && (
        <Button type="button" variant="outline" className="w-fit" onClick={() => input.current?.click()} loading={!!uploading}>
          <VideoIcon aria-hidden /> Upload videos
        </Button>
      )}
    </div>
  );
}
