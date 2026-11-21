"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AlertCircle, Loader2, Trash2, Video as VideoIcon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { clientApi } from "@/lib/client-api";
import type { Video, VideoOwner } from "@/lib/types";
import { MAX_VIDEO_MB, MAX_VIDEO_MINUTES, MAX_VIDEOS, checkVideoFile, uploadVideo, videosPath } from "@/lib/videos";

const POLL_MS = 3000;

function formatDuration(sec: number | null) {
  if (sec == null) return null;
  const m = Math.floor(sec / 60);
  const s = String(sec % 60).padStart(2, "0");
  return `${m}:${s}`;
}

/**
 * Upload, watch and remove the videos of a property or flat (Owner, Admin, and Agent).
 * Loads its own list from `GET /properties/:id/videos` or `GET /flats/:id/videos`.
 * The backend compresses each upload to MP4 in the background, so while any video is
 * "processing" the list is refreshed every few seconds until it becomes "ready" or "failed".
 */
export function VideoManager({ owner, canDelete = true }: { owner: VideoOwner; canDelete?: boolean }) {
  const input = useRef<HTMLInputElement>(null);
  const [videos, setVideos] = useState<Video[] | null>(null);
  const [loadError, setLoadError] = useState<string>();
  const [upload, setUpload] = useState<{ label: string; percent: number } | null>(null);
  const [deleting, setDeleting] = useState<number | null>(null);
  const { type, id } = owner;

  // Bumped after an upload/delete or on "Retry" to fetch the list again.
  const [refreshKey, setRefreshKey] = useState(0);
  const load = useCallback(() => setRefreshKey((k) => k + 1), []);
  const processing = videos?.some((v) => v.status === "processing") ?? false;

  // Fetch the list, and keep polling while anything is being compressed.
  useEffect(() => {
    let active = true;
    const fetchList = () =>
      clientApi<{ videos: Video[] }>(videosPath({ type, id })).then(
        (res) => {
          if (!active) return;
          setVideos(res.videos);
          setLoadError(undefined);
        },
        (e) => active && setLoadError(e instanceof Error ? e.message : "Couldn't load videos"),
      );
    fetchList();
    const timer = processing ? setInterval(fetchList, POLL_MS) : undefined;
    return () => {
      active = false;
      clearInterval(timer);
    };
  }, [type, id, processing, refreshKey]);

  // Failed uploads don't count towards the backend's limit.
  const active = videos?.filter((v) => v.status !== "failed").length ?? 0;
  const left = MAX_VIDEOS - active;

  const pick = async (files: FileList) => {
    const valid: File[] = [];
    for (const file of [...files]) {
      const error = checkVideoFile(file);
      if (error) toast.error(error);
      else valid.push(file);
    }
    if (valid.length > left) {
      toast.error(`You can add ${left} more video${left === 1 ? "" : "s"} (max ${MAX_VIDEOS}).`);
      valid.splice(left);
    }
    if (input.current) input.current.value = "";
    if (!valid.length) return;

    let done = 0;
    for (const [i, file] of valid.entries()) {
      const label = valid.length > 1 ? `Uploading ${i + 1} of ${valid.length}: ${file.name}` : `Uploading ${file.name}`;
      setUpload({ label, percent: 0 });
      try {
        await uploadVideo(owner, file, (percent) => setUpload({ label, percent }));
        done++;
      } catch (e) {
        toast.error(e instanceof Error ? e.message : `Couldn't upload ${file.name}`);
      }
    }
    setUpload(null);
    if (done) {
      toast.success(`${done} video${done === 1 ? "" : "s"} uploaded. Compressing now, this can take a minute.`);
      load();
    }
  };

  const remove = async (video: Video) => {
    setDeleting(video.id);
    try {
      await clientApi(`/videos/${video.id}`, { method: "DELETE" });
      toast.success("Video removed");
      setVideos((prev) => prev?.filter((v) => v.id !== video.id) ?? null);
      load(); // picks up the new primary video, if it changed
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Couldn't remove the video");
    } finally {
      setDeleting(null);
    }
  };

  if (videos === null) {
    return loadError ? (
      <div className="flex items-center gap-3 text-sm text-muted-foreground">
        <AlertCircle className="size-4 text-destructive" aria-hidden /> {loadError}
        <Button type="button" variant="outline" size="sm" onClick={load}>
          Retry
        </Button>
      </div>
    ) : (
      <p className="flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="size-4 animate-spin" aria-hidden /> Loading videos…
      </p>
    );
  }

  return (
    <div className="grid gap-4">
      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {videos.map((v) => (
          <li key={v.id} className="group overflow-hidden rounded-sm border bg-muted">
            <div className="relative aspect-video bg-black">
              {v.status === "ready" && v.video_url ? (
                <video src={v.video_url} poster={v.thumbnail_url ?? undefined} controls playsInline preload="metadata" className="size-full object-contain" />
              ) : v.status === "processing" ? (
                <div className="flex size-full flex-col items-center justify-center gap-2 text-white/80" role="status">
                  <Loader2 className="size-6 animate-spin" aria-hidden />
                  <span className="text-xs">Compressing to MP4…</span>
                </div>
              ) : (
                <div className="flex size-full flex-col items-center justify-center gap-2 px-4 text-center text-white/80" role="alert" title={v.error_message ?? undefined}>
                  <AlertCircle className="size-6 text-red-400" aria-hidden />
                  <span className="text-xs">Processing failed. Remove it and upload again.</span>
                </div>
              )}
              {v.is_primary && v.status === "ready" && (
                <span className="absolute top-2 left-2 inline-flex items-center rounded-sm bg-primary px-1.5 py-0.5 text-[10px] font-semibold text-primary-foreground uppercase">
                  Main
                </span>
              )}
              {(canDelete || v.status === "failed") && (
                <button
                  type="button"
                  onClick={() => remove(v)}
                  disabled={deleting === v.id}
                  className="absolute top-2 right-2 grid size-8 place-items-center rounded-sm bg-white/90 text-destructive opacity-100 shadow-soft transition hover:bg-white disabled:opacity-50 sm:opacity-0 sm:group-hover:opacity-100 sm:focus-visible:opacity-100"
                  aria-label={`Remove ${v.title ?? v.original_filename ?? "video"}`}
                >
                  {deleting === v.id ? <Loader2 className="size-4 animate-spin" /> : <Trash2 className="size-4" />}
                </button>
              )}
            </div>
            <div className="flex items-center justify-between gap-2 bg-card px-3 py-1.5 text-xs">
              <span className="truncate font-medium text-foreground">{v.title ?? v.original_filename ?? "Video"}</span>
              {formatDuration(v.duration_sec) && <span className="shrink-0 text-muted-foreground">{formatDuration(v.duration_sec)}</span>}
            </div>
          </li>
        ))}

        {left > 0 && (
          <li>
            <button
              type="button"
              onClick={() => input.current?.click()}
              disabled={!!upload}
              className="flex aspect-video w-full flex-col items-center justify-center gap-2 rounded-sm border-2 border-dashed px-4 text-sm text-muted-foreground transition hover:border-gold hover:text-foreground disabled:opacity-60"
            >
              {upload ? (
                <>
                  <span className="w-full truncate text-center text-xs">{upload.label}</span>
                  <Progress value={upload.percent} className="w-full" aria-label="Upload progress" />
                  <span className="text-xs">{upload.percent < 100 ? `${upload.percent}%` : "Finishing upload…"}</span>
                </>
              ) : (
                <>
                  <VideoIcon className="size-6" aria-hidden /> Add videos
                </>
              )}
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
        onChange={(e) => e.target.files?.length && pick(e.target.files)}
      />

      <p className="text-xs text-muted-foreground">
        Any video format, up to {MAX_VIDEO_MB} MB and {MAX_VIDEO_MINUTES} minutes each, max {MAX_VIDEOS} videos. Videos are compressed to MP4 after upload.
      </p>
    </div>
  );
}
