export default function Loading() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 h-10 w-48 animate-pulse rounded-xl bg-surface" />
      <div className="grid gap-4 sm:grid-cols-2">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="animate-pulse rounded-2xl border border-border-main bg-surface p-6">
            <div className="mb-3 h-5 w-3/4 rounded bg-border-main/30" />
            <div className="mb-2 h-3 w-full rounded bg-border-main/20" />
            <div className="h-3 w-1/2 rounded bg-border-main/20" />
          </div>
        ))}
      </div>
    </div>
  );
}
