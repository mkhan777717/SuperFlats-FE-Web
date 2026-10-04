import Image from "next/image";
import { initials } from "@/lib/format";
import { cn } from "@/lib/cn";

export function Avatar({ name, src, size = 40, className }: { name: string; src?: string | null; size?: number; className?: string }) {
  return (
    <span
      className={cn("relative grid shrink-0 place-items-center overflow-hidden rounded-full hero-gradient font-semibold text-white", className)}
      style={{ width: size, height: size, fontSize: size * 0.38 }}
    >
      {src ? <Image src={src} alt="" fill sizes={`${size * 2}px`} className="object-cover" /> : initials(name || "?")}
    </span>
  );
}
