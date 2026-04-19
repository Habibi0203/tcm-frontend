"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { Lock, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { apiFetch } from "@/lib/api";

function ResetPasswordForm() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const token        = searchParams.get("token") ?? "";

  const [password,  setPassword]  = useState("");
  const [confirm,   setConfirm]   = useState("");
  const [loading,   setLoading]   = useState(false);
  const [success,   setSuccess]   = useState(false);
  const [error,     setError]     = useState("");
  const [fieldErrs, setFieldErrs] = useState<{ password?: string; confirm?: string }>({});

  if (!token) {
    return (
      <div className="text-center">
        <AlertCircle size={48} className="mx-auto mb-4 text-red-500" />
        <h1 className="mb-2 font-display text-2xl font-bold">Token Tidak Valid</h1>
        <p className="mb-6 text-sm text-muted">
          Tautan reset password tidak valid atau sudah kedaluwarsa.
        </p>
        <Link href="/lupa-password"
          className="inline-flex items-center justify-center rounded-xl bg-primary px-6 py-3 font-semibold text-white hover:bg-primary-dark">
          Minta Tautan Baru
        </Link>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const errs: typeof fieldErrs = {};
    if (!password) errs.password = "Password wajib diisi";
    else if (password.length < 8) errs.password = "Password minimal 8 karakter";
    else if (!/[a-zA-Z]/.test(password) || !/[0-9]/.test(password))
      errs.password = "Password harus mengandung huruf dan angka";
    if (confirm !== password) errs.confirm = "Konfirmasi password tidak cocok";
    if (Object.keys(errs).length > 0) { setFieldErrs(errs); return; }
    setFieldErrs({});
    setLoading(true);

    const result = await apiFetch<{ message: string }>("/auth/reset-password", {
      method: "POST",
      body: JSON.stringify({ token, new_password: password }),
    });

    setLoading(false);

    if (!result.success) {
      if (result.error.code === "NOT_FOUND") {
        setError("Token reset tidak valid atau sudah kedaluwarsa. Silakan minta tautan baru.");
      } else {
        setError(result.error.message ?? "Terjadi kesalahan. Coba lagi.");
      }
      return;
    }

    setSuccess(true);
    setTimeout(() => router.push("/masuk"), 3000);
  }

  if (success) {
    return (
      <div className="text-center">
        <CheckCircle size={48} className="mx-auto mb-4 text-primary" />
        <h1 className="mb-2 font-display text-2xl font-bold text-text-main">Password Berhasil Direset!</h1>
        <p className="mb-6 text-sm text-muted">
          Password Anda telah diperbarui. Anda akan diarahkan ke halaman login dalam 3 detik.
        </p>
        <Link href="/masuk"
          className="inline-flex items-center justify-center rounded-xl bg-primary px-6 py-3 font-semibold text-white hover:bg-primary-dark">
          Masuk Sekarang
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
        <Lock size={28} className="text-primary" />
      </div>
      <h1 className="mb-1 font-display text-2xl font-bold text-text-main">Reset Password</h1>
      <p className="mb-8 text-sm text-muted">Masukkan password baru untuk akun Anda.</p>

      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
          {error.includes("baru") && (
            <div className="mt-2">
              <Link href="/lupa-password" className="font-medium underline">Minta tautan baru →</Link>
            </div>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="password" className="mb-1 block text-sm font-medium text-text-main">
            Password Baru
          </label>
          <div className="relative">
            <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input id="password" type="password" value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min 8 karakter, huruf + angka"
              className="w-full rounded-xl border border-border-main bg-white py-3 pl-10 pr-4 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" />
          </div>
          {fieldErrs.password && <p className="mt-1 text-xs text-red-600">{fieldErrs.password}</p>}
        </div>

        <div>
          <label htmlFor="confirm" className="mb-1 block text-sm font-medium text-text-main">
            Konfirmasi Password
          </label>
          <div className="relative">
            <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input id="confirm" type="password" value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Ulangi password baru"
              className="w-full rounded-xl border border-border-main bg-white py-3 pl-10 pr-4 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" />
          </div>
          {fieldErrs.confirm && <p className="mt-1 text-xs text-red-600">{fieldErrs.confirm}</p>}
        </div>

        <button type="submit" disabled={loading}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 font-semibold text-white transition-colors hover:bg-primary-dark disabled:opacity-60">
          {loading ? <><Loader2 size={16} className="animate-spin" /> Menyimpan…</> : "Simpan Password Baru"}
        </button>
      </form>
    </>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-border-main bg-white p-8 shadow-sm">
          <Suspense fallback={<div className="h-64 animate-pulse rounded-xl bg-surface" />}>
            <ResetPasswordForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
