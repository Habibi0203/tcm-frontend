import type { Metadata } from "next";
import Link from "next/link";
import { MessageCircle, Lock, ArrowRight, ShieldAlert } from "lucide-react";
import { serverFetch } from "@/lib/api";
import { formatRelativeTime } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Forum Diskusi — tcm.my.id",
  description: "Diskusi TCM bersama komunitas.",
  alternates: { canonical: "/forum" },
};

interface Subforum {
  id:               string;
  name:             string;
  slug:             string;
  description:      string;
  access_tier:      "free" | "premium";
  thread_count:     number;
  last_activity_at: string | null;
}

export default async function ForumPage() {
  const res = await serverFetch<Subforum[]>("/subforums");
  const subforums = res.success ? res.data : [];

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="mb-8">
        <h1 className="font-display text-4xl font-bold text-text-main">Forum Komunitas</h1>
        <p className="mt-2 text-muted">Tempat bertukar pikiran, bertanya, dan berbagi pengalaman seputar TCM.</p>
      </header>

      <section className="mb-6 rounded-2xl border border-amber-200 bg-amber-light/30 p-5 text-sm text-text-main">
        <div className="flex gap-3">
          <ShieldAlert size={22} className="mt-0.5 shrink-0 text-amber-tcm" />
          <div>
            <p className="font-semibold">Sebelum berdiskusi</p>
            <p className="mt-1 text-muted">
              Forum ini untuk edukasi dan berbagi pengalaman, bukan diagnosis atau pengganti konsultasi medis.
              Hindari klaim menyembuhkan, ajakan menghentikan terapi dokter, dan promosi produk tanpa dasar yang jelas.
            </p>
            <div className="mt-3 flex flex-wrap gap-3 text-xs font-medium text-primary">
              <Link href="/pedoman-komunitas" className="hover:underline">Pedoman komunitas</Link>
              <Link href="/aturan-jual-beli" className="hover:underline">Aturan jual beli</Link>
              <Link href="/disclaimer-medis" className="hover:underline">Disclaimer medis</Link>
            </div>
          </div>
        </div>
      </section>

      {subforums.length === 0 ? (
        <div className="rounded-xl border border-border-main bg-white p-10 text-center">
          <p className="font-display text-xl font-semibold">Forum belum tersedia</p>
          <p className="mt-2 text-sm text-muted">Silakan coba beberapa saat lagi.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {subforums.map((s) => (
            <Link key={s.id} href={`/forum/${s.slug}`}
              className="group rounded-xl border border-border-main bg-card p-6 transition-all hover:border-primary hover:shadow-md">
              <div className="mb-3 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-light text-primary">
                  <MessageCircle size={20} />
                </div>
                <div className="flex-1">
                  <h2 className="font-display text-xl font-semibold text-text-main group-hover:text-primary">
                    {s.name}
                  </h2>
                </div>
                {s.access_tier === "premium" && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-light px-2 py-0.5 text-xs font-semibold text-amber-tcm">
                    <Lock size={10} /> Akses Khusus
                  </span>
                )}
              </div>
              <p className="mb-4 text-sm text-muted">{s.description}</p>
              {s.slug === "fjb" && (
                <div className="mb-4 rounded-lg border border-amber-200 bg-amber-light/30 px-3 py-2 text-xs leading-relaxed text-amber-tcm">
                  Forum jual beli diawasi ketat. Klaim menyembuhkan penyakit, produk ilegal, dan transaksi menyesatkan dilarang.
                </div>
              )}
              <div className="flex items-center justify-between text-xs text-muted">
                <span>{s.thread_count} thread</span>
                <span>Aktivitas: {s.last_activity_at ? formatRelativeTime(s.last_activity_at) : "—"}</span>
              </div>
              <div className="mt-4 flex items-center gap-1 text-sm font-medium text-primary">
                Masuk Subforum <ArrowRight size={14} />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
