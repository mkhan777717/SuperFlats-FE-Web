import Image from "next/image";
import { ImageOff } from "lucide-react";
import { cn } from "@/lib/utils";

/** Listing photo with a soft branded fallback for listings without photos. */
export function ListingPhoto({ src, alt, sizes, priority, className }: { src: string | null; alt: string; sizes: string; priority?: boolean; className?: string }) {
  return (
    <div className={cn("relative overflow-hidden bg-muted", className)}>
      {src ? (
        <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className="object-cover transition duration-500 group-hover:scale-[1.04]" />
      ) : (
        <div className="bg-brand-wash absolute inset-0 grid place-items-center text-muted-foreground">
          <span className="flex flex-col items-center gap-2 text-xs font-medium">
            <ImageOff className="size-7 opacity-60" aria-hidden /> Photos coming soon
          </span>
        </div>
      )}
    </div>
  );
}
