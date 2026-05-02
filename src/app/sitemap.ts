import type { MetadataRoute } from "next";

export const revalidate = 3600;

const SITE_URL = "https://tcm.my.id";
const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:3001";
const PAGE_SIZE = 100;

type ArticleListItem = {
  slug: string;
  published_at?: string | null;
  category?: { slug?: string | null } | null;
};

type ArticleListResponse = {
  success: boolean;
  data: ArticleListItem[];
  meta?: {
    current_page?: number;
    total_pages?: number;
  };
};

async function fetchArticlePage(page: number): Promise<ArticleListResponse | null> {
  try {
    const res = await fetch(
      `${BACKEND_URL}/api/articles?page=${page}&per_page=${PAGE_SIZE}&sort=newest`,
      {
        next: { revalidate },
      }
    );

    if (!res.ok) return null;
    return (await res.json()) as ArticleListResponse;
  } catch {
    return null;
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const urls: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${SITE_URL}/artikel`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/forum`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/tentang`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  const firstPage = await fetchArticlePage(1);
  if (!firstPage?.success) return urls;

  const allItems = [...firstPage.data];
  const totalPages = Math.max(1, firstPage.meta?.total_pages ?? 1);

  for (let page = 2; page <= totalPages; page += 1) {
    const nextPage = await fetchArticlePage(page);
    if (!nextPage?.success) continue;
    allItems.push(...nextPage.data);
  }

  const seenCategories = new Set<string>();

  for (const article of allItems) {
    urls.push({
      url: `${SITE_URL}/artikel/${article.slug}`,
      lastModified: article.published_at ? new Date(article.published_at) : new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    });

    const categorySlug = article.category?.slug;
    if (categorySlug && !seenCategories.has(categorySlug)) {
      seenCategories.add(categorySlug);
      urls.push({
        url: `${SITE_URL}/kategori/${categorySlug}`,
        lastModified: article.published_at ? new Date(article.published_at) : new Date(),
        changeFrequency: "weekly",
        priority: 0.6,
      });
    }
  }

  return urls;
}
