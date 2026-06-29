import Link from "next/link";
import { serverFetch } from "@/lib/api";
import { R_ARTIKEL_PLAN } from "@/lib/r-artikel-plan";
import { promises as fs } from "fs";

export const dynamic = "force-dynamic";

type BoardStatusItem = {
  id?: string;
  sequence_no?: number;
  title: string;
  slug?: string;
  status: "planned" | "draft" | "ready_for_publish" | "held" | "held_out_of_sequence" | "published";
  url?: string | null;
};

type BoardStatusPayload = {
  generated_at?: string;
  counts?: Record<string, number>;
  items?: BoardStatusItem[];
};

type ArticleListItem = {
  id: string;
  slug: string;
  title: string;
  published_at: string | null;
  category: { name: string; slug: string; color_hex: string | null } | null;
  author: { username: string; display_name: string } | null;
};

type RArtikelBoardItem = (typeof R_ARTIKEL_PLAN)[number] & {
  status: BoardStatusItem["status"] | "planned";
  article?: ArticleListItem;
  board?: BoardStatusItem;
};

function normalizeTitle(input: string) {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/[—–]/g, "-")
    .replace(/[^a-z0-9\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

async function fetchBoardStatus() {
  try {
    const raw = await fs.readFile("/var/www/tcm-frontend/data/r-artikel-status.json", "utf8");
    return JSON.parse(raw) as BoardStatusPayload;
  } catch {
    return { items: [] } as BoardStatusPayload;
  }
}

async function fetchPublishedArticles() {
  const collected: ArticleListItem[] = [];
  for (let page = 1; page <= 20; page += 1) {
    const res = await serverFetch<ArticleListItem[]>(`/articles?page=${page}&per_page=50&sort=newest`, {
      cache: "no-store",
    });
    if (!res.success) break;
    collected.push(...res.data);
    const totalPages = res.meta?.total_pages ?? page;
    if (page >= totalPages) break;
  }
  return collected;
}

export const metadata = {
  title: "Rencana Artikel TCM | TCM.my.id",
  description: "Checklist bank artikel TCM.my.id: season, judul, persona, level, dan status publish.",
};

export default async function RArtikelPage() {
  const [published, boardStatus] = await Promise.all([fetchPublishedArticles(), fetchBoardStatus()]);
  const publishedByTitle = new Map(published.map((article) => [normalizeTitle(article.title), article]));
  const planTitleCounts = R_ARTIKEL_PLAN.reduce((acc, item) => {
    const key = normalizeTitle(item.title);
    acc.set(key, (acc.get(key) ?? 0) + 1);
    return acc;
  }, new Map<string, number>());
  const boardById = new Map((boardStatus.items ?? []).filter((item) => item.id).map((item) => [item.id, item]));
  const boardByTitle = new Map((boardStatus.items ?? []).map((item) => [normalizeTitle(item.title), item]));

  const items: RArtikelBoardItem[] = R_ARTIKEL_PLAN.map((item) => {
    const titleKey = normalizeTitle(item.title);
    const duplicateTitle = (planTitleCounts.get(titleKey) ?? 0) > 1;
    const board = boardById.get(item.id) ?? (!duplicateTitle ? boardByTitle.get(titleKey) : undefined);
    const article = !duplicateTitle ? publishedByTitle.get(titleKey) : undefined;
    const status = board?.status === "held_out_of_sequence"
      ? "held" as const
      : (board?.status ?? (article ? "published" as const : "planned"));
    return {
      ...item,
      status,
      article,
      board,
    };
  });

  const total = items.length;
  const done = items.filter((item) => item.status === "published").length;
  const inProgress = items.filter((item) => item.status === "draft" || item.status === "ready_for_publish").length;
  const held = items.filter((item) => item.status === "held").length;
  const percent = total ? Math.round((done / total) * 100) : 0;
  const seasons = Array.from(new Set(items.map((item) => item.season)));
  const personaCounts = ["Bang Dzulfi", "Bang Zub", "Arini"].map((persona) => ({
    persona,
    total: items.filter((item) => item.persona === persona).length,
    done: items.filter((item) => item.persona === persona && item.status === "published").length,
  }));

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="mb-8 rounded-3xl border border-border-main bg-white p-6 shadow-sm">
        <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-primary">Rencana Artikel</p>
        <h1 className="font-display text-3xl font-bold text-text-main sm:text-4xl">
          Checklist Bank Artikel TCM.my.id
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-muted sm:text-base">
          Halaman ini adalah papan kontrol produksi artikel: season, judul, persona, level, jenis artikel,
          dan status publish. Prinsip baku: istilah TCM tetap dipakai, tulisan Muslim-safe, dan duplikasi
          dikontrol dengan ledger 6 bulan.
        </p>
        <div className="mt-6 grid gap-3 sm:grid-cols-4">
          <div className="rounded-2xl bg-surface p-4">
            <p className="text-xs text-muted">Total judul</p>
            <p className="mt-1 text-2xl font-bold text-text-main">{total}</p>
          </div>
          <div className="rounded-2xl bg-emerald-50 p-4">
            <p className="text-xs text-emerald-700">Sudah publish</p>
            <p className="mt-1 text-2xl font-bold text-emerald-800">{done}</p>
          </div>
          <div className="rounded-2xl bg-amber-50 p-4">
            <p className="text-xs text-amber-700">Belum diproses</p>
            <p className="mt-1 text-2xl font-bold text-amber-800">{total - done - inProgress - held}</p>
          </div>
          <div className="rounded-2xl bg-primary/10 p-4">
            <p className="text-xs text-primary">Progress</p>
            <p className="mt-1 text-2xl font-bold text-primary">{percent}%</p>
            <p className="mt-1 text-xs text-primary/80">Proses {inProgress} · Hold {held}</p>
          </div>
        </div>
        <div className="mt-5 h-3 overflow-hidden rounded-full bg-surface">
          <div className="h-full rounded-full bg-primary" style={{ width: `${percent}%` }} />
        </div>
      </header>

      <section className="mb-8 grid gap-3 md:grid-cols-3">
        {personaCounts.map((item) => (
          <div key={item.persona} className="rounded-2xl border border-border-main bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-semibold text-text-main">{item.persona}</h2>
              <span className="rounded-full bg-surface px-3 py-1 text-xs text-muted">{item.done}/{item.total}</span>
            </div>
          </div>
        ))}
      </section>

      <section className="space-y-8">
        {seasons.map((season) => {
          const seasonItems = items.filter((item) => item.season === season);
          const seasonDone = seasonItems.filter((item) => item.status === "published").length;
          return (
            <section key={season} className="overflow-hidden rounded-3xl border border-border-main bg-white shadow-sm">
              <div className="border-b border-border-main bg-surface/70 px-5 py-4">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="font-display text-xl font-bold text-text-main">{season}</h2>
                    <p className="mt-1 text-sm text-muted">{seasonDone} dari {seasonItems.length} judul sudah publish</p>
                  </div>
                  <span className="w-fit rounded-full bg-white px-3 py-1 text-xs font-medium text-muted ring-1 ring-border-main">
                    {Math.round((seasonDone / Math.max(seasonItems.length, 1)) * 100)}%
                  </span>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-border-main text-sm">
                  <thead className="bg-white">
                    <tr className="text-left text-xs uppercase tracking-wide text-muted">
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Judul</th>
                      <th className="px-4 py-3">Persona</th>
                      <th className="px-4 py-3">Level</th>
                      <th className="px-4 py-3">Jenis</th>
                      <th className="px-4 py-3">Parent</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-main">
                    {seasonItems.map((item) => (
                      <tr key={item.id} className="align-top hover:bg-surface/50">
                        <td className="whitespace-nowrap px-4 py-3">
                          {item.status === "published" ? (
                            <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">Published</span>
                          ) : item.status === "ready_for_publish" ? (
                            <span className="rounded-full bg-blue-100 px-2.5 py-1 text-xs font-semibold text-blue-700">Ready</span>
                          ) : item.status === "draft" ? (
                            <span className="rounded-full bg-sky-100 px-2.5 py-1 text-xs font-semibold text-sky-700">Drafting</span>
                          ) : item.status === "held" ? (
                            <span className="rounded-full bg-red-100 px-2.5 py-1 text-xs font-semibold text-red-700">Held</span>
                          ) : (
                            <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-700">Planned</span>
                          )}
                        </td>
                        <td className="min-w-[280px] px-4 py-3">
                          {item.article ? (
                            <Link className="font-semibold text-primary hover:underline" href={`/artikel/${item.article.slug}`}>
                              {item.title}
                            </Link>
                          ) : (
                            <span className="font-medium text-text-main">{item.title}</span>
                          )}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-muted">{item.persona}</td>
                        <td className="whitespace-nowrap px-4 py-3 text-muted">{item.level}</td>
                        <td className="whitespace-nowrap px-4 py-3 text-muted">{item.kind}</td>
                        <td className="min-w-[220px] px-4 py-3 text-muted">{item.parent}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          );
        })}
      </section>
    </main>
  );
}
