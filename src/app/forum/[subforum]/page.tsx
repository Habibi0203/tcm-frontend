import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Lock, Plus, ShieldAlert } from "lucide-react";
import { serverFetch } from "@/lib/api";
import ThreadRow from "@/components/ui/ThreadRow";

export async function generateMetadata({ params }: { params: { subforum: string } }): Promise<Metadata> {
  const res = await serverFetch<{ name: string; description: string }>(`/subforums/${params.subforum}`, {
    cache: "no-store",
  });
  const sf  = res.success ? res.data : null;
  if (!sf) notFound();

  return {
    title: `${sf.name} — Forum tcm.my.id`,
    description: sf.description ?? "Forum diskusi TCM Indonesia.",
    alternates: { canonical: `/forum/${params.subforum}` },
  };
}

interface Subforum {
  id:           string;
  name:         string;
  slug:         string;
  description:  string;
  access_tier:  "free" | "premium";
  thread_count: number;
  last_activity_at: string | null;
}

interface ThreadItem {
  id:           string;
  title:        string;
  is_pinned:    boolean;
  is_locked:    boolean;
  view_count:   number;
  reply_count:  number;
  last_reply_at: string | null;
  created_at:   string;
  subforum:     { id: string; name: string; slug: string };
  author:       { id: string; username: string; display_name: string; avatar_url: string | null; role: string } | null;
}

export default async function SubforumPage({ params }: { params: { subforum: string } }) {
  const [sfRes, threadsRes] = await Promise.all([
    serverFetch<Subforum>(`/subforums/${params.subforum}`),
    serverFetch<ThreadItem[]>(`/subforums/${params.subforum}/threads`),
  ]);

  if (!sfRes.success) notFound();
  const subforum = sfRes.data;
  const threads  = threadsRes.success ? threadsRes.data : [];

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <Link href="/forum" className="mb-4 inline-flex items-center gap-1 text-sm text-muted hover:text-primary">
        <ArrowLeft size={14} /> Semua Subforum
      </Link>

      <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2">
            {subforum.access_tier === "premium" && (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-light px-2 py-0.5 text-xs font-semibold text-amber-tcm">
                <Lock size={10} /> Akses Khusus
              </span>
            )}
          </div>
          <h1 className="font-display text-3xl font-bold text-text-main sm:text-4xl">{subforum.name}</h1>
          <p className="mt-2 text-muted">{subforum.description}</p>
        </div>
        <Link href={`/forum/${params.subforum}/baru`}
          className="inline-flex items-center gap-2 self-start rounded-full bg-primary px-5 py-2.5 font-semibold text-white hover:bg-primary-dark">
          <Plus size={16} /> Thread Baru
        </Link>
      </header>

      {subforum.slug === "fjb" ? (
        <section className="mb-6 rounded-2xl border border-amber-200 bg-amber-light/30 p-5 text-sm text-text-main">
          <div className="flex gap-3">
            <ShieldAlert size={22} className="mt-0.5 shrink-0 text-amber-tcm" />
            <div>
              <p className="font-semibold">Aturan ketat Forum Jual Beli</p>
              <p className="mt-1 text-muted">
                Dilarang klaim menyembuhkan penyakit, menjual produk ilegal, memakai testimoni medis berlebihan,
                atau mengarahkan pengguna menghentikan terapi dokter. Transaksi antar pengguna menjadi tanggung jawab masing-masing pihak.
              </p>
              <Link href="/aturan-jual-beli" className="mt-2 inline-block text-xs font-medium text-primary hover:underline">
                Baca aturan lengkap sebelum membuat thread
              </Link>
            </div>
          </div>
        </section>
      ) : (
        <section className="mb-6 rounded-2xl border border-border-main bg-card p-4 text-sm text-muted">
          Diskusi bersifat edukatif. Jangan membagikan data medis pribadi sensitif atau memberi diagnosis pasti tanpa pemeriksaan profesional.
          <Link href="/pedoman-komunitas" className="ml-1 font-medium text-primary hover:underline">Baca pedoman komunitas.</Link>
        </section>
      )}

      {threads.length > 0 ? (
        <div className="space-y-3">
          {threads.map((t) => (
            <ThreadRow key={t.id} thread={t as Parameters<typeof ThreadRow>[0]["thread"]} />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-border-main bg-white p-10 text-center">
          <p className="font-display text-xl font-semibold">Belum ada thread di subforum ini</p>
          <p className="mt-2 text-sm text-muted">Jadilah yang pertama memulai diskusi!</p>
        </div>
      )}
    </div>
  );
}
