import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { mockCategories } from "@/mock/categories";
import { getArticlesByCategory } from "@/mock/articles";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const cat = mockCategories.find((c) => c.slug === params.slug);
  return {
    title: cat ? `Kategori: ${cat.name} — tcm.my.id` : "Kategori — tcm.my.id",
    description: cat?.description ?? `Artikel TCM kategori ${params.slug}.`,
  };
}
import ArticleCard from "@/components/ui/ArticleCard";

export default function KategoriPage({ params }: { params: { slug: string } }) {
  const category = mockCategories.find((c) => c.slug === params.slug);
  if (!category) notFound();
  const articles = getArticlesByCategory(params.slug);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <Link href="/artikel" className="mb-4 inline-flex items-center gap-1 text-sm text-muted hover:text-primary">
        <ArrowLeft size={14} /> Kembali ke Artikel
      </Link>

      <header
        className="mb-10 rounded-2xl p-8 text-white"
        style={{ backgroundColor: category.color_hex }}
      >
        <span className="inline-block rounded-full bg-white/20 px-3 py-1 text-xs font-semibold uppercase">
          Kategori
        </span>
        <h1 className="mt-3 font-display text-4xl font-bold">{category.name}</h1>
        <p className="mt-2 max-w-2xl text-white/90">{category.description}</p>
        <div className="mt-3 text-sm text-white/80">{articles.length} artikel</div>
      </header>

      {articles.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((a) => (
            <ArticleCard key={a.id} article={a} />
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
