"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { ExternalLink, FileUp, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { clientApi } from "@/lib/client-api";
import type { Photo } from "@/lib/types";

const MAX_DOCS = 5;

/** Tenant ID documents (e.g. Aadhaar, PAN). Each upload needs a name; the backend allows five. */
export function TenantDocuments({ tenantId, documents }: { tenantId: number; documents: Pick<Photo, "id" | "name" | "photo_url">[] }) {
  const router = useRouter();
  const file = useRef<HTMLInputElement>(null);
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [deleting, setDeleting] = useState<number | null>(null);
  const full = documents.length >= MAX_DOCS;

  const upload = async () => {
    const f = file.current?.files?.[0];
    if (name.trim().length < 3) return toast.error("Give the document a name (at least 3 characters), e.g. “Aadhaar card”.");
    if (!f) return toast.error("Choose a photo or scan of the document.");
    if (!f.type.startsWith("image/")) return toast.error("Upload the document as an image (JPG or PNG).");
    setBusy(true);
    try {
      const body = new FormData();
      body.append("name", name.trim());
      body.append("photo", f);
      await clientApi(`/tenants/${tenantId}/photo`, { method: "POST", body });
      toast.success("Document uploaded");
      setName("");
      if (file.current) file.current.value = "";
      router.refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Couldn't upload the document");
    } finally {
      setBusy(false);
    }
  };

  const remove = async (id: number) => {
    setDeleting(id);
    try {
      await clientApi(`/tenants/${tenantId}/photo/${id}`, { method: "DELETE" });
      toast.success("Document removed");
      router.refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Couldn't remove the document");
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="grid gap-5">
      {documents.length > 0 ? (
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {documents.map((d) => (
            <li key={d.id} className="flex items-center gap-3 rounded-sm border bg-card p-3">
              <a href={d.photo_url} target="_blank" rel="noopener noreferrer" className="relative size-14 shrink-0 overflow-hidden rounded-sm bg-muted">
                <Image src={d.photo_url} alt={d.name ?? "Document"} fill sizes="56px" className="object-cover" />
              </a>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium">{d.name || "Document"}</span>
                <a href={d.photo_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-link hover:underline">
                  Open <ExternalLink className="size-3" aria-hidden />
                </a>
              </span>
              <Button size="icon-sm" variant="ghost" loading={deleting === d.id} onClick={() => remove(d.id)} aria-label={`Remove ${d.name}`} className="text-destructive">
                {deleting !== d.id && <Trash2 />}
              </Button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-muted-foreground">No ID documents uploaded yet.</p>
      )}

      {!full ? (
        <div className="grid gap-3 rounded-sm border border-dashed p-4 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
          <div className="grid gap-1.5">
            <Label htmlFor="doc-name">Document name</Label>
            <Input id="doc-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Aadhaar card" maxLength={50} />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="doc-file">Photo or scan</Label>
            <Input id="doc-file" ref={file} type="file" accept="image/*" className="pt-2" />
          </div>
          <Button onClick={upload} loading={busy}>
            <FileUp aria-hidden /> Upload
          </Button>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">{MAX_DOCS} of {MAX_DOCS} documents uploaded. Remove one to add another.</p>
      )}
    </div>
  );
}
