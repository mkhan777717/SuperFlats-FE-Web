import Link from "next/link";
import type { ReactNode } from "react";
import { BedDouble, MapPin, Maximize } from "lucide-react";
import { coverPhoto, formatArea, formatRupees, listingLocation } from "@/lib/format";
import type { Listing } from "@/lib/types";
import { ListingPhoto } from "./listing-photo";

/** Card from the Lovable "My Listings" grid: photo with rent overlay, title, location and specs. */
export function ListingCard({ listing, action, priority }: { listing: Listing; action?: ReactNode; priority?: boolean }) {
  const area = formatArea(listing.flat?.area_sqft);

  return (
    <article className="card group relative flex flex-col overflow-hidden">
      <div className="relative">
        <ListingPhoto
          src={coverPhoto(listing)}
          alt={listing.title}
          sizes="(min-width: 1280px) 30vw, (min-width: 640px) 45vw, 100vw"
          priority={priority}
          className="aspect-[4/3]"
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/65 to-transparent px-5 pb-4 pt-12 text-white">
          <span className="text-2xl font-semibold">{formatRupees(listing.monthly_rent)}</span>
          <span className="text-white/80">/mo</span>
        </div>
        {action && <div className="absolute right-3 top-3 z-10">{action}</div>}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="line-clamp-1 text-lg font-semibold">
          <Link href={`/listings/${listing.id}`} className="after:absolute after:inset-0 focus:outline-none">
            {listing.title}
          </Link>
        </h3>
        <p className="mt-1 flex items-center gap-1.5 text-ink-soft">
          <MapPin className="size-4 shrink-0" aria-hidden />
          <span className="line-clamp-1">{listingLocation(listing)}</span>
        </p>
        <div className="mt-4 flex items-center gap-5 border-t border-line pt-4 text-ink-soft">
          <span className="flex items-center gap-1.5">
            <BedDouble className="size-4" aria-hidden /> {listing.flat?.type}
          </span>
          {area && (
            <span className="flex items-center gap-1.5">
              <Maximize className="size-4" aria-hidden /> {area}
            </span>
          )}
          <span className="ml-auto text-sm">
            {listing.security_type === "lease" ? "Lease" : "Deposit"} {formatRupees(listing.security_amount)}
          </span>
        </div>
      </div>
    </article>
  );
}
