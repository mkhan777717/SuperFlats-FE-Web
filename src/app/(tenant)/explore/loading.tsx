export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl animate-pulse space-y-8" aria-busy="true" aria-label="Loading listings">
      <div className="h-40 rounded-[1.75rem] bg-brand-100" />
      <div className="h-12 w-2/3 rounded-xl bg-muted" />
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className="card overflow-hidden">
            <div className="aspect-[4/3] bg-muted" />
            <div className="space-y-3 p-5">
              <div className="h-5 w-3/4 rounded bg-muted" />
              <div className="h-4 w-1/2 rounded bg-muted" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
