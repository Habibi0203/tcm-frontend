export function SkeletonCard() {
  return (
    <div className="overflow-hidden rounded-xl border border-border-main bg-card">
      <div className="aspect-[16/10] w-full animate-pulse bg-gray-200" />
      <div className="space-y-3 p-4">
        <div className="h-4 w-20 animate-pulse rounded-full bg-gray-200" />
        <div className="h-5 w-full animate-pulse rounded bg-gray-200" />
        <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200" />
      </div>
    </div>
  );
}

export function SkeletonRow() {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-border-main bg-card p-4">
      <div className="h-10 w-10 animate-pulse rounded-full bg-gray-200" />
      <div className="flex-1 space-y-2">
        <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200" />
        <div className="h-3 w-1/2 animate-pulse rounded bg-gray-200" />
      </div>
    </div>
  );
}
