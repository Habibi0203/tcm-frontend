"use client";

import Link from "next/link";
import { useState } from "react";
import { Mail, ArrowLeft, Check, Loader2 } from "lucide-react";
import { apiFetch } from "@/lib/api";

export default function LupaPasswordPage() {
  const [email,   setEmail]   = useState("");
  const [loading, setLoading] = useState(false);
  const [sent,    setSent]    = useState(false);
  const [error,   setError]   = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!email.trim()) { setError("Email wajib diisi."); return; }
    setLoading(true);

    const result = await apiFetch<{ message: string }>("/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
    });

    setLoading(false);

    if (!result.success) {
      setError(result.error.message ?? "Terjadi kesalahan. Coba lagi.");
      return;
    }

    setSent(true);
  }

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <Link href="/masuk" className="mb-8 inline-flex items-center gap-1 text-sm text-muted hover:text-primary">
          <ArrowLeft size={14} /> Kembali ke Login
        </Link>

        <div className="rounded-2xl border border-border-main bg-white p-8 shadow-sm">
          <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
            <Mail size={28} className="text-primary" />
          </div>

          {sent ? (
            <div className="text-center">
              <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                <Check size={28} className="text-primary" />
              </div>
              <h1 className="mb-2 font-display text-2xl font-bold text-text-main">Cek Email Anda!</h1>
              <p className="mb-6 text-sm text-muted">
                Jika email <span className="font-medium text-text-main">{email}</span> terdaftar,
                kami sudah mengirimkan tautan reset password. Cek folder spam jika tidak muncul.
              </p>
              <Link href="/masuk"
                className="inline-flex w-full items-center justify-center rounded-xl bg-primary px-6 py-3 font-semibold text-white transition-colors hover:bg-primary-dark">
                Kembali ke Login
              </Link>
            </div>
          ) : (
            <>
              <h1 className="mb-1 font-display text-2xl font-bold text-text-main">Lupa Password</h1>
              <p className="mb-8 text-sm text-muted">
                Masukkan email akun Anda dan kami akan mengirimkan tautan untuk mereset password.
              </p>

              {error && (
                <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="email" className="mb-1 block text-sm font-medium text-text-main">
                    Alamat Email
                  </label>
                  <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@contoh.com" required
                    className="w-full rounded-xl border border-border-main bg-white px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" />
                </div>
                <button type="submit" disabled={loading}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 font-semibold text-white transition-colors hover:bg-primary-dark disabled:opacity-60">
                  {loading ? <><Loader2 size={16} className="animate-spin" /> Mengirim…</> : "Kirim Tautan Reset"}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
