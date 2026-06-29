import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Clock, Eye, Heart, ArrowLeft, AlertTriangle } from "lucide-react";
import { serverFetch } from "@/lib/api";
import { getArticleIllustrationUrl } from "@/lib/article-illustration";
import { formatDate } from "@/lib/utils";
import CategoryBadge from "@/components/ui/CategoryBadge";
import MemberBadge from "@/components/ui/MemberBadge";
import ArticleContent from "./ArticleContent";
import ArticleComments, { type ArticleCommentItem } from "./ArticleComments";

export const revalidate = 300;

interface ArticleDetail {
  id:            string;
  slug:          string;
  title:         string;
  seo_title?:    string | null;
  excerpt:       string | null;
  seo_description?: string | null;
  content?:      string;
  content_en?:   string | null;
  thumbnail_url: string | null;
  access_tier:   "free" | "premium";
  view_count:    number;
  like_count:    number;
  comment_count: number;
  published_at:  string | null;
  updated_at?:   string | null;
  has_disclaimer?: boolean;
  tags?:         string[] | { id: string; name: string; slug: string }[];
  read_time_minutes: number | null;
  category: { id?: string; name: string; slug: string; color_hex: string | null } | null;
  author:   { id: string; username: string; display_name: string; avatar_url: string | null; role: string; bio?: string | null; profession?: string | null; is_verified?: boolean; practitioner_verified?: boolean } | null;
}

interface PageProps {
  params: { slug: string };
  searchParams: { lang?: string };
}

function stripLegacyContentDisclaimer(text: string | null | undefined): string | null | undefined {
  if (!text) return text;

  return text
    .replace(/<p[^>]*>\s*---\s*<\/p>\s*<p[^>]*>\s*<em>\s*Disclaimer:[\s\S]*?<\/em>\s*<\/p>\s*$/i, "")
    .replace(/(?:\r?\n)\s*---\s*(?:\r?\n)+\s*\*?Disclaimer:[\s\S]*$/i, "")
    .trim();
}

async function getArticleBySlug(slug: string): Promise<ArticleDetail | null> {
  const detailRes = await serverFetch<ArticleDetail>(`/articles/${encodeURIComponent(slug)}`, {
    next: { revalidate: 300 },
  });
  if (detailRes.success) return detailRes.data;

  const listRes = await serverFetch<ArticleDetail[]>(`/articles?slug=${encodeURIComponent(slug)}`, {
    next: { revalidate: 300 },
  });
  if (!listRes.success) return null;
  return listRes.data.find((item) => item.slug === slug) ?? null;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const article = await getArticleBySlug(params.slug);
  if (!article) notFound();

  const seoTitle = article.seo_title?.trim() || article.title;
  const seoDescription = article.seo_description?.trim() || article.excerpt || undefined;
  const socialImage = article.thumbnail_url?.trim() || getArticleIllustrationUrl({
    title: article.title,
    categoryName: article.category?.name,
    categorySlug: article.category?.slug,
  });

  return {
    title: `${seoTitle} — tcm.my.id`,
    description: seoDescription,
    alternates: {
      canonical: `/artikel/${article.slug}`,
    },
    openGraph: {
      title:       seoTitle,
      description: seoDescription,
      type:        "article",
      url:         `https://tcm.my.id/artikel/${article.slug}`,
      siteName:    "tcm.my.id",
      images:      [{ url: socialImage }],
      publishedTime: article.published_at ?? undefined,
      modifiedTime: article.updated_at ?? article.published_at ?? undefined,
      authors: article.author ? [article.author.display_name] : undefined,
      section: article.category?.name ?? undefined,
      tags: Array.isArray(article.tags)
        ? article.tags.map((tag) => (typeof tag === "string" ? tag : tag.name))
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: seoTitle,
      description: seoDescription,
      images: [socialImage],
    },
  };
}

export default async function ArtikelDetailPage({ params, searchParams }: PageProps) {
  const article = await getArticleBySlug(params.slug);

  if (!article) notFound();
  const commentsRes = await serverFetch<ArticleCommentItem[]>(`/articles/${article.id}/comments`);
  const comments = commentsRes.success ? commentsRes.data : [];
  const lang = searchParams.lang === "en" ? "en" : "id";

  const cleanContent = stripLegacyContentDisclaimer(article.content ?? article.excerpt ?? "") ?? "";
  const cleanContentEn = stripLegacyContentDisclaimer(article.content_en ?? null) ?? null;
  const articleUrl = `https://tcm.my.id/artikel/${article.slug}`;
  const illustrationUrl = article.thumbnail_url?.trim() || getArticleIllustrationUrl({
    title: article.title,
    categoryName: article.category?.name,
    categorySlug: article.category?.slug,
  });
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.seo_title?.trim() || article.title,
    description: article.seo_description?.trim() || article.excerpt || undefined,
    image: [illustrationUrl],
    datePublished: article.published_at ?? undefined,
    dateModified: article.updated_at ?? article.published_at ?? undefined,
    mainEntityOfPage: articleUrl,
    articleSection: article.category?.name ?? undefined,
    keywords: Array.isArray(article.tags)
      ? article.tags.map((tag) => (typeof tag === "string" ? tag : tag.name)).join(", ")
      : undefined,
    author: article.author
      ? {
          "@type": "Person",
          name: article.author.display_name,
          url: `https://tcm.my.id/profil/${article.author.username}`,
        }
      : undefined,
    publisher: {
      "@type": "Organization",
      name: "tcm.my.id",
      url: "https://tcm.my.id",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-2 text-sm text-muted">
        <Link href="/artikel" className="inline-flex items-center gap-1 hover:text-primary">
          <ArrowLeft size={14} /> Semua Artikel
        </Link>
        <span>/</span>
        {article.category && (
          <Link href={`/kategori/${article.category.slug}`} className="hover:text-primary">
            {article.category.name}
          </Link>
        )}
      </nav>

      <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
        <article>
          {/* Header */}
          <div className="mb-6 flex flex-wrap items-center gap-2">
            {article.category && (
              <CategoryBadge
                name={article.category.name}
                slug={article.category.slug}
                color={article.category.color_hex ?? "#888888"}
              />
            )}
            {article.access_tier === "premium" && (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-light px-2.5 py-0.5 text-xs font-semibold text-amber-tcm">
                🔒 Akses Khusus
              </span>
            )}
          </div>

          <h1 className="mb-4 font-display text-3xl font-bold leading-snug text-text-main md:text-4xl">
            {article.title}
          </h1>

          {/* Meta */}
          <div className="mb-6 flex flex-wrap items-center gap-4 text-sm text-muted">
            {article.author && (
              <div className="flex items-center gap-2">
                {article.author.avatar_url ? (
                  <Image src={article.author.avatar_url} alt={article.author.display_name} width={28} height={28} className="rounded-full" />
                ) : (
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary-light text-xs font-bold text-primary">
                    {article.author.display_name[0]}
                  </div>
                )}
                <Link href={`/profil/${article.author.username}`} className="font-medium hover:text-primary">
                  {article.author.display_name}
                </Link>
                <MemberBadge role={article.author.role as "member" | "moderator" | "admin" | "superadmin"} isVerified={article.author.practitioner_verified ?? article.author.is_verified} />
              </div>
            )}
            {article.published_at && (
              <span className="flex items-center gap-1">
                <Clock size={14} /> {formatDate(article.published_at)}
              </span>
            )}
            <span className="flex items-center gap-1"><Eye size={14} /> {article.view_count}</span>
            <span className="flex items-center gap-1"><Heart size={14} /> {article.like_count}</span>
          </div>

          {/* Thumbnail */}
          <div className="mb-8 aspect-video overflow-hidden rounded-2xl bg-surface">
            <Image src={illustrationUrl} alt={article.title} width={800} height={450} className="h-full w-full object-cover" />
          </div>

          {/* Editorial transparency */}
          <div className="mb-6 rounded-2xl border border-sky-200 bg-sky-50/70 p-4">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center rounded-full border border-sky-200 bg-white px-2.5 py-1 text-xs font-semibold text-sky-700">
                AI-assisted editorial
              </span>
            </div>
            <p className="text-sm leading-relaxed text-text-main">
              Konten ini disusun dengan bantuan AI dan melalui pemeriksaan editorial otomatis untuk konsistensi bahasa, batas klaim, dan pengingat disclaimer medis.
            </p>
          </div>

          {/* Tags */}
          {(article.tags ?? []).length > 0 && (
            <div className="mb-6 flex flex-wrap gap-2">
              {(article.tags ?? []).map((tag) => {
                const tagName = typeof tag === "string" ? tag : tag.name;
                const tagKey = typeof tag === "string" ? tag : tag.id;
                return (
                  <Link key={tagKey} href={`/tag/${typeof tag === "string" ? tag : tag.slug}`} className="rounded-full border border-border-main bg-surface px-3 py-1 text-xs text-muted hover:border-primary hover:text-primary">
                    #{tagName}
                  </Link>
                );
              })}
            </div>
          )}

          {/* Content */}
          <ArticleContent
            content={cleanContent}
            contentEn={cleanContentEn}
            lang={lang}
            accessTier={article.access_tier}
            title={article.title}
          />

          {/* Disclaimer */}
          {article.has_disclaimer && (
            <details className="mt-8 rounded-xl border border-amber-300/50 bg-amber-light/40 px-4 py-3 text-sm text-text-main">
              <summary className="flex cursor-pointer list-none items-center gap-2 font-semibold text-amber-tcm marker:hidden">
                <AlertTriangle size={16} className="shrink-0" />
                Disclaimer
              </summary>
              <p className="mt-3 leading-relaxed text-text-main">
                Artikel ini bersifat informatif dan bukan pengganti diagnosis atau terapi individual. Untuk keputusan kesehatan pribadi, konsultasikan dengan praktisi TCM yang kompeten atau tenaga kesehatan sesuai kebutuhan Anda.
              </p>
            </details>
          )}

          <ArticleComments articleId={article.id} initialComments={comments} />
        </article>

        <aside>
          {/* Sidebar temporarily disabled while backend article routes are inconsistent and causing false 404 UI in streamed payloads */}
        </aside>
      </div>
    </div>
    </>
  );
}
