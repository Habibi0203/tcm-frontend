import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "tcm.my.id — Komunitas Traditional Chinese Medicine Indonesia",
  description:
    "Platform komunitas TCM Indonesia. Edukasi, diskusi, dan sumber daya tepercaya tentang Traditional Chinese Medicine untuk pemula hingga praktisi.",
  openGraph: {
    title: "tcm.my.id — Komunitas TCM Indonesia",
    description: "Edukasi TCM berbasis bukti, forum diskusi, dan akses ke praktisi terverifikasi.",
    type: "website",
  },
};
import { ArrowRight, BookOpen, Users, MessageCircle, Stethoscope } from "lucide-react";
import { getLatestArticles } from "@/mock/articles";
import { mockCategories } from "@/mock/categories";
import { getLatestThreads } from "@/mock/threads";
import { mockPlatformStats } from "@/mock/stats";
import ArticleCard from "@/components/ui/ArticleCard";
import ThreadRow from "@/components/ui/ThreadRow";

export default function HomePage() {
  const latestArticles = getLatestArticles(6);
  const latestThreads = getLatestThreads(5);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary-light/40 to-surface">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-28">
          <div className="max-w-3xl">
            <span className="inline-block rounded-full bg-primary-light px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary-dark">
              Komunitas TCM Indonesia
            </span>
            <h1 className="mt-4 font-display text-4xl font-bold leading-tight text-text-main sm:text-5xl lg:text-6xl">
              Jalan Harmoni Menuju <span className="text-primary">Kesehatan Holistik</span>
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-muted">
              Pelajari Traditional Chinese Medicine dari dasar hingga lanjutan. Diskusi bersama komunitas,
              konsultasi dengan praktisi, dan temukan pendekatan holistik untuk tubuh, pikiran, dan jiwa.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/artikel"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-semibold text-white transition-colors hover:bg-primary-dark"
              >
                Mulai Membaca <ArrowRight size={18} />
              </Link>
              <Link
                href="/forum"
                className="inline-flex items-center gap-2 rounded-full border border-border-main bg-white px-6 py-3 font-semibold text-text-main transition-colors hover:bg-surface"
              >
                Bergabung di Forum
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-border-main bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-10 sm:px-6 md:grid-cols-4 lg:px-8">
          <StatCard icon={<BookOpen size={22} />} value={mockPlatformStats.total_articles} label="Artikel" />
          <StatCard icon={<Users size={22} />} value={mockPlatformStats.total_members} label="Member" />
          <StatCard icon={<MessageCircle size={22} />} value={mockPlatformStats.active_subforums} label="Subforum Aktif" />
          <StatCard icon={<Stethoscope size={22} />} value={mockPlatformStats.verified_practitioners} label="Praktisi Terverifikasi" />
        </div>
      </section>

      {/* Latest Articles */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="font-display text-3xl font-bold text-text-main">Artikel Terbaru</h2>
            <p className="mt-1 text-muted">Update mingguan dari tim editor dan praktisi kami</p>
          </div>
          <Link href="/artikel" className="hidden items-center gap-1 text-sm font-medium text-primary hover:text-primary-dark sm:inline-flex">
            Lihat Semua <ArrowRight size={16} />
          </Link>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {latestArticles.map((a) => (
            <ArticleCard key={a.id} article={a} />
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <h2 className="mb-8 font-display text-3xl font-bold text-text-main">Jelajahi Kategori</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {mockCategories.map((cat) => (
              <Link
                key={cat.id}
                href={`/kategori/${cat.slug}`}
                className="group rounded-xl border border-border-main bg-surface p-5 transition-all hover:border-primary hover:shadow-md"
              >
                <div
                  className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg text-white"
                  style={{ backgroundColor: cat.color_hex }}
                >
                  <span className="text-lg font-bold">{cat.name.charAt(0)}</span>
                </div>
                <h3 className="mb-1 font-display text-lg font-semibold text-text-main group-hover:text-primary">
                  {cat.name}
                </h3>
                <p className="line-clamp-2 text-sm text-muted">{cat.description}</p>
                <div className="mt-3 text-xs text-muted">{cat.article_count} artikel</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Threads */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="font-display text-3xl font-bold text-text-main">Diskusi Terbaru</h2>
            <p className="mt-1 text-muted">Bergabung dalam percakapan komunitas</p>
          </div>
          <Link href="/forum" className="hidden items-center gap-1 text-sm font-medium text-primary hover:text-primary-dark sm:inline-flex">
            Ke Forum <ArrowRight size={16} />
          </Link>
        </div>
        <div className="space-y-3">
          {latestThreads.map((t) => (
            <ThreadRow key={t.id} thread={t} />
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-gradient-to-r from-primary to-primary-dark p-10 text-white sm:p-14">
          <h2 className="font-display text-3xl font-bold sm:text-4xl">
            Mulai Perjalanan TCM Anda Hari Ini
          </h2>
          <p className="mt-3 max-w-2xl text-white/90">
            Daftar gratis dan dapatkan akses ke artikel edukatif, forum diskusi, dan komunitas yang mendukung.
            Upgrade kapan saja untuk akses premium.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/daftar"
              className="rounded-full bg-white px-6 py-3 font-semibold text-primary-dark transition-colors hover:bg-surface"
            >
              Daftar Gratis
            </Link>
            <Link
              href="/tentang"
              className="rounded-full border border-white/40 bg-white/10 px-6 py-3 font-semibold text-white transition-colors hover:bg-white/20"
            >
              Pelajari Lebih Lanjut
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

function StatCard({ icon, value, label }: { icon: React.ReactNode; value: number; label: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary-light text-primary">
        {icon}
      </div>
      <div>
        <div className="font-display text-2xl font-bold text-text-main">{value.toLocaleString("id-ID")}</div>
        <div className="text-sm text-muted">{label}</div>
      </div>
    </div>
  );
}
