import Link from "next/link";
import type { ReactNode } from "react";
import { BedDouble, Camera, MapPin, Ruler, ShieldCheck } from "lucide-react";
import { coverPhoto, formatArea, formatRupees, listingLocation, timeAgo } from "@/lib/format";
import type { Listing } from "@/lib/types";
import { Tilt } from "@/components/common/tilt";
import { cn } from "@/lib/utils";
import { ListingPhoto } from "./listing-photo";

/** Property card in the style of established listing portals: photo, price, specs, agency. */
export function ListingCard({ listing, action, priority, className }: { listing: Listing; action?: ReactNode; priority?: boolean; className?: string }) {
  const area = formatArea(listing.flat?.area_sqft);
  const photos = listing.flat?.photos?.length ?? 0;
  const by = listing.company?.name || listing.lister?.name;

  return (
    <Tilt className="rounded-lg">
    <article
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-lg border bg-card shadow-soft transition-shadow duration-300 hover:shadow-float",
        className,
      )}
    >
      <div className="relative overflow-hidden">
        <ListingPhoto src={coverPhoto(listing)} alt={listing.title} sizes="(min-width: 1280px) 22vw, (min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw" priority={priority} className="aspect-[4/3]" />
        <span className="absolute top-3 left-3 rounded-sm bg-ink/85 px-2 py-1 text-[11px] font-semibold tracking-wide text-white uppercase backdrop-blur">For rent</span>
        {photos > 0 && (
          <span className="absolute bottom-3 left-3 inline-flex items-center gap-1 rounded-sm bg-black/55 px-2 py-0.5 text-xs font-medium text-white backdrop-blur">
            <Camera className="size-3.5" aria-hidden /> {photos}
          </span>
        )}
        {action && <div className="absolute top-3 right-3 z-10">{action}</div>}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <p className="text-xl font-bold tracking-tight text-primary tabular dark:text-foreground">
          {formatRupees(listing.monthly_rent)}
          <span className="ml-1 text-sm font-medium text-muted-foreground">/ month</span>
        </p>
        <h3 className="mt-1 line-clamp-1 font-semibold">
          <Link href={`/listings/${listing.id}`} className="after:absolute after:inset-0 hover:text-link focus-visible:outline-none">
            {listing.title}
          </Link>
        </h3>
        <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
          <MapPin className="size-3.5 shrink-0" aria-hidden />
          <span className="line-clamp-1">{listingLocation(listing)}</span>
        </p>

        <ul className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-foreground/80">
          <li className="flex items-center gap-1.5">
            <BedDouble className="size-4 text-muted-foreground" aria-hidden /> {listing.flat?.type}
          </li>
          {area && (
            <li className="flex items-center gap-1.5">
              <Ruler className="size-4 text-muted-foreground" aria-hidden /> {area}
            </li>
          )}
          <li className="flex items-center gap-1.5">
            <ShieldCheck className="size-4 text-muted-foreground" aria-hidden /> {formatRupees(listing.security_amount)} {listing.security_type === "lease" ? "lease" : "deposit"}
          </li>
        </ul>

        <div className="min-h-4 flex-1" />
        <div className="flex items-center justify-between gap-3 border-t pt-3 text-xs text-muted-foreground">
          <span className="truncate font-medium text-foreground/80">{by ?? "Listed by owner"}</span>
          {listing.created_at && <span className="shrink-0">Listed {timeAgo(listing.created_at)}</span>}
        </div>
      </div>
    </article>
    </Tilt>
  );
}

export function ListingCardSkeleton() {
  return (
    <div className="animate-pulse overflow-hidden rounded-lg border bg-card">
      <div className="aspect-[4/3] bg-muted" />
      <div className="space-y-3 p-4">
        <div className="h-6 w-1/3 rounded bg-muted" />
        <div className="h-4 w-3/4 rounded bg-muted" />
        <div className="h-4 w-1/2 rounded bg-muted" />
      </div>
    </div>
  );
}
