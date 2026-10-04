import Image from "next/image";
import { Building2 } from "lucide-react";
import { cn } from "@/lib/cn";

/** Listing photo with a branded fallback for listings that have no photos yet. */
export function ListingPhoto({ src, alt, sizes, priority, className }: { src: string | null; alt: string; sizes: string; priority?: boolean; className?: string }) {
  return (
    <div className={cn("relative overflow-hidden bg-brand-50", className)}>
      {src ? (
        <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className="object-cover transition duration-500 group-hover:scale-[1.03]" />
      ) : (
        <div className="absolute inset-0 grid place-items-center bg-gradient-to-br from-brand-50 to-brand-100 text-brand-400">
          <Building2 className="size-12" aria-hidden />
        </div>
      )}
    </div>
  );
}
