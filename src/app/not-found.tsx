import Link from "next/link";
import { FileQuestion, ArrowLeft } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Halaman Tidak Ditemukan — tcm.my.id",
};

export default function NotFound() {
  return (
    <div className="flex min-h-[65vh] flex-col items-center justify-center px-4 py-20 text-center">
      <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-surface">
        <FileQuestion size={32} className="text-muted" />
      </div>
      <p className="mb-2 font-mono text-6xl font-bold text-primary">404</p>
      <h1 className="mb-2 font-display text-2xl font-bold text-text-main">
        Halaman Tidak Ditemukan
      </h1>
      <p className="mb-8 max-w-sm text-muted">
        Halaman yang Anda cari tidak ada atau sudah dipindahkan.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark"
      >
        <ArrowLeft size={16} /> Kembali ke Beranda
      </Link>
    </div>
  );
}
