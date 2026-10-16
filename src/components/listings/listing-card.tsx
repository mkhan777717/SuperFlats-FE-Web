import Link from "next/link";
import type { ReactNode } from "react";
import { BedDouble, Camera, MapPin, ReceiptIndianRupee, SquareDashed } from "lucide-react";
import { Tilt } from "@/components/common/tilt";
import { coverPhoto, formatArea, formatCompactRupees, formatRupees, listingLocation, timeAgo } from "@/lib/format";
import type { Listing } from "@/lib/types";
import { cn } from "@/lib/utils";
import { ListingPhoto } from "./listing-photo";

/** Property card: photo with badges, price per month, specs row and the listing agency. */
export function ListingCard({ listing, action, priority, className }: { listing: Listing; action?: ReactNode; priority?: boolean; className?: string }) {
  const area = formatArea(listing.flat?.area_sqft);
  const photos = listing.flat?.photos?.length ?? 0;
  const by = listing.company?.name || listing.lister?.name || "Owner";

  return (
    <Tilt className="rounded-sm" max={2}>
      <article
        className={cn(
          "group relative flex h-full flex-col overflow-hidden rounded-sm border bg-card transition-shadow duration-500 hover:shadow-lift",
          className,
        )}
      >
        <div className="relative z-[1] overflow-hidden">
          <ListingPhoto src={coverPhoto(listing)} alt={listing.title} sizes="(min-width: 1280px) 22vw, (min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw" priority={priority} className="aspect-[16/10]" />
          <span className="absolute top-3 left-3 rounded-sm bg-primary px-2.5 py-1 text-[0.65rem] font-semibold tracking-[0.14em] text-primary-foreground uppercase">For rent</span>
          {photos > 0 && (
            <span className="absolute right-3 bottom-3 inline-flex items-center gap-1 rounded-sm bg-black/65 px-2 py-0.5 text-xs font-medium text-white backdrop-blur">
              <Camera className="size-3.5" aria-hidden /> {photos} {photos === 1 ? "photo" : "photos"}
            </span>
          )}
          {action && <div className="absolute top-3 right-3 z-20">{action}</div>}
        </div>

        <div className="flex flex-1 flex-col px-4 pt-4">
          <p className="text-[1.4rem] leading-none font-semibold tracking-tight text-primary tabular">
            {formatRupees(listing.monthly_rent)}
            <span className="ml-1.5 text-sm font-normal tracking-normal text-muted-foreground">/ month</span>
          </p>
          <h3 className="mt-2 line-clamp-1 font-semibold">
            <Link href={`/listings/${listing.id}`} className="after:absolute after:inset-0 focus-visible:outline-none">
              {listing.title}
            </Link>
          </h3>
          <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
            <MapPin className="size-3.5 shrink-0" aria-hidden />
            <span className="line-clamp-1">{listingLocation(listing)}</span>
          </p>

          <ul className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-[0.8125rem] text-foreground/80">
            <li className="flex items-center gap-1.5">
              <BedDouble className="size-4 text-muted-foreground" aria-hidden /> {listing.flat?.type}
            </li>
            {area && (
              <li className="flex items-center gap-1.5">
                <SquareDashed className="size-4 text-muted-foreground" aria-hidden /> {area}
              </li>
            )}
            <li className="flex items-center gap-1.5" title={`${listing.security_type === "lease" ? "Lease" : "Deposit"} ${formatRupees(listing.security_amount)}`}>
              <ReceiptIndianRupee className="size-4 text-muted-foreground" aria-hidden /> {formatCompactRupees(listing.security_amount)} {listing.security_type === "lease" ? "lease" : "dep"}
            </li>
          </ul>
        </div>

        <div className="mt-4 flex items-center justify-between gap-3 border-t px-4 py-3 text-xs text-muted-foreground">
          <span className="flex min-w-0 items-center gap-2">
            <span className="grid size-7 shrink-0 place-items-center rounded-full bg-primary text-[11px] font-bold text-primary-foreground">{by.charAt(0).toUpperCase()}</span>
            <span className="truncate text-sm font-medium text-foreground">{by}</span>
          </span>
          {listing.created_at && <span className="shrink-0">Listed {timeAgo(listing.created_at)}</span>}
        </div>
      </article>
    </Tilt>
  );
}

export function ListingCardSkeleton() {
  return (
    <div className="animate-pulse overflow-hidden rounded-lg border bg-card">
      <div className="aspect-[16/10] bg-muted" />
      <div className="space-y-3 p-4">
        <div className="h-6 w-1/3 rounded bg-muted" />
        <div className="h-4 w-3/4 rounded bg-muted" />
        <div className="h-4 w-1/2 rounded bg-muted" />
      </div>
    </div>
  );
}
