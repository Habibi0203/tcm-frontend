export default function Loading() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-6 h-8 w-56 animate-pulse rounded-xl bg-surface" />
      <div className="space-y-3">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="flex animate-pulse items-center gap-4 rounded-xl border border-border-main bg-white p-4">
            <div className="h-10 w-10 shrink-0 rounded-full bg-surface" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-3/4 rounded bg-surface" />
              <div className="h-3 w-1/3 rounded bg-surface" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
