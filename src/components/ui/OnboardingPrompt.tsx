"use client";

import Link from "next/link";
import { Sparkles } from "lucide-react";
import { useAuthStore } from "@/store/authStore";

export default function OnboardingPrompt() {
  const { user, isAuthenticated, _hasHydrated } = useAuthStore();
  if (!_hasHydrated || !isAuthenticated || !user || user.onboarding_completed) return null;

  return (
    <div className="rounded-2xl border border-primary/20 bg-primary-light/40 p-5 text-sm text-text-main">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-3">
          <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-white">
            <Sparkles size={18} />
          </div>
          <div>
            <p className="font-display text-lg font-semibold">Lengkapi minat TCM Anda</p>
            <p className="mt-1 text-muted">
              Pilih topik minat agar profil lebih jelas dan komunitas lebih mudah mengenal latar belajar Anda.
            </p>
          </div>
        </div>
        <Link
          href="/dashboard?tab=profil"
          className="inline-flex shrink-0 items-center justify-center rounded-full bg-primary px-5 py-2.5 font-semibold text-white hover:bg-primary-dark"
        >
          Lengkapi profil
        </Link>
      </div>
    </div>
  );
}
