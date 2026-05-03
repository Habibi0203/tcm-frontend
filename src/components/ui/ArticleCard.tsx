import Image from "next/image";
import Link from "next/link";
import { Clock, Lock, Eye, MessageCircle } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { getArticleIllustrationPath } from "@/lib/article-illustration";
import CategoryBadge from "./CategoryBadge";

interface ArticleData {
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
  read_time_minutes?: number;
  tags?: string[];
  category: { id: string; name: string; slug: string; color_hex: string };
  author: { id: string; username: string; display_name: string; avatar_url: string | null; role: string } | null;
}

interface ArticleCardProps {
  article: ArticleData;
  variant?: "grid" | "list" | "compact";
}

export default function ArticleCard({ article, variant = "grid" }: ArticleCardProps) {
  const safeThumbnail = article.thumbnail_url?.trim() || getArticleIllustrationPath({
    title: article.title,
    categoryName: article.category?.name,
    categorySlug: article.category?.slug,
  });

  if (variant === "compact") {
    return (
      <Link
        href={`/artikel/${article.slug}`}
        className="flex gap-3 rounded-lg p-2 transition-colors hover:bg-surface"
      >
        {safeThumbnail ? (
          <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md bg-gray-100">
            <Image
              src={safeThumbnail}
              alt={article.title}
              fill
              sizes="64px"
              className="object-cover"
            />
          </div>
        ) : null}
        <div className="min-w-0 flex-1">
          <h4 className="line-clamp-2 text-sm font-medium text-text-main">{article.title}</h4>
          <div className="mt-1 flex items-center gap-2 text-xs text-muted">
            <Clock size={12} />
            <span>{article.read_time_minutes ?? 1} min baca</span>
          </div>
        </div>
      </Link>
    );
  }

  if (variant === "list") {
    return (
      <Link
        href={`/artikel/${article.slug}`}
        className="group block rounded-xl border border-border-main bg-card p-5 transition-shadow hover:shadow-md"
      >
        <div className="flex flex-col gap-4 md:flex-row">
          <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl bg-surface md:w-56 md:flex-shrink-0">
            <Image
              src={safeThumbnail}
              alt={article.title}
              fill
              sizes="(max-width: 768px) 100vw, 224px"
              className="object-cover"
            />
          </div>
          <div className="min-w-0 flex-1">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <CategoryBadge name={article.category.name} slug={article.category.slug} color={article.category.color_hex} asSpan />
          {article.access_tier === "premium" && (
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-tcm px-2 py-0.5 text-xs font-semibold text-white">
              <Lock size={10} /> Akses Khusus
            </span>
          )}
        </div>

        <h3 className="mb-3 line-clamp-2 font-display text-xl font-semibold text-text-main group-hover:text-primary">
          {article.title}
        </h3>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted">
          <span>{article.author?.display_name ?? "Anonim"}</span>
          {article.published_at && <span className="flex items-center gap-1"><Clock size={12} />{formatDate(article.published_at)}</span>}
          <span className="flex items-center gap-1"><Eye size={12} />{article.view_count}</span>
          <span className="flex items-center gap-1"><MessageCircle size={12} />{article.comment_count}</span>
        </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/artikel/${article.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-xl border border-border-main bg-card transition-all hover:shadow-md"
    >
      <div className="relative aspect-[16/10] w-full bg-surface">
        <Image
          src={safeThumbnail}
          alt={article.title}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover"
        />
      </div>
      <div className="flex h-full flex-col p-5">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <CategoryBadge name={article.category.name} slug={article.category.slug} color={article.category.color_hex} asSpan />
        {article.access_tier === "premium" && (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-tcm px-2 py-0.5 text-xs font-semibold text-white">
            <Lock size={10} /> Akses Khusus
          </span>
        )}
      </div>

      <h3 className="mb-3 line-clamp-2 font-display text-lg font-semibold text-text-main group-hover:text-primary">
        {article.title}
      </h3>

      <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted">
        <span className="truncate">{article.author?.display_name ?? "Anonim"}</span>
        {article.published_at && <span className="flex items-center gap-1"><Clock size={12} /> {formatDate(article.published_at)}</span>}
        <span className="flex items-center gap-1"><Eye size={12} /> {article.view_count}</span>
        <span className="flex items-center gap-1"><MessageCircle size={12} /> {article.comment_count}</span>
      </div>
      </div>
    </Link>
  );
}
