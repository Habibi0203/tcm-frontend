import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Clock, Eye, Heart, ArrowLeft, AlertTriangle } from "lucide-react";
import { getArticleBySlug } from "@/mock/articles";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const article = getArticleBySlug(params.slug);
  return article
    ? {
        title: `${article.title} — tcm.my.id`,
        description: article.excerpt,
        openGraph: {
          title: article.title,
          description: article.excerpt,
          type: "article",
          images: article.thumbnail_url ? [{ url: article.thumbnail_url }] : undefined,
        },
      }
    : { title: "Artikel — tcm.my.id" };
}
import { mockComments } from "@/mock/stats";
import { formatDate } from "@/lib/utils";
import CategoryBadge from "@/components/ui/CategoryBadge";
import MemberBadge from "@/components/ui/MemberBadge";
import TranslateToggle from "@/components/ui/TranslateToggle";
import ArticleSidebar from "@/components/layout/ArticleSidebar";
import ArticleContent from "./ArticleContent";

interface PageProps {
  params: { slug: string };
  searchParams: { lang?: string };
}

export default function ArtikelDetailPage({ params, searchParams }: PageProps) {
  const article = getArticleBySlug(params.slug);
  if (!article) notFound();

  const lang = searchParams.lang === "en" ? "en" : "id";
  const comments = mockComments.filter((c) => c.article_id === article.id);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-2 text-sm text-muted">
        <Link href="/artikel" className="inline-flex items-center gap-1 hover:text-primary">
          <ArrowLeft size={14} /> Semua Artikel
        </Link>
        <span>/</span>
        <Link href={`/kategori/${article.category.slug}`} className="hover:text-primary">
          {article.category.name}
        </Link>
      </nav>

      <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
        <article>
          {/* Header */}
          <div className="mb-6 flex flex-wrap items-center gap-2">
            <CategoryBadge
              name={article.category.name}
              slug={article.category.slug}
              color={article.category.color_hex}
              size="md"
            />
            {article.access_tier === "premium" && (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-tcm px-3 py-1 text-xs font-semibold text-white">
                Premium
              </span>
            )}
            <TranslateToggle />
          </div>

          <h1 className="mb-4 font-display text-4xl font-bold leading-tight text-text-main sm:text-5xl">
            {article.title}
          </h1>

          <p className="mb-6 text-lg text-muted">{article.excerpt}</p>

          {/* Author + Meta */}
          <div className="mb-6 flex flex-wrap items-center gap-4 border-y border-border-main py-4">
            <div className="flex items-center gap-3">
              <Image
                src={article.author.avatar_url}
                alt={article.author.display_name}
                width={44}
                height={44}
                className="rounded-full"
              />
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-text-main">{article.author.display_name}</span>
                  {article.author.is_verified && (
                    <MemberBadge isVerified={true} tier="premium" />
                  )}
                </div>
                <div className="text-xs text-muted">{formatDate(article.published_at)}</div>
              </div>
            </div>
            <div className="ml-auto flex items-center gap-4 text-sm text-muted">
              <span className="flex items-center gap-1"><Clock size={14} />{article.read_time_minutes} min</span>
              <span className="flex items-center gap-1"><Eye size={14} />{article.view_count}</span>
              <span className="flex items-center gap-1"><Heart size={14} />{article.like_count}</span>
            </div>
          </div>

          {/* Disclaimer */}
          {article.has_disclaimer && (
            <div className="mb-6 flex gap-3 rounded-xl border border-amber-light bg-amber-light/30 p-4">
              <AlertTriangle className="flex-shrink-0 text-amber-tcm" size={18} />
              <div className="text-sm text-text-main">
                <strong className="font-semibold">Disclaimer Medis:</strong> Konten ini bersifat edukatif dan bukan pengganti konsultasi medis profesional. Selalu konsultasikan dengan praktisi TCM berlisensi untuk kondisi kesehatan Anda.
              </div>
            </div>
          )}

          {/* Cover */}
          <div className="relative mb-8 aspect-[16/9] overflow-hidden rounded-2xl bg-gray-100">
            <Image
              src={article.thumbnail_url}
              alt={article.title}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 768px"
              className="object-cover"
            />
          </div>

          {/* Content */}
          <ArticleContent
            contentId={article.content_id}
            contentEn={article.content_en}
            lang={lang}
            accessTier={article.access_tier}
            title={article.title}
          />

          {/* Tags */}
          <div className="mt-8 flex flex-wrap gap-2">
            {article.tags.map((t) => (
              <span key={t} className="rounded-full bg-surface px-3 py-1 text-xs text-muted">
                #{t}
              </span>
            ))}
          </div>

          {/* Comments */}
          <section className="mt-12 border-t border-border-main pt-8">
            <h2 className="mb-6 font-display text-2xl font-bold">
              Diskusi ({article.comment_count})
            </h2>
            <div className="space-y-5">
              {comments.map((c) => (
                <div key={c.id} className="flex gap-3">
                  <Image src={c.author.avatar_url} alt={c.author.display_name} width={40} height={40} className="rounded-full" />
                  <div className="flex-1">
                    <div className="rounded-2xl bg-surface p-4">
                      <div className="mb-1 flex items-center gap-2 text-sm">
                        <span className="font-medium text-text-main">{c.author.display_name}</span>
                        <span className="text-xs text-muted">{formatDate(c.created_at)}</span>
                      </div>
                      <p className="text-sm text-text-main">{c.content}</p>
                    </div>
                    <div className="mt-2 flex items-center gap-3 px-2 text-xs text-muted">
                      <button className="flex items-center gap-1 hover:text-primary">
                        <Heart size={12} /> {c.like_count}
                      </button>
                      <button className="hover:text-primary">Balas</button>
                    </div>
                    {c.replies && c.replies.length > 0 && (
                      <div className="mt-3 space-y-3 pl-4">
                        {c.replies.map((r) => (
                          <div key={r.id} className="flex gap-3">
                            <Image src={r.author.avatar_url} alt={r.author.display_name} width={32} height={32} className="rounded-full" />
                            <div className="flex-1">
                              <div className="rounded-2xl bg-white p-3 border border-border-main">
                                <div className="mb-1 flex items-center gap-2 text-sm">
                                  <span className="font-medium">{r.author.display_name}</span>
                                  <span className="text-xs text-muted">{formatDate(r.created_at)}</span>
                                </div>
                                <p className="text-sm">{r.content}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {comments.length === 0 && (
                <p className="text-sm text-muted">Belum ada komentar. Jadilah yang pertama!</p>
              )}
            </div>

            <form className="mt-8 rounded-2xl border border-border-main bg-white p-4">
              <textarea
                placeholder="Tulis komentar Anda..."
                rows={3}
                className="w-full resize-none rounded-lg border border-border-main p-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              <div className="mt-3 flex justify-end">
                <button type="button" className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-white hover:bg-primary-dark">
                  Kirim Komentar
                </button>
              </div>
            </form>
          </section>
        </article>

        {/* Sidebar */}
        <div className="hidden lg:block">
          <div className="sticky top-24">
            <ArticleSidebar />
          </div>
        </div>
      </div>
    </div>
  );
}
