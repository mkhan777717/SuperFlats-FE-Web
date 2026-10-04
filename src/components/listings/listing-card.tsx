import Link from "next/link";
import type { ReactNode } from "react";
import { BedDouble, MapPin, Ruler, Sparkles } from "lucide-react";
import { coverPhoto, formatArea, formatRupees, listingAmenities, listingLocation, timeAgo } from "@/lib/format";
import type { Listing } from "@/lib/types";
import { cn } from "@/lib/utils";
import { ListingPhoto } from "./listing-photo";

function Chip({ icon: Icon, children }: { icon?: typeof BedDouble; children: ReactNode }) {
  return (
    <span className="inline-flex h-7 items-center gap-1 rounded-full border border-ink/15 bg-background px-2.5 text-xs font-medium whitespace-nowrap">
      {Icon && <Icon className="size-3.5" aria-hidden />}
      {children}
    </span>
  );
}

/** Raised card with photo, rent and deposit side by side, key features and who listed it. */
export function ListingCard({ listing, action, priority, className }: { listing: Listing; action?: ReactNode; priority?: boolean; className?: string }) {
  const area = formatArea(listing.flat?.area_sqft);
  const amenities = listingAmenities(listing);
  const shown = amenities.slice(0, area ? 1 : 2);
  const more = amenities.length - shown.length;
  const by = listing.company?.name || listing.lister?.name || "Owner";

  return (
    <article className={cn("brutal brutal-hover group relative flex h-full flex-col overflow-hidden rounded-2xl bg-card", className)}>
      <div className="relative border-b-2 border-ink">
        <ListingPhoto src={coverPhoto(listing)} alt={listing.title} sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw" priority={priority} className="aspect-[16/11]" />
        {action && <div className="absolute top-3 right-3 z-10">{action}</div>}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="line-clamp-1 text-[1.05rem] font-bold">
          <Link href={`/listings/${listing.id}`} className="after:absolute after:inset-0 focus-visible:outline-none">
            {listing.title}
          </Link>
        </h3>
        <p className="mt-0.5 flex items-center gap-1 text-sm text-muted-foreground">
          <MapPin className="size-3.5 shrink-0" aria-hidden />
          <span className="line-clamp-1">{listingLocation(listing)}</span>
        </p>

        <dl className="mt-3 grid grid-cols-2 divide-x divide-ink/15 rounded-xl bg-muted/70 py-2">
          <div className="px-3">
            <dt className="text-[11px] font-medium text-muted-foreground uppercase">Rent</dt>
            <dd className="font-bold tabular">{formatRupees(listing.monthly_rent)}</dd>
          </div>
          <div className="px-3">
            <dt className="text-[11px] font-medium text-muted-foreground uppercase">{listing.security_type === "lease" ? "Lease" : "Deposit"}</dt>
            <dd className="font-bold tabular">{formatRupees(listing.security_amount)}</dd>
          </div>
        </dl>

        <div className="mt-3 flex flex-wrap gap-1.5">
          <Chip icon={BedDouble}>{listing.flat?.type}</Chip>
          {area && <Chip icon={Ruler}>{area}</Chip>}
          {shown.map((a) => (
            <Chip key={a} icon={Sparkles}>
              {a}
            </Chip>
          ))}
          {more > 0 && <Chip>+{more}</Chip>}
        </div>

        <div className="min-h-4 flex-1" />
        <div className="flex items-center justify-between gap-3 border-t border-ink/10 pt-3 text-xs text-muted-foreground">
          <span className="flex min-w-0 items-center gap-2">
            <span className="grid size-6 shrink-0 place-items-center rounded-full bg-accent text-[11px] font-bold text-accent-foreground">{by.charAt(0).toUpperCase()}</span>
            <span className="truncate font-medium text-foreground">{by}</span>
          </span>
          {listing.created_at && <span className="shrink-0">Posted {timeAgo(listing.created_at)}</span>}
        </div>
      </div>
    </article>
  );
}

export function ListingCardSkeleton() {
  return (
    <div className="animate-pulse overflow-hidden rounded-2xl border-2 border-ink/10 bg-card">
      <div className="aspect-[16/11] bg-muted" />
      <div className="space-y-3 p-4">
        <div className="h-5 w-3/4 rounded bg-muted" />
        <div className="h-12 rounded-xl bg-muted" />
        <div className="h-6 w-2/3 rounded bg-muted" />
      </div>
    </div>
  );
}
