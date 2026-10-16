"use client";

import { useCallback, useState } from "react";
import Cropper, { type Area } from "react-easy-crop";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

/** Crop a circular region from a source image and return a `File`. */
async function cropImage(src: string, crop: Area): Promise<File> {
  const img = new Image();
  img.crossOrigin = "anonymous";
  await new Promise<void>((res, rej) => {
    img.onload = () => res();
    img.onerror = rej;
    img.src = src;
  });

  const canvas = document.createElement("canvas");
  const size = Math.min(crop.width, crop.height);
  // Output 512×512 — large enough for a crisp avatar, small enough for fast upload.
  const out = 512;
  canvas.width = out;
  canvas.height = out;
  const ctx = canvas.getContext("2d")!;

  // Draw circular clip path
  ctx.beginPath();
  ctx.arc(out / 2, out / 2, out / 2, 0, Math.PI * 2);
  ctx.closePath();
  ctx.clip();

  ctx.drawImage(img, crop.x, crop.y, size, size, 0, 0, out, out);

  return new Promise((resolve) =>
    canvas.toBlob(
      (blob) => resolve(new File([blob!], "profile.jpg", { type: "image/jpeg" })),
      "image/jpeg",
      0.9,
    ),
  );
}

interface Props {
  open: boolean;
  imageSrc: string | null;
  onClose: () => void;
  onCropped: (file: File) => void;
}

/** Full-screen dialog with a circular crop area for profile photos. */
export function PhotoCropper({ open, imageSrc, onClose, onCropped }: Props) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [area, setArea] = useState<Area | null>(null);
  const [saving, setSaving] = useState(false);

  const onCropComplete = useCallback((_: Area, pixels: Area) => setArea(pixels), []);

  const handleSave = async () => {
    if (!imageSrc || !area) return;
    setSaving(true);
    try {
      const file = await cropImage(imageSrc, area);
      onCropped(file);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-lg p-0 gap-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-2">
          <DialogTitle>Adjust photo</DialogTitle>
        </DialogHeader>

        <div className="relative mx-6 aspect-square overflow-hidden rounded-xl bg-black">
          {imageSrc && (
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={1}
              cropShape="round"
              showGrid={false}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />
          )}
        </div>

        {/* Zoom slider */}
        <div className="flex items-center gap-3 px-6 pt-4">
          <span className="text-xs text-muted-foreground">Zoom</span>
          <input
            type="range"
            min={1}
            max={3}
            step={0.05}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="flex-1 accent-primary"
            aria-label="Zoom"
          />
        </div>

        <DialogFooter className="px-6 py-4 gap-2">
          <Button variant="outline" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button onClick={handleSave} loading={saving}>
            Save photo
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
