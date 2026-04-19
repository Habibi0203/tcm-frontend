"use client";

import Link from "next/link";
import { useEffect } from "react";
import { AlertOctagon, RefreshCcw, Home } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-20 text-center">
      <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
        <AlertOctagon size={32} className="text-red-500" />
      </div>
      <h1 className="mb-2 font-display text-3xl font-bold text-text-main">
        Terjadi Kesalahan
      </h1>
      <p className="mb-8 max-w-sm text-muted">
        Maaf, terjadi kesalahan yang tidak terduga. Tim kami sudah diberitahu.
        {error.digest && (
          <span className="mt-1 block text-xs text-muted/60">ID: {error.digest}</span>
        )}
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <button
          onClick={reset}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark"
        >
          <RefreshCcw size={16} /> Coba Lagi
        </button>
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-xl border border-border-main bg-white px-6 py-2.5 text-sm font-medium text-text-main hover:bg-surface"
        >
          <Home size={16} /> Beranda
        </Link>
      </div>
    </div>
  );
}
