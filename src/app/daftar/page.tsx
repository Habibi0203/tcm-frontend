"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Mail, Lock, User as UserIcon, AtSign, UserCircle } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { apiFetch } from "@/lib/api";
import type { AuthUser } from "@/store/authStore";

type Form = {
  email:            string;
  username:         string;
  display_name:     string;
  password:         string;
  confirm_password: string;
  profession:       "general" | "practitioner" | "student";
};

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validate(form: Form): Partial<Record<keyof Form, string>> {
  const errs: Partial<Record<keyof Form, string>> = {};
  if (!form.email) errs.email = "Email wajib diisi";
  else if (!isValidEmail(form.email)) errs.email = "Format email tidak valid";

  if (!form.username) errs.username = "Username wajib diisi";
  else if (!/^[a-z0-9_]{3,20}$/.test(form.username))
    errs.username = "3-20 karakter, hanya huruf kecil, angka, underscore";

  if (!form.display_name) errs.display_name = "Nama wajib diisi";
  else if (form.display_name.length < 2 || form.display_name.length > 50)
    errs.display_name = "Nama harus 2-50 karakter";

  if (!form.password) errs.password = "Password wajib diisi";
  else if (form.password.length < 10)
    errs.password = "Password minimal 10 karakter";
  else if (form.password.length > 128)
    errs.password = "Password maksimal 128 karakter";
  else if (!/[a-z]/.test(form.password) || !/[A-Z]/.test(form.password) || !/[0-9]/.test(form.password))
    errs.password = "Password harus mengandung huruf kecil, huruf besar, dan angka";

  if (form.confirm_password !== form.password)
    errs.confirm_password = "Konfirmasi password tidak cocok";

  if (!form.profession) errs.profession = "Pilih profesi";
  return errs;
}

export default function DaftarPage() {
  const router = useRouter();
  const { login } = useAuthStore();
  const [form, setForm] = useState<Form>({
    email: "", username: "", display_name: "",
    password: "", confirm_password: "", profession: "general",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors]   = useState<Partial<Record<keyof Form | "general", string>>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate(form);
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);

    const result = await apiFetch<AuthUser & { access_token: string }>("/auth/register", {
      method: "POST",
      body: {
        email:        form.email,
        username:     form.username,
        display_name: form.display_name,
        password:     form.password,
        profession:   form.profession,
      },
    });

    setLoading(false);

    if (!result.success) {
      const fieldErrs = result.error.fields ?? {};
      if (Object.keys(fieldErrs).length > 0) {
        setErrors(fieldErrs as Partial<Record<keyof Form | "general", string>>);
      } else {
        setErrors({ general: result.error.message });
      }
      return;
    }

    const { access_token, ...user } = result.data;
    login(user as AuthUser, access_token);
    router.push("/dashboard");
  };

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md items-center px-4 py-10">
      <div className="w-full rounded-2xl border border-border-main bg-white p-8 shadow-sm">
        <h1 className="mb-2 font-display text-3xl font-bold">Daftar</h1>
        <p className="mb-6 text-sm text-muted">
          Bergabung gratis dengan komunitas TCM Indonesia.
        </p>

        <button
          type="button"
          onClick={() => alert("Segera hadir")}
          className="mb-4 flex w-full items-center justify-center gap-2 rounded-lg border border-border-main bg-white py-2.5 text-sm font-medium hover:bg-surface"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.25 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC04" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.83z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.83C6.71 7.31 9.14 5.38 12 5.38z"/>
          </svg>
          Daftar dengan Google
        </button>

        <div className="mb-4 flex items-center gap-3 text-xs text-muted">
          <div className="h-px flex-1 bg-border-main" />
          <span>atau</span>
          <div className="h-px flex-1 bg-border-main" />
        </div>

        {errors.general && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {errors.general}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div>
            <label className="mb-1 block text-sm font-medium">Email</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
              <input type="email" value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full rounded-lg border border-border-main bg-white py-2.5 pl-10 pr-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="email@example.com" />
            </div>
            {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Username</label>
            <div className="relative">
              <AtSign size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
              <input type="text" value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value.toLowerCase() })}
                className="w-full rounded-lg border border-border-main bg-white py-2.5 pl-10 pr-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="username_kamu" />
            </div>
            {errors.username && <p className="mt-1 text-xs text-red-600">{errors.username}</p>}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Nama Tampilan</label>
            <div className="relative">
              <UserIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
              <input type="text" value={form.display_name}
                onChange={(e) => setForm({ ...form, display_name: e.target.value })}
                className="w-full rounded-lg border border-border-main bg-white py-2.5 pl-10 pr-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="Nama kamu" />
            </div>
            {errors.display_name && <p className="mt-1 text-xs text-red-600">{errors.display_name}</p>}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Profesi</label>
            <div className="relative">
              <UserCircle size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
              <select value={form.profession}
                onChange={(e) => setForm({ ...form, profession: e.target.value as Form["profession"] })}
                className="w-full appearance-none rounded-lg border border-border-main bg-white py-2.5 pl-10 pr-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20">
                <option value="general">Umum</option>
                <option value="practitioner">Praktisi TCM</option>
                <option value="student">Mahasiswa TCM</option>
              </select>
            </div>
            {errors.profession && <p className="mt-1 text-xs text-red-600">{errors.profession}</p>}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Password</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
              <input type="password" value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full rounded-lg border border-border-main bg-white py-2.5 pl-10 pr-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="Min 10 karakter, huruf besar/kecil + angka" />
            </div>
            {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password}</p>}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Konfirmasi Password</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
              <input type="password" value={form.confirm_password}
                onChange={(e) => setForm({ ...form, confirm_password: e.target.value })}
                className="w-full rounded-lg border border-border-main bg-white py-2.5 pl-10 pr-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="Ulangi password" />
            </div>
            {errors.confirm_password && <p className="mt-1 text-xs text-red-600">{errors.confirm_password}</p>}
          </div>

          <button type="submit" disabled={loading}
            className="w-full rounded-lg bg-primary py-2.5 font-semibold text-white transition-colors hover:bg-primary-dark disabled:opacity-60">
            {loading ? "Mendaftar..." : "Daftar Gratis"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-muted">
          Sudah punya akun?{" "}
          <Link href="/masuk" className="font-medium text-primary hover:text-primary-dark">Masuk</Link>
        </p>
      </div>
    </div>
  );
}
