"use client";

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 lg:px-8">
      <div className="rounded-2xl border border-border-main bg-white p-8 shadow-sm">
        <h2 className="font-display text-2xl font-bold text-text-main">Halaman gagal dimuat</h2>
        <p className="mt-2 text-sm text-muted">Coba muat ulang. Jika masih gagal, kemungkinan data sedang diperbarui.</p>
        <button
          onClick={() => reset()}
          className="mt-5 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark"
        >
          Muat ulang
        </button>
      </div>
    </div>
  );
}
