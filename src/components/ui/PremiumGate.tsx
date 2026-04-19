"use client";

import { Crown, Check, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface PremiumGateProps {
  title?: string;
  /** Used as sessionStorage key to remember per-article dismiss */
  articleSlug?: string;
}

const SESSION_KEY = (slug: string) => `tcm_premium_dismissed_${slug}`;

export default function PremiumGate({
  title = "Artikel ini untuk Member Premium",
  articleSlug,
}: PremiumGateProps) {
  const [visible, setVisible] = useState(false);

  // 1-second delay before showing the gate + check sessionStorage
  useEffect(() => {
    if (articleSlug && sessionStorage.getItem(SESSION_KEY(articleSlug)) === "1") return;
    const timer = setTimeout(() => setVisible(true), 1000);
    return () => clearTimeout(timer);
  }, [articleSlug]);

  function dismiss() {
    if (articleSlug) sessionStorage.setItem(SESSION_KEY(articleSlug), "1");
    setVisible(false);
  }

  if (!visible) return null;

  const benefits = [
    "Akses seluruh artikel premium",
    "Akses subforum premium & tanya praktisi",
    "Terjemahan artikel ke Bahasa Inggris",
    "Update protokol TCM terbaru setiap minggu",
    "Priority support dari komunitas",
  ];

  return (
    <div className="relative">
      {/* Blur gradient above */}
      <div className="pointer-events-none absolute inset-x-0 -top-32 h-32 bg-gradient-to-b from-transparent to-surface" />

      <div className="relative mx-auto max-w-2xl rounded-2xl border border-amber-light bg-gradient-to-b from-amber-light/40 to-white p-8 shadow-lg">
        {/* Dismiss × */}
        <button
          onClick={dismiss}
          className="absolute right-4 top-4 rounded-lg p-1 text-muted transition-colors hover:bg-surface hover:text-text-main"
          aria-label="Tutup"
        >
          <X size={20} />
        </button>

        <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-amber-tcm text-white">
          <Crown size={24} />
        </div>

        <h3 className="mb-2 font-display text-2xl font-bold text-text-main">{title}</h3>
        <p className="mb-6 text-muted">
          Upgrade ke Premium untuk membuka akses penuh ke konten eksklusif, protokol lengkap TCM, dan berbagai fitur lanjutan.
        </p>

        <ul className="mb-6 space-y-2">
          {benefits.map((b) => (
            <li key={b} className="flex items-center gap-2 text-sm text-text-main">
              <Check size={16} className="shrink-0 text-primary" />
              <span>{b}</span>
            </li>
          ))}
        </ul>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href="/daftar"
            className="inline-flex items-center justify-center rounded-lg bg-amber-tcm px-6 py-3 font-semibold text-white transition-colors hover:bg-amber-tcm/90"
          >
            Upgrade ke Premium
          </Link>
          <Link
            href="/masuk"
            className="inline-flex items-center justify-center rounded-lg border border-border-main bg-white px-6 py-3 font-medium text-text-main transition-colors hover:bg-surface"
          >
            Sudah punya akun? Masuk
          </Link>
        </div>
      </div>
    </div>
  );
}
