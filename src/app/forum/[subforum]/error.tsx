"use client";

import ErrorState from "@/components/ui/ErrorState";

export default function SubforumError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <ErrorState
        title="Subforum belum bisa dimuat"
        message="Percakapan subforum sedang tidak tersedia. Silakan coba ulang."
        onRetry={reset}
      />
    </div>
  );
}
