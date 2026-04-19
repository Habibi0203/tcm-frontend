"use client";

import Link from "next/link";
import { useState } from "react";

const templates = [
  { slug: "selamat-datang",  label: "Selamat Datang",     desc: "Dikirim setelah registrasi berhasil",          icon: "🌿",
    payload: { data: { name: "Member Demo" } } },
  { slug: "reset-password",  label: "Reset Password",     desc: "Link reset password (berlaku 1 jam)",          icon: "🔐",
    payload: { data: { name: "Member Demo", resetUrl: "https://tcm.my.id/reset-password?token=demo123" } } },
  { slug: "premium-aktif",   label: "Premium Aktif",      desc: "Konfirmasi upgrade ke membership premium",     icon: "👑",
    payload: { data: { name: "Member Demo", plan: "Premium Tahunan", startDate: "19 Apr 2026", expiryDate: "19 Apr 2027" } } },
  { slug: "balasan-thread",  label: "Notifikasi Balasan", desc: "Ada balasan baru pada thread Anda",            icon: "💬",
    payload: { data: { recipientName: "Member Demo", threadTitle: "Pengalaman konsumsi Bai Zhu untuk pencernaan", threadUrl: "https://tcm.my.id/forum/diskusi-umum/thr_001", replierName: "Rina Andriani", replierInitials: "RA", replierRole: "Praktisi TCM", replySnippet: "Saya sudah menggunakannya selama 3 bulan untuk gangguan pencernaan kronis...", subforumName: "Diskusi Umum TCM" } } },
];

export default function EmailIndexPage() {
  const [testEmail, setTestEmail] = useState("");
  const [sending, setSending] = useState<string | null>(null);
  const [results, setResults] = useState<Record<string, { ok: boolean; msg: string }>>({});

  async function sendTest(t: typeof templates[0]) {
    if (!testEmail.includes("@")) { alert("Masukkan email tujuan yang valid"); return; }
    setSending(t.slug);
    try {
      const res = await fetch("/api/email/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ template: t.slug, to: { email: testEmail, name: "Member Demo" }, ...t.payload }),
      });
      const json = await res.json();
      setResults(prev => ({
        ...prev,
        [t.slug]: res.ok ? { ok: true, msg: `✓ Terkirim! ID: ${json.messageId}` } : { ok: false, msg: `✗ ${json.error}` },
      }));
    } catch (e) {
      setResults(prev => ({ ...prev, [t.slug]: { ok: false, msg: `✗ ${String(e)}` } }));
    } finally {
      setSending(null);
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-4">
      <div className="mb-6 rounded-2xl bg-white p-8 shadow-md">
        <h1 className="mb-1 text-2xl font-bold text-gray-900">Template Email Transaksional</h1>
        <p className="mb-5 text-sm text-gray-500">Preview & kirim test email via Brevo ke alamat pilihan.</p>
        <div className="flex gap-2">
          <input
            type="email"
            value={testEmail}
            onChange={e => setTestEmail(e.target.value)}
            placeholder="Email tujuan test (e.g. kamu@gmail.com)"
            className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-green-500 focus:outline-none"
          />
        </div>
      </div>

      <div className="space-y-3">
        {templates.map((t) => (
          <div key={t.slug} className="rounded-xl bg-white shadow-sm overflow-hidden">
            <div className="flex items-center gap-4 px-5 py-4">
              <span className="text-3xl">{t.icon}</span>
              <div className="flex-1">
                <div className="font-semibold text-gray-900">{t.label}</div>
                <div className="text-sm text-gray-500">{t.desc}</div>
                {results[t.slug] && (
                  <div className={`mt-1 text-xs ${results[t.slug].ok ? "text-green-600" : "text-red-500"}`}>
                    {results[t.slug].msg}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Link href={`/email/${t.slug}`} className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-50">
                  Preview
                </Link>
                <button
                  onClick={() => sendTest(t)}
                  disabled={sending === t.slug}
                  className="rounded-lg bg-green-700 px-3 py-1.5 text-xs font-medium text-white hover:bg-green-800 disabled:opacity-50"
                >
                  {sending === t.slug ? "Mengirim…" : "Kirim Test"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-xl bg-gray-800 px-5 py-4 font-mono text-xs text-gray-300">
        <div className="mb-2 text-gray-400">{/* Contoh penggunaan API route: */}</div>
        <div className="text-green-400">POST /api/email/send</div>
        <div className="mt-1 text-gray-300">{`{ "template": "selamat-datang", "to": { "email": "user@example.com" }, "data": { "name": "Budi" } }`}</div>
      </div>
    </div>
  );
}
