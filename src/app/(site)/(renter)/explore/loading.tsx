import { ListingCardSkeleton } from "@/components/listings/listing-card";

export default function Loading() {
  return (
    <div className="grid gap-6" aria-busy="true" aria-label="Loading listings">
      <div className="h-16 w-72 animate-pulse rounded-xl bg-muted" />
      <div className="h-12 animate-pulse rounded-2xl bg-muted" />
      <div className="grid gap-x-6 gap-y-9 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }, (_, i) => (
          <ListingCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
