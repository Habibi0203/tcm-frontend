"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, LayoutGrid, List } from "lucide-react";
import ArticleCard from "@/components/ui/ArticleCard";
import { apiFetch } from "@/lib/api";

type SortOption = "latest" | "popular" | "most_commented";
type ViewMode   = "grid" | "list";

const VIEW_KEY = "tcm-article-view";

interface CategoryItem {
  id: string;
  name: string;
  slug: string;
}

// Shape returned by GET /api/articles (list item)
interface ArticleListItem {
  id:           string;
  slug:         string;
  title:        string;
  excerpt:      string | null;
  thumbnail_url: string | null;
  access_tier:  "free" | "premium";
  view_count:   number;
  like_count:   number;
  comment_count: number;
  published_at: string | null;
  tags:         string[];
  category: {
    id:       string;
    name:     string;
    slug:     string;
    color_hex: string;
  };
  author: {
    id:           string;
    username:     string;
    display_name: string;
    avatar_url:   string | null;
    role:         string;
  } | null;
}

function toSortParam(s: SortOption): "newest" | "popular" {
  if (s === "latest") return "newest";
  return "popular";
}

export default function ArtikelPage() {
  const [query,        setQuery]        = useState("");
  const [debouncedQ,   setDebouncedQ]   = useState("");
  const [categorySlug, setCategorySlug] = useState<string | null>(null);
  const [sort,         setSort]         = useState<SortOption>("latest");
  const [view,         setView]         = useState<ViewMode>("grid");
  const [articles,     setArticles]     = useState<ArticleListItem[]>([]);
  const [categories,   setCategories]   = useState<CategoryItem[]>([]);
  const [total,        setTotal]        = useState(0);
  const [loading,      setLoading]      = useState(true);

  // Rehydrate view from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(VIEW_KEY);
    if (saved === "list" || saved === "grid") setView(saved);
  }, []);

  // Fetch categories once
  useEffect(() => {
    async function loadCats() {
      const res = await apiFetch<CategoryItem[]>("/articles/categories");
      if (res.success) setCategories(res.data);
    }
    loadCats();
  }, []);

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQ(query), 400);
    return () => clearTimeout(t);
  }, [query]);

  const fetchArticles = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ sort: toSortParam(sort), per_page: "20" });
    if (debouncedQ)   params.set("q", debouncedQ);
    if (categorySlug) params.set("category_slug", categorySlug);

    const res = await apiFetch<ArticleListItem[]>(`/articles?${params}`);
    if (res.success) {
      setArticles(res.data);
      setTotal(res.meta?.total ?? res.data.length);
    }
    setLoading(false);
  }, [debouncedQ, categorySlug, sort]);

  useEffect(() => { fetchArticles(); }, [fetchArticles]);

  function handleViewChange(v: ViewMode) {
    setView(v);
    localStorage.setItem(VIEW_KEY, v);
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="mb-8">
        <h1 className="font-display text-4xl font-bold text-text-main">Semua Artikel</h1>
        <p className="mt-2 text-muted">Eksplorasi dunia TCM melalui tulisan mendalam dari komunitas kami.</p>
      </header>

      {/* Search */}
      <div className="relative mb-6">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
        <input type="search" value={query} onChange={(e) => setQuery(e.target.value)}
          placeholder="Cari artikel, tag, atau topik..."
          className="w-full rounded-full border border-border-main bg-white py-3 pl-11 pr-4 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" />
      </div>

      {/* Category Filter */}
      <div className="mb-6 flex flex-nowrap items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <button onClick={() => setCategorySlug(null)}
          className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${categorySlug === null ? "bg-primary text-white" : "border border-border-main bg-white text-muted hover:bg-surface"}`}>
          Semua
        </button>
        {categories.map((c) => (
          <button key={c.id} onClick={() => setCategorySlug(c.slug)}
            className={`shrink-0 whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${categorySlug === c.slug ? "bg-primary text-white" : "border border-border-main bg-white text-muted hover:bg-surface"}`}>
            {c.name}
          </button>
        ))}
      </div>

      {/* Sort + View toggle */}
      <div className="mb-6 flex items-center justify-between gap-3">
        <div className="text-sm text-muted">{loading ? "Memuat..." : `${total} artikel ditemukan`}</div>
        <div className="flex items-center gap-2">
          <select value={sort} onChange={(e) => setSort(e.target.value as SortOption)}
            className="rounded-lg border border-border-main bg-white px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20">
            <option value="latest">Terbaru</option>
            <option value="popular">Terpopuler</option>
            <option value="most_commented">Terbanyak Komentar</option>
          </select>
          <div className="flex overflow-hidden rounded-lg border border-border-main">
            <button onClick={() => handleViewChange("grid")}
              className={`p-2 transition-colors ${view === "grid" ? "bg-primary text-white" : "bg-white text-muted hover:bg-surface"}`} aria-label="Grid view">
              <LayoutGrid size={16} />
            </button>
            <button onClick={() => handleViewChange("list")}
              className={`p-2 transition-colors ${view === "list" ? "bg-primary text-white" : "bg-white text-muted hover:bg-surface"}`} aria-label="List view">
              <List size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Article list */}
      {loading ? (
        <div className={view === "grid" ? "grid gap-6 md:grid-cols-2 lg:grid-cols-3" : "flex flex-col gap-4"}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-64 animate-pulse rounded-xl bg-border-main/30" />
          ))}
        </div>
      ) : articles.length > 0 ? (
        <div className={view === "grid" ? "grid gap-6 md:grid-cols-2 lg:grid-cols-3" : "flex flex-col gap-4"}>
          {articles.map((a) => (
            <ArticleCard key={a.id} article={a as Parameters<typeof ArticleCard>[0]["article"]} variant={view === "list" ? "list" : "grid"} />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-border-main bg-white p-10 text-center">
          <p className="font-display text-xl font-semibold">Tidak ada artikel ditemukan</p>
          <p className="mt-2 text-sm text-muted">Coba ubah kata kunci atau filter kategori.</p>
        </div>
      )}
    </div>
  );
}
