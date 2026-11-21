import { toast } from "sonner";
import type { VideoOwner } from "@/lib/types";
import { uploadQueuedVideos } from "@/lib/videos";

/**
 * Uploads videos picked in a create form, showing live progress in one toast.
 * `retryHint` finishes the partial-failure message, e.g. "edit the flat".
 */
export async function uploadVideosWithToast(owner: VideoOwner, files: File[], retryHint: string) {
  const id = toast.loading(`Uploading video 1 of ${files.length}…`);
  const ok = await uploadQueuedVideos(owner, files, (status) => toast.loading(status, { id }));
  const s = ok === 1 ? "" : "s";
  if (ok === files.length) toast.success(`${ok} video${s} uploaded. Compressing now, they'll appear in a minute.`, { id });
  else if (ok > 0) toast.warning(`${ok} of ${files.length} videos uploaded; ${retryHint} to retry the rest.`, { id });
  else toast.error(`Videos couldn't be uploaded; ${retryHint} to try again.`, { id });
}
