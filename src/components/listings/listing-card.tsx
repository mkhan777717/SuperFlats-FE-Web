import Link from "next/link";
import type { ReactNode } from "react";
import { MapPin, Ruler, ShieldCheck } from "lucide-react";
import { Tilt } from "@/components/common/tilt";
import { coverPhoto, formatArea, formatRupees, listingLocation } from "@/lib/format";
import type { Listing } from "@/lib/types";
import { ListingPhoto } from "./listing-photo";

/** Photo-first card that lifts and tilts in 3D on hover. */
export function ListingCard({ listing, action, priority }: { listing: Listing; action?: ReactNode; priority?: boolean }) {
  const area = formatArea(listing.flat?.area_sqft);
  const photos = listing.flat?.photos?.length ?? 0;

  return (
    <Tilt className="group rounded-3xl" max={5}>
      <article className="relative flex h-full flex-col overflow-hidden rounded-3xl border bg-card shadow-lift transition-shadow duration-300 group-hover:shadow-float">
        <div className="relative">
          <ListingPhoto
            src={coverPhoto(listing)}
            alt={listing.title}
            sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
            priority={priority}
            className="aspect-[4/3]"
          />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/55 to-transparent" />
          <span className="glass absolute top-3 left-3 rounded-full px-3 py-1 text-xs font-bold">{listing.flat?.type}</span>
          {photos > 1 && <span className="absolute right-3 bottom-3 rounded-full bg-black/50 px-2.5 py-0.5 text-xs font-medium text-white backdrop-blur">{photos} photos</span>}
          <p className="absolute bottom-3 left-4 text-xl font-extrabold text-white tabular drop-shadow">
            {formatRupees(listing.monthly_rent)}
            <span className="text-sm font-medium text-white/80"> /month</span>
          </p>
          {action && <div className="absolute top-3 right-3 z-10">{action}</div>}
        </div>
        <div className="flex flex-1 flex-col p-5">
          <h3 className="line-clamp-1 text-lg font-bold">
            <Link href={`/listings/${listing.id}`} className="after:absolute after:inset-0 focus-visible:outline-none">
              {listing.title}
            </Link>
          </h3>
          <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
            <MapPin className="size-4 shrink-0" aria-hidden />
            <span className="line-clamp-1">{listingLocation(listing)}</span>
          </p>
          <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 border-t pt-4 text-sm text-muted-foreground">
            {area && (
              <span className="flex items-center gap-1.5">
                <Ruler className="size-4" aria-hidden /> {area}
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="size-4" aria-hidden /> {listing.security_type === "lease" ? "Lease" : "Deposit"} {formatRupees(listing.security_amount)}
            </span>
          </div>
        </div>
      </article>
    </Tilt>
  );
}

export function ListingCardSkeleton() {
  return (
    <div className="animate-pulse overflow-hidden rounded-3xl border bg-card shadow-soft">
      <div className="aspect-[4/3] bg-muted" />
      <div className="space-y-3 p-5">
        <div className="h-5 w-3/4 rounded bg-muted" />
        <div className="h-4 w-1/2 rounded bg-muted" />
      </div>
    </div>
  );
}
