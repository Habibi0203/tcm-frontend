import Image from "next/image";
import Link from "next/link";
import { Clock, Lock, Eye, MessageCircle } from "lucide-react";
import { formatRelativeTime } from "@/lib/utils";
import CategoryBadge from "./CategoryBadge";

interface ArticleData {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  thumbnail_url: string;
  access_tier: "free" | "premium";
  view_count: number;
  like_count: number;
  comment_count: number;
  published_at: string | null;
  read_time_minutes?: number;
  tags: string[];
  category: { id: string; name: string; slug: string; color_hex: string };
  author: { id: string; username: string; display_name: string; avatar_url: string | null; role: string } | null;
}

interface ArticleCardProps {
  article: ArticleData;
  variant?: "grid" | "list" | "compact";
}

export default function ArticleCard({ article, variant = "grid" }: ArticleCardProps) {
  if (variant === "compact") {
    return (
      <Link
        href={`/artikel/${article.slug}`}
        className="flex gap-3 rounded-lg p-2 transition-colors hover:bg-surface"
      >
        <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md bg-gray-100">
          <Image
            src={article.thumbnail_url}
            alt={article.title}
            fill
            sizes="64px"
            className="object-cover"
          />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="line-clamp-2 text-sm font-medium text-text-main">{article.title}</h4>
          <div className="mt-1 flex items-center gap-2 text-xs text-muted">
            <Clock size={12} />
            <span>{article.read_time_minutes} min baca</span>
          </div>
        </div>
      </Link>
    );
  }

  if (variant === "list") {
    return (
      <Link
        href={`/artikel/${article.slug}`}
        className="group flex flex-col gap-4 rounded-xl border border-border-main bg-card p-4 transition-shadow hover:shadow-md sm:flex-row"
      >
        <div className="relative h-48 w-full flex-shrink-0 overflow-hidden rounded-lg bg-gray-100 sm:h-32 sm:w-48">
          <Image
            src={article.thumbnail_url}
            alt={article.title}
            fill
            sizes="(max-width: 640px) 100vw, 192px"
            className="object-cover transition-transform group-hover:scale-105"
          />
          {article.access_tier === "premium" && (
            <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-amber-tcm px-2 py-0.5 text-xs font-semibold text-white">
              <Lock size={10} /> Premium
            </span>
          )}
        </div>
        <div className="flex-1">
          <div className="mb-2 flex items-center gap-2">
            <CategoryBadge name={article.category.name} slug={article.category.slug} color={article.category.color_hex} asSpan />
          </div>
          <h3 className="mb-2 text-lg font-display font-semibold text-text-main group-hover:text-primary line-clamp-2">
            {article.title}
          </h3>
          <p className="mb-3 line-clamp-2 text-sm text-muted">{article.excerpt}</p>
          <div className="flex items-center gap-4 text-xs text-muted">
            <span>{article.author?.display_name ?? "Anonim"}</span>
            <span className="flex items-center gap-1"><Clock size={12} />{article.read_time_minutes} min</span>
            <span className="flex items-center gap-1"><Eye size={12} />{article.view_count}</span>
            <span className="flex items-center gap-1"><MessageCircle size={12} />{article.comment_count}</span>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/artikel/${article.slug}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-border-main bg-card transition-all hover:shadow-lg"
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-gray-100">
        <Image
          src={article.thumbnail_url}
          alt={article.title}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {article.access_tier === "premium" && (
          <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-amber-tcm px-2.5 py-1 text-xs font-semibold text-white">
            <Lock size={12} /> Premium
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <div className="mb-2">
          <CategoryBadge name={article.category.name} slug={article.category.slug} color={article.category.color_hex} asSpan />
        </div>
        <h3 className="mb-2 line-clamp-2 font-display text-lg font-semibold text-text-main group-hover:text-primary">
          {article.title}
        </h3>
        <p className="mb-3 line-clamp-2 flex-1 text-sm text-muted">{article.excerpt}</p>
        <div className="mt-auto flex items-center justify-between text-xs text-muted">
          <span className="truncate">{article.author?.display_name ?? "Anonim"}</span>
          <span className="flex items-center gap-1 flex-shrink-0">
            <Clock size={12} /> {article.read_time_minutes} min
          </span>
        </div>
        {article.published_at && <div className="mt-2 text-xs text-muted">{formatRelativeTime(article.published_at)}</div>}
      </div>
    </Link>
  );
}
