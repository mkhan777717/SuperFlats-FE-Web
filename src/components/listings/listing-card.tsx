import Link from "next/link";
import type { ReactNode } from "react";
import { MapPin, Ruler, ShieldCheck } from "lucide-react";
import { coverPhoto, formatArea, formatRupees, listingLocation } from "@/lib/format";
import type { Listing } from "@/lib/types";
import { ListingPhoto } from "./listing-photo";

/** Photo-first card: rent, title, location and the essentials at a glance. */
export function ListingCard({ listing, action, priority }: { listing: Listing; action?: ReactNode; priority?: boolean }) {
  const area = formatArea(listing.flat?.area_sqft);
  const photos = listing.flat?.photos?.length ?? 0;

  return (
    <article className="group relative flex flex-col">
      <div className="relative">
        <ListingPhoto
          src={coverPhoto(listing)}
          alt={listing.title}
          sizes="(min-width: 1280px) 30vw, (min-width: 640px) 45vw, 100vw"
          priority={priority}
          className="aspect-[4/3] rounded-2xl"
        />
        <span className="absolute top-3 left-3 rounded-full bg-background/90 px-2.5 py-1 text-xs font-bold shadow-soft backdrop-blur">{listing.flat?.type}</span>
        {photos > 1 && (
          <span className="absolute bottom-3 left-3 rounded-full bg-black/55 px-2 py-0.5 text-[11px] font-medium text-white backdrop-blur">{photos} photos</span>
        )}
        {action && <div className="absolute top-2.5 right-2.5 z-10">{action}</div>}
      </div>
      <div className="flex flex-1 flex-col px-1 pt-3">
        <p className="text-lg font-bold tabular">
          {formatRupees(listing.monthly_rent)}
          <span className="text-sm font-medium text-muted-foreground"> /month</span>
        </p>
        <h3 className="mt-0.5 line-clamp-1 font-semibold">
          <Link href={`/listings/${listing.id}`} className="after:absolute after:inset-0 after:rounded-2xl focus-visible:outline-none">
            {listing.title}
          </Link>
        </h3>
        <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
          <MapPin className="size-3.5 shrink-0" aria-hidden />
          <span className="line-clamp-1">{listingLocation(listing)}</span>
        </p>
        <div className="mt-2.5 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
          {area && (
            <span className="flex items-center gap-1">
              <Ruler className="size-3.5" aria-hidden /> {area}
            </span>
          )}
          <span className="flex items-center gap-1">
            <ShieldCheck className="size-3.5" aria-hidden /> {listing.security_type === "lease" ? "Lease" : "Deposit"} {formatRupees(listing.security_amount)}
          </span>
        </div>
      </div>
    </article>
  );
}

export function ListingCardSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="aspect-[4/3] rounded-2xl bg-muted" />
      <div className="mt-3 h-5 w-1/3 rounded bg-muted" />
      <div className="mt-2 h-4 w-3/4 rounded bg-muted" />
      <div className="mt-2 h-3 w-1/2 rounded bg-muted" />
    </div>
  );
}
