import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { serverFetch } from "@/lib/api";
import ArticleCard from "@/components/ui/ArticleCard";

interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  color_hex: string;
  article_count?: number;
}

interface ArticleItem {
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
  category: { id: string; name: string; slug: string; color_hex: string };
  author: { id: string; username: string; display_name: string; avatar_url: string | null; role: string } | null;
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const res = await serverFetch<CategoryItem[]>("/articles/categories", { cache: "no-store" });
  const cats = res.success ? res.data : [];
  const cat = cats.find((c) => c.slug === params.slug);
  if (!cat) notFound();

  return {
    title: `Kategori: ${cat.name} — tcm.my.id`,
    description: cat.description ?? `Artikel TCM kategori ${params.slug}.`,
    alternates: { canonical: `/kategori/${params.slug}` },
  };
}

export default async function KategoriPage({ params }: { params: { slug: string } }) {
  // Fetch categories and articles matching the slug
  const [catRes, artRes] = await Promise.all([
    serverFetch<CategoryItem[]>("/articles/categories", { cache: "no-store" }),
    serverFetch<ArticleItem[]>(`/articles?category_slug=${params.slug}&per_page=30`, { cache: "no-store" }),
  ]);

  const categories = catRes.success ? catRes.data : [];
  const category = categories.find((c) => c.slug === params.slug);
  if (!category) notFound();

  const articles = artRes.success ? artRes.data : [];
  const hasCustomColor = !!category.color_hex?.trim();
  const headerStyle = hasCustomColor ? { backgroundColor: category.color_hex } : undefined;
  const headerClassName = hasCustomColor
    ? "mb-10 rounded-2xl p-8 text-white shadow-sm"
    : "mb-10 rounded-2xl bg-gradient-to-r from-primary to-primary-dark p-8 text-white shadow-sm";

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <Link href="/artikel" className="mb-4 inline-flex items-center gap-1 text-sm text-muted hover:text-primary">
        <ArrowLeft size={14} /> Kembali ke Artikel
      </Link>

      <header className={headerClassName} style={headerStyle}>
        <span className="inline-block rounded-full bg-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-wide">
          Kategori
        </span>
        <h1 className="mt-3 font-display text-3xl font-bold sm:text-4xl">{category.name}</h1>
        {category.description && (
          <p className="mt-2 max-w-2xl text-white/90">{category.description}</p>
        )}
        <div className="mt-3 text-sm text-white/80">{articles.length} artikel</div>
      </header>

      {articles.length > 0 ? (
        <div className="flex flex-col gap-4">
          {articles.map((a) => (
            <ArticleCard key={a.id} article={a as Parameters<typeof ArticleCard>[0]["article"]} variant="list" />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-border-main bg-white p-10 text-center">
          <p className="font-display text-xl font-semibold">Belum ada artikel di kategori ini</p>
        </div>
      )}
    </div>
  );
}
