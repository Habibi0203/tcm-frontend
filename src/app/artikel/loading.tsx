export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 h-10 w-64 animate-pulse rounded-xl bg-surface" />
      <div className="mb-6 h-12 w-full animate-pulse rounded-full bg-surface" />
      <div className="mb-6 flex gap-2">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-8 w-24 animate-pulse rounded-full bg-surface" />
        ))}
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="rounded-2xl border border-border-main bg-surface" style={{ height: 280 }}>
            <div className="h-40 animate-pulse rounded-t-2xl bg-border-main/30" />
            <div className="space-y-3 p-4">
              <div className="h-4 animate-pulse rounded bg-border-main/30" />
              <div className="h-3 w-3/4 animate-pulse rounded bg-border-main/30" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
