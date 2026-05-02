import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Clock, Eye, Heart, ArrowLeft, AlertTriangle } from "lucide-react";
import { serverFetch } from "@/lib/api";
import { formatDate } from "@/lib/utils";
import CategoryBadge from "@/components/ui/CategoryBadge";
import MemberBadge from "@/components/ui/MemberBadge";
import ArticleContent from "./ArticleContent";
import ArticleComments, { type ArticleCommentItem } from "./ArticleComments";

interface ArticleDetail {
  id:            string;
  slug:          string;
  title:         string;
  excerpt:       string | null;
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
  author:   { id: string; username: string; display_name: string; avatar_url: string | null; role: string; bio?: string | null } | null;
}

interface PageProps {
  params: { slug: string };
  searchParams: { lang?: string };
}

async function getArticleBySlug(slug: string): Promise<ArticleDetail | null> {
  const detailRes = await serverFetch<ArticleDetail>(`/articles/${encodeURIComponent(slug)}`);
  if (detailRes.success) return detailRes.data;

  const listRes = await serverFetch<ArticleDetail[]>(`/articles?slug=${encodeURIComponent(slug)}`);
  if (!listRes.success) return null;
  return listRes.data.find((item) => item.slug === slug) ?? null;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const article = await getArticleBySlug(params.slug);
  return article
    ? {
        title: `${article.title} — tcm.my.id`,
        description: article.excerpt ?? undefined,
        alternates: {
          canonical: `/artikel/${article.slug}`,
        },
        openGraph: {
          title:       article.title,
          description: article.excerpt ?? undefined,
          type:        "article",
          url:         `https://tcm.my.id/artikel/${article.slug}`,
          siteName:    "tcm.my.id",
          images:      article.thumbnail_url ? [{ url: article.thumbnail_url }] : undefined,
          publishedTime: article.published_at ?? undefined,
          modifiedTime: article.updated_at ?? article.published_at ?? undefined,
          authors: article.author ? [article.author.display_name] : undefined,
          section: article.category?.name ?? undefined,
          tags: Array.isArray(article.tags)
            ? article.tags.map((tag) => (typeof tag === "string" ? tag : tag.name))
            : undefined,
        },
        twitter: {
          card: article.thumbnail_url ? "summary_large_image" : "summary",
          title: article.title,
          description: article.excerpt ?? undefined,
          images: article.thumbnail_url ? [article.thumbnail_url] : undefined,
        },
      }
    : { title: "Artikel — tcm.my.id" };
}

export default async function ArtikelDetailPage({ params, searchParams }: PageProps) {
  const article = await getArticleBySlug(params.slug);

  if (!article) notFound();
  const commentsRes = await serverFetch<ArticleCommentItem[]>(`/articles/${article.id}/comments`);
  const comments = commentsRes.success ? commentsRes.data : [];
  const lang = searchParams.lang === "en" ? "en" : "id";

  const articleUrl = `https://tcm.my.id/artikel/${article.slug}`;
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt ?? undefined,
    image: article.thumbnail_url ? [article.thumbnail_url] : undefined,
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
                <MemberBadge role={article.author.role as "member" | "moderator" | "admin" | "superadmin"} />
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
          {article.thumbnail_url && (
            <div className="mb-8 aspect-video overflow-hidden rounded-2xl">
              <Image src={article.thumbnail_url} alt={article.title} width={800} height={450} className="h-full w-full object-cover" />
            </div>
          )}

          {/* Tags */}
          {(article.tags ?? []).length > 0 && (
            <div className="mb-6 flex flex-wrap gap-2">
              {(article.tags ?? []).map((tag) => {
                const tagName = typeof tag === "string" ? tag : tag.name;
                const tagKey = typeof tag === "string" ? tag : tag.id;
                return (
                  <span key={tagKey} className="rounded-full border border-border-main bg-surface px-3 py-1 text-xs text-muted">
                    #{tagName}
                  </span>
                );
              })}
            </div>
          )}

          {/* Disclaimer */}
          {article.has_disclaimer && (
            <div className="mb-6 flex items-start gap-3 rounded-xl border border-amber-300/50 bg-amber-light/50 px-4 py-3 text-sm text-text-main">
              <AlertTriangle size={16} className="mt-0.5 shrink-0 text-amber-tcm" />
              <span>Artikel ini bersifat informatif dan bukan pengganti diagnosis atau terapi individual. Untuk keputusan kesehatan pribadi, konsultasikan dengan praktisi TCM yang kompeten atau tenaga kesehatan sesuai kebutuhan Anda.</span>
            </div>
          )}

          {/* Content */}
          <ArticleContent
            content={article.content ?? article.excerpt ?? ""}
            contentEn={article.content_en ?? null}
            lang={lang}
            accessTier={article.access_tier}
            title={article.title}
          />

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
