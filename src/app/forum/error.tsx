"use client";

import ErrorState from "@/components/ui/ErrorState";

export default function ForumError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <ErrorState
        title="Forum belum bisa dimuat"
        message="Data forum sedang tidak tersedia. Silakan coba lagi beberapa saat lagi."
        onRetry={reset}
      />
    </div>
  );
}
