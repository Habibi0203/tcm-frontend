import Link from "next/link";
import { serverFetch } from "@/lib/api";
import ArticleCard from "@/components/ui/ArticleCard";

interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  color_hex: string | null;
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

export default async function ArticleSidebar() {
  const [catRes, popRes] = await Promise.all([
    serverFetch<CategoryItem[]>("/articles/categories"),
    serverFetch<ArticleItem[]>("/articles?sort=popular&per_page=4"),
  ]);

  const categories = catRes.success ? catRes.data : [];
  const popularArticles = popRes.success ? popRes.data : [];

  // Collect tags from popular articles
  const allTags = Array.from(new Set(popularArticles.flatMap((a) => a.tags ?? [])));

  return (
    <aside className="space-y-6">
      <div className="rounded-xl border border-border-main bg-card p-5">
        <h3 className="mb-3 font-display text-lg font-semibold">Kategori</h3>
        <ul className="space-y-2">
          {categories.map((cat) => (
            <li key={cat.id}>
              <Link
                href={`/kategori/${cat.slug}`}
                className="flex items-center justify-between rounded-md px-2 py-1.5 text-sm text-muted hover:bg-surface hover:text-text-main"
              >
                <span className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: cat.color_hex ?? "#888" }} />
                  {cat.name}
                </span>
                {cat.article_count != null && <span className="text-xs">{cat.article_count}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {popularArticles.length > 0 && (
        <div className="rounded-xl border border-border-main bg-card p-5">
          <h3 className="mb-3 font-display text-lg font-semibold">Populer</h3>
          <div className="space-y-2">
            {popularArticles.map((a) => (
              <ArticleCard key={a.id} article={a as Parameters<typeof ArticleCard>[0]["article"]} variant="compact" />
            ))}
          </div>
        </div>
      )}

      {allTags.length > 0 && (
        <div className="rounded-xl border border-border-main bg-card p-5">
          <h3 className="mb-3 font-display text-lg font-semibold">Tag</h3>
          <div className="flex flex-wrap gap-2">
            {allTags.slice(0, 15).map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-surface px-3 py-1 text-xs text-muted hover:bg-primary-light hover:text-primary-dark"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </aside>
  );
}
