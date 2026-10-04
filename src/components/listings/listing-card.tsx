import Link from "next/link";
import type { ReactNode } from "react";
import { Clock, MapPin, Ruler, ShieldCheck } from "lucide-react";
import { coverPhoto, formatArea, formatRupees, listingAmenities, listingLocation, timeAgo } from "@/lib/format";
import type { Listing } from "@/lib/types";
import { cn } from "@/lib/utils";
import { ListingPhoto } from "./listing-photo";

/** Photo-led card: rent on the photo, essentials underneath, lifts gently on hover. */
export function ListingCard({ listing, action, priority, className }: { listing: Listing; action?: ReactNode; priority?: boolean; className?: string }) {
  const area = formatArea(listing.flat?.area_sqft);
  const amenities = listingAmenities(listing);
  const photos = listing.flat?.photos?.length ?? 0;

  return (
    <article
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-3xl border bg-card shadow-soft transition duration-300 hover:-translate-y-1 hover:shadow-lift",
        className,
      )}
    >
      <div className="relative">
        <ListingPhoto src={coverPhoto(listing)} alt={listing.title} sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw" priority={priority} className="aspect-[4/3]" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/70 via-black/25 to-transparent" />
        <span className="absolute top-3 left-3 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-neutral-900 shadow-soft backdrop-blur">{listing.flat?.type}</span>
        {action && <div className="absolute top-3 right-3 z-10">{action}</div>}
        <div className="absolute inset-x-4 bottom-3 flex items-end justify-between gap-2 text-white">
          <p className="text-2xl font-extrabold tabular drop-shadow">
            {formatRupees(listing.monthly_rent)}
            <span className="text-sm font-medium text-white/80"> /mo</span>
          </p>
          {photos > 1 && <span className="rounded-full bg-black/45 px-2 py-0.5 text-xs font-medium backdrop-blur">{photos} photos</span>}
        </div>
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

        {amenities.length > 0 && (
          <p className="mt-3 line-clamp-1 text-sm text-muted-foreground">
            {amenities.slice(0, 3).join(" · ")}
            {amenities.length > 3 && ` · +${amenities.length - 3} more`}
          </p>
        )}

        <div className="min-h-4 flex-1" />
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 border-t pt-4 text-xs font-medium text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="size-4" aria-hidden />
            {listing.security_type === "lease" ? "Lease" : "Deposit"} {formatRupees(listing.security_amount)}
          </span>
          {area && (
            <span className="flex items-center gap-1.5">
              <Ruler className="size-4" aria-hidden /> {area}
            </span>
          )}
          {listing.created_at && (
            <span className="ml-auto flex items-center gap-1.5">
              <Clock className="size-3.5" aria-hidden /> {timeAgo(listing.created_at)}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}

export function ListingCardSkeleton() {
  return (
    <div className="animate-pulse overflow-hidden rounded-3xl border bg-card shadow-soft">
      <div className="aspect-[4/3] bg-muted" />
      <div className="space-y-3 p-5">
        <div className="h-5 w-3/4 rounded bg-muted" />
        <div className="h-4 w-1/2 rounded bg-muted" />
        <div className="h-4 w-2/3 rounded bg-muted" />
      </div>
    </div>
  );
}
