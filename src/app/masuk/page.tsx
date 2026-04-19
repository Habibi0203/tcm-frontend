"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Mail, Lock } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { checkCredentials } from "@/mock/users";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function MasukPage() {
  const router = useRouter();
  const { login } = useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const nextErrors: typeof errors = {};
    if (!email) nextErrors.email = "Email wajib diisi";
    else if (!isValidEmail(email)) nextErrors.email = "Format email tidak valid";
    if (!password) nextErrors.password = "Password wajib diisi";
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }
    setErrors({});
    setLoading(true);
    setTimeout(() => {
      const user = checkCredentials(email, password);
      if (!user) {
        setErrors({ general: "Email atau password salah" });
        setLoading(false);
        return;
      }
      login(user);
      router.push("/dashboard");
    }, 800);
  };

  const handleGoogle = () => {
    alert("Segera hadir");
  };

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md items-center px-4 py-10">
      <div className="w-full rounded-2xl border border-border-main bg-white p-8 shadow-sm">
        <h1 className="mb-2 font-display text-3xl font-bold">Masuk</h1>
        <p className="mb-6 text-sm text-muted">Lanjutkan perjalanan TCM Anda.</p>

        {errors.general && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {errors.general}
          </div>
        )}

        <button
          type="button"
          onClick={handleGoogle}
          className="mb-4 flex w-full items-center justify-center gap-2 rounded-lg border border-border-main bg-white py-2.5 text-sm font-medium hover:bg-surface"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.25 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC04" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.83z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.83C6.71 7.31 9.14 5.38 12 5.38z"/>
          </svg>
          Masuk dengan Google
        </button>

        <div className="mb-4 flex items-center gap-3 text-xs text-muted">
          <div className="h-px flex-1 bg-border-main" />
          <span>atau</span>
          <div className="h-px flex-1 bg-border-main" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div>
            <label className="mb-1 block text-sm font-medium">Email</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-border-main bg-white py-2.5 pl-10 pr-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="email@example.com"
              />
            </div>
            {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Password</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-border-main bg-white py-2.5 pl-10 pr-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="Password kamu"
              />
            </div>
            {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password}</p>}
          </div>
          <div className="text-right text-xs">
            <Link href="/lupa-password" className="text-primary hover:text-primary-dark">
              Lupa password?
            </Link>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-primary py-2.5 font-semibold text-white transition-colors hover:bg-primary-dark disabled:opacity-60"
          >
            {loading ? "Masuk..." : "Masuk"}
          </button>
        </form>

        <div className="mt-6 rounded-lg bg-surface p-3 text-xs text-muted">
          <strong className="block mb-1 text-text-main">Akun Seed (staging):</strong>
          <div className="space-y-0.5">
            <div><code className="text-primary">user@tcm.my.id</code> — User@tcm2026</div>
            <div><code className="text-primary">moderator@tcm.my.id</code> — Mod@tcm2026</div>
            <div><code className="text-primary">admin@tcm.my.id</code> — Admin@tcm2026</div>
            <div><code className="text-primary">superadmin@tcm.my.id</code> — SuperAdmin@2026!</div>
          </div>
        </div>

        <p className="mt-6 text-center text-sm text-muted">
          Belum punya akun?{" "}
          <Link href="/daftar" className="font-medium text-primary hover:text-primary-dark">
            Daftar gratis
          </Link>
        </p>
      </div>
    </div>
  );
}
