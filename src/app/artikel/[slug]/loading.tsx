export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid gap-10 lg:grid-cols-[1fr_300px]">
        <div>
          <div className="mb-4 h-8 w-32 animate-pulse rounded-full bg-surface" />
          <div className="mb-6 h-12 w-3/4 animate-pulse rounded-xl bg-surface" />
          <div className="mb-8 flex gap-3">
            <div className="h-10 w-10 animate-pulse rounded-full bg-surface" />
            <div className="space-y-2">
              <div className="h-4 w-32 animate-pulse rounded bg-surface" />
              <div className="h-3 w-24 animate-pulse rounded bg-surface" />
            </div>
          </div>
          <div className="mb-6 h-72 animate-pulse rounded-2xl bg-surface" />
          {[...Array(4)].map((_, i) => (
            <div key={i} className="mb-3 h-4 animate-pulse rounded bg-surface" />
          ))}
        </div>
        <div className="hidden lg:block space-y-4">
          <div className="h-40 animate-pulse rounded-2xl bg-surface" />
          <div className="h-40 animate-pulse rounded-2xl bg-surface" />
        </div>
      </div>
    </div>
  );
}
