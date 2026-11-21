import { clientApi } from "@/lib/client-api";
import type { Video, VideoOwner } from "@/lib/types";

// Mirrors the backend limits (superflats-backend utils/videoProcessor.js).
// The backend compresses every upload to a 720p MP4, so large phone videos are fine.
export const MAX_VIDEO_MB = 500;
export const MAX_VIDEOS = 5;
export const MAX_VIDEO_MINUTES = 3;

const VIDEO_EXTENSIONS = /\.(mp4|m4v|mov|webm|mkv|avi|3gp|3g2|wmv|flv|mpeg|mpg|ts|mts|m2ts|hevc)$/i;

/** Base path of an owner's videos, e.g. `/properties/12/videos`. */
export const videosPath = (owner: VideoOwner) => `/${owner.type === "Property" ? "properties" : "flats"}/${owner.id}/videos`;

export function formatFileSize(bytes: number) {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * First-pass check in the browser. Any format is accepted; the backend probes the file and converts it.
 * Some files (e.g. .mkv on Windows) arrive with an empty MIME type, so the extension is checked too.
 * Returns an error message, or null when the file is fine.
 */
export function checkVideoFile(file: File): string | null {
  const looksLikeVideo = file.type.startsWith("video/") || (!file.type && VIDEO_EXTENSIONS.test(file.name));
  if (!looksLikeVideo) return `${file.name} is not a video.`;
  if (file.size > MAX_VIDEO_MB * 1024 * 1024) return `${file.name} is larger than ${MAX_VIDEO_MB} MB.`;
  return null;
}

/**
 * Uploads one video with progress. Uses XHR because fetch can't report upload progress.
 * Resolves with the new video (status "processing"); the backend compresses it in the background.
 */
export async function uploadVideo(owner: VideoOwner, file: File, onProgress?: (percent: number) => void): Promise<Video> {
  // Large bodies are streamed by /api/sf without a retry, so make sure the session token is fresh first.
  await clientApi("/user/me");

  const body = new FormData();
  body.append("video", file);

  return new Promise<Video>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", `/api/sf${videosPath(owner)}`);
    xhr.setRequestHeader("Accept", "application/json");
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable && onProgress) onProgress(Math.round((e.loaded / e.total) * 100));
    };
    xhr.onerror = () => reject(new Error(`Couldn't upload ${file.name}. Check your connection and try again.`));
    xhr.onload = () => {
      let res: { video?: Video; message?: string; error?: string } = {};
      try {
        res = JSON.parse(xhr.responseText);
      } catch {
        // Non-JSON error page (e.g. a proxy's 413), handled below.
      }
      if (xhr.status === 401) {
        // A full reload (not router.push) drops any in-memory state from the expired session.
        // eslint-disable-next-line @next/next/no-location-assign-relative-destination
        window.location.assign(`/login?next=${encodeURIComponent(window.location.pathname)}&expired=1`);
        return reject(new Error("Your session expired. Please sign in again."));
      }
      if (xhr.status === 413) return reject(new Error(`${file.name} is too large to upload.`));
      if (xhr.status < 200 || xhr.status >= 300 || !res.video) {
        return reject(new Error(res.message ?? res.error ?? `Couldn't upload ${file.name}.`));
      }
      resolve(res.video);
    };
    xhr.send(body);
  });
}

/**
 * Uploads videos picked before the property/flat existed, one at a time.
 * Calls `onProgress` with a human-readable status. Returns how many uploads were accepted.
 */
export async function uploadQueuedVideos(owner: VideoOwner, files: File[], onProgress?: (status: string) => void) {
  let ok = 0;
  for (const [i, file] of files.entries()) {
    try {
      await uploadVideo(owner, file, (p) => onProgress?.(`Uploading video ${i + 1} of ${files.length}… ${p}%`));
      ok++;
    } catch {
      // Reported by the caller as "x of y uploaded".
    }
  }
  return ok;
}
