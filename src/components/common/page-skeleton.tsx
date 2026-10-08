import { Skeleton } from "@/components/ui/skeleton";

/** Placeholder shown instantly while a page loads, so navigation never shows a blank screen. */
export function PageSkeleton({ variant = "cards" }: { variant?: "cards" | "table" | "detail" }) {
  return (
    <div className="grid gap-8" aria-busy="true" aria-label="Loading">
      <div className="grid gap-3">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-9 w-72 max-w-full" />
        <Skeleton className="h-4 w-96 max-w-full" />
      </div>
      {variant === "cards" && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }, (_, i) => (
            <div key={i} className="overflow-hidden rounded-sm border bg-card">
              <Skeleton className="aspect-[16/10] rounded-none" />
              <div className="grid gap-2 p-4">
                <Skeleton className="h-6 w-1/3" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      )}
      {variant === "table" && (
        <div className="grid gap-px overflow-hidden rounded-sm border bg-border">
          {Array.from({ length: 8 }, (_, i) => (
            <div key={i} className="flex items-center gap-4 bg-card px-4 py-4">
              <Skeleton className="size-10" />
              <Skeleton className="h-4 flex-1" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-20" />
            </div>
          ))}
        </div>
      )}
      {variant === "detail" && (
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_380px]">
          <div className="grid gap-6">
            <Skeleton className="aspect-[16/10]" />
            <Skeleton className="h-24" />
          </div>
          <Skeleton className="h-96" />
        </div>
      )}
    </div>
  );
}
