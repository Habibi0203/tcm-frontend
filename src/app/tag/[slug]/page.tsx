import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { serverFetch } from "@/lib/api";
import ArticleCard from "@/components/ui/ArticleCard";

interface TagItem { id: string; name: string; slug: string; article_count?: number }
interface ArticleItem {
  id: string; slug: string; title: string; excerpt: string | null; thumbnail_url: string | null;
  access_tier: "free" | "premium"; view_count: number; like_count: number; comment_count: number;
  published_at: string | null; tags: string[]; read_time_minutes?: number;
  category: { id: string; name: string; slug: string; color_hex: string };
  author: { id: string; username: string; display_name: string; avatar_url: string | null; role: string } | null;
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const tagRes = await serverFetch<TagItem[]>("/articles/tags", { next: { revalidate: 300 } });
  const tag = tagRes.success ? tagRes.data.find((t) => t.slug === params.slug) : null;
  if (!tag) return { title: `Tag ${params.slug} — tcm.my.id`, alternates: { canonical: `/tag/${params.slug}` } };
  return {
    title: `Tag: ${tag.name} — tcm.my.id`,
    description: `Kumpulan artikel TCM dengan tag ${tag.name}.`,
    alternates: { canonical: `/tag/${tag.slug}` },
  };
}

export default async function TagPage({ params }: { params: { slug: string } }) {
  const [tagRes, artRes] = await Promise.all([
    serverFetch<TagItem[]>("/articles/tags", { next: { revalidate: 300 } }),
    serverFetch<ArticleItem[]>(`/articles?tag_slug=${params.slug}&per_page=30`, { next: { revalidate: 300 } }),
  ]);
  const tags = tagRes.success ? tagRes.data : [];
  const tag = tags.find((t) => t.slug === params.slug);
  if (!tag) notFound();
  const articles = artRes.success ? artRes.data : [];

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <Link href="/artikel" className="mb-4 inline-flex items-center gap-1 text-sm text-muted hover:text-primary">
        <ArrowLeft size={14} /> Kembali ke Artikel
      </Link>
      <header className="mb-10 rounded-2xl bg-gradient-to-r from-primary to-primary-dark p-8 text-white shadow-sm">
        <span className="inline-block rounded-full bg-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-wide">Tag</span>
        <h1 className="mt-3 font-display text-3xl font-bold sm:text-4xl">#{tag.name}</h1>
        <p className="mt-2 text-white/85">{articles.length} artikel dengan tag ini.</p>
      </header>
      {articles.length > 0 ? (
        <div className="flex flex-col gap-4">
          {articles.map((a) => <ArticleCard key={a.id} article={a as Parameters<typeof ArticleCard>[0]["article"]} variant="list" />)}
        </div>
      ) : (
        <div className="rounded-xl border border-border-main bg-white p-10 text-center">
          <p className="font-display text-xl font-semibold">Belum ada artikel untuk tag ini</p>
        </div>
      )}
    </div>
  );
}
