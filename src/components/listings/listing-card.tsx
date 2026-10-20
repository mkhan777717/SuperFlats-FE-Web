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
    <Tilt className="rounded-2xl" max={2}>
      <article
        className={cn(
          "group relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/80 bg-white/80 backdrop-blur-xl shadow-[0_4px_24px_-4px_rgba(11,25,44,0.06),inset_0_1px_1px_rgba(255,255,255,0.85)] transition-all duration-300 hover:-translate-y-1 hover:border-gold/30 hover:bg-white hover:shadow-[0_18px_38px_-6px_rgba(11,25,44,0.12)]",
          className,
        )}
      >
        <div className="relative z-[1] overflow-hidden">
          <ListingPhoto src={coverPhoto(listing)} alt={listing.title} sizes="(min-width: 1280px) 22vw, (min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw" priority={priority} className="aspect-[16/10] transition-transform duration-500 group-hover:scale-105" />
          <span className="absolute top-3 left-3 rounded-full border border-white/30 bg-primary/85 px-3 py-1 text-[0.65rem] font-semibold tracking-wider text-white uppercase backdrop-blur-md shadow-sm">
            For rent
          </span>
          {photos > 0 && (
            <span className="absolute right-3 bottom-3 inline-flex items-center gap-1 rounded-full border border-white/20 bg-black/50 px-2.5 py-0.5 text-xs font-medium text-white backdrop-blur-md shadow-sm">
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
          <h3 className="mt-2 line-clamp-1 font-semibold text-[1.05rem]">
            <Link href={`/listings/${listing.id}`} className="after:absolute after:inset-0 focus-visible:outline-none hover:text-gold-strong transition-colors">
              {listing.title}
            </Link>
          </h3>
          <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
            <MapPin className="size-3.5 shrink-0 text-gold-strong" aria-hidden />
            <span className="line-clamp-1">{listingLocation(listing)}</span>
          </p>

          <ul className="mt-3.5 flex flex-wrap items-center gap-2 text-[0.8125rem]">
            <li className="inline-flex items-center gap-1.5 rounded-lg border border-slate-100 bg-slate-50/80 px-2.5 py-1 font-medium text-slate-700 shadow-[inset_0_1px_1px_rgba(255,255,255,0.8)]">
              <BedDouble className="size-3.5 text-primary" aria-hidden />
              <span>{listing.flat?.type}</span>
            </li>
            {area && (
              <li className="inline-flex items-center gap-1.5 rounded-lg border border-slate-100 bg-slate-50/80 px-2.5 py-1 font-medium text-slate-700 shadow-[inset_0_1px_1px_rgba(255,255,255,0.8)]">
                <SquareDashed className="size-3.5 text-primary" aria-hidden />
                <span>{area}</span>
              </li>
            )}
            <li
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-100 bg-slate-50/80 px-2.5 py-1 font-medium text-slate-700 shadow-[inset_0_1px_1px_rgba(255,255,255,0.8)]"
              title={`${listing.security_type === "lease" ? "Lease" : "Deposit"} ${formatRupees(listing.security_amount)}`}
            >
              <ReceiptIndianRupee className="size-3.5 text-primary" aria-hidden />
              <span>{formatCompactRupees(listing.security_amount)} {listing.security_type === "lease" ? "lease" : "dep"}</span>
            </li>
          </ul>
        </div>

        <div className="mt-4 flex items-center justify-between gap-3 border-t border-slate-100/80 bg-slate-50/40 px-4 py-3 text-xs text-muted-foreground">
          <span className="flex min-w-0 items-center gap-2">
            <span className="grid size-7 shrink-0 place-items-center rounded-full bg-gradient-to-br from-primary to-primary/80 text-[11px] font-bold text-primary-foreground shadow-sm">
              {by.charAt(0).toUpperCase()}
            </span>
            <span className="truncate text-sm font-medium text-foreground">{by}</span>
          </span>
          {listing.created_at && (
            <span className="shrink-0 rounded-full border border-slate-200/60 bg-white/80 px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground">
              {timeAgo(listing.created_at)}
            </span>
          )}
        </div>
      </article>
    </Tilt>
  );
}

export function ListingCardSkeleton() {
  return (
    <div className="animate-pulse overflow-hidden rounded-2xl border border-white/60 bg-white/70 backdrop-blur-xl">
      <div className="aspect-[16/10] bg-muted" />
      <div className="space-y-3 p-4">
        <div className="h-6 w-1/3 rounded bg-muted" />
        <div className="h-4 w-3/4 rounded bg-muted" />
        <div className="h-4 w-1/2 rounded bg-muted" />
      </div>
    </div>
  );
}
