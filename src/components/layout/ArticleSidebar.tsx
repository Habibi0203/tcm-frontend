import Link from "next/link";
import { mockCategories } from "@/mock/categories";
import { mockArticles } from "@/mock/articles";
import ArticleCard from "@/components/ui/ArticleCard";

export default function ArticleSidebar() {
  const popularArticles = [...mockArticles]
    .sort((a, b) => b.view_count - a.view_count)
    .slice(0, 4);

  const allTags = Array.from(new Set(mockArticles.flatMap((a) => a.tags)));

  return (
    <aside className="space-y-6">
      <div className="rounded-xl border border-border-main bg-card p-5">
        <h3 className="mb-3 font-display text-lg font-semibold">Kategori</h3>
        <ul className="space-y-2">
          {mockCategories.map((cat) => (
            <li key={cat.id}>
              <Link
                href={`/kategori/${cat.slug}`}
                className="flex items-center justify-between rounded-md px-2 py-1.5 text-sm text-muted hover:bg-surface hover:text-text-main"
              >
                <span className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: cat.color_hex }} />
                  {cat.name}
                </span>
                <span className="text-xs">{cat.article_count}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-xl border border-border-main bg-card p-5">
        <h3 className="mb-3 font-display text-lg font-semibold">Populer</h3>
        <div className="space-y-2">
          {popularArticles.map((a) => (
            <ArticleCard key={a.id} article={a} variant="compact" />
          ))}
        </div>
      </div>

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
    </aside>
  );
}
