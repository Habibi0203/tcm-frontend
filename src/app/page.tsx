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
import { serverFetch } from "@/lib/api";
import ArticleCard from "@/components/ui/ArticleCard";

// Shape returned by GET /api/articles (list item)
interface ArticleListItem {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  thumbnail_url: string | null;
  access_tier: "free" | "premium";
  view_count: number;
  like_count: number;
  comment_count: number;
  published_at: string | null;
  tags: string[];
  read_time_minutes?: number;
  author_type?: string;
  category: {
    id: string;
    name: string;
    slug: string;
    color_hex: string;
  };
  author: {
    id: string;
    username: string;
    display_name: string;
    avatar_url: string | null;
    role: string;
  } | null;
}

interface SubforumItem {
  id: string;
  name: string;
  slug: string;
  description: string;
  access_tier: "free" | "premium";
  thread_count: number;
  last_activity_at: string | null;
}

interface StatsData {
  total_articles: number;
  total_members: number;
  active_subforums: number;
  verified_practitioners: number;
}

export default async function HomePage() {
  // Fetch real data from backend (all in parallel)
  const [articlesRes, subforumsRes, statsRes] = await Promise.all([
    serverFetch<ArticleListItem[]>("/articles?sort=newest&per_page=6"),
    serverFetch<SubforumItem[]>("/subforums"),
    serverFetch<StatsData>("/stats"),
  ]);

  const latestArticles = articlesRes.success ? articlesRes.data : [];
  const totalArticles = articlesRes.success ? (articlesRes.meta?.total ?? articlesRes.data.length) : 0;
  const subforums = subforumsRes.success ? subforumsRes.data : [];
  const stats: StatsData = statsRes.success
    ? statsRes.data
    : {
        total_articles: totalArticles,
        total_members: 0,
        active_subforums: subforums.length,
        verified_practitioners: 0,
      };

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
          <StatCard icon={<BookOpen size={22} />} value={stats.total_articles} label="Artikel" />
          <StatCard icon={<Users size={22} />} value={stats.total_members} label="Member" />
          <StatCard icon={<MessageCircle size={22} />} value={stats.active_subforums || subforums.length} label="Subforum Aktif" />
          <StatCard icon={<Stethoscope size={22} />} value={stats.verified_practitioners} label="Praktisi Terverifikasi" />
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
        {latestArticles.length > 0 ? (
          <div className="flex flex-col gap-4">
            {latestArticles.map((a) => (
              <ArticleCard key={a.id} article={a as Parameters<typeof ArticleCard>[0]["article"]} variant="list" />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-border-main bg-white p-10 text-center">
            <p className="text-muted">Belum ada artikel tersedia.</p>
          </div>
        )}
      </section>

      {/* Subforums preview */}
      {subforums.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <h2 className="font-display text-3xl font-bold text-text-main">Forum Komunitas</h2>
              <p className="mt-1 text-muted">Bergabung dalam percakapan komunitas</p>
            </div>
            <Link href="/forum" className="hidden items-center gap-1 text-sm font-medium text-primary hover:text-primary-dark sm:inline-flex">
              Ke Forum <ArrowRight size={16} />
            </Link>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {subforums.slice(0, 4).map((s) => (
              <Link key={s.id} href={`/forum/${s.slug}`}
                className="group rounded-xl border border-border-main bg-card p-5 transition-all hover:border-primary hover:shadow-md">
                <h3 className="font-display text-lg font-semibold text-text-main group-hover:text-primary">{s.name}</h3>
                <p className="mt-1 text-sm text-muted line-clamp-2">{s.description}</p>
                <div className="mt-3 text-xs text-muted">{s.thread_count} thread</div>
              </Link>
            ))}
          </div>
        </section>
      )}

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
