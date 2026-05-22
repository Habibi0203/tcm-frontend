"use client";

import ErrorState from "@/components/ui/ErrorState";

export default function ArtikelError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <ErrorState
        title="Artikel belum bisa dimuat"
        message="Daftar artikel sedang tidak tersedia. Silakan coba lagi."
        onRetry={reset}
      />
    </div>
  );
}
