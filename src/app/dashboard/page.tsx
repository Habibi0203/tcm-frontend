"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { BookOpen, Bell, Settings, Crown, Check, ExternalLink } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { mockArticles, getArticleById } from "@/mock/articles";
import { mockBookmarks } from "@/mock/bookmarks";
import { mockNotifications } from "@/mock/notifications";
import ArticleCard from "@/components/ui/ArticleCard";
import MemberBadge from "@/components/ui/MemberBadge";
import type { MockNotification } from "@/mock/notifications";

type Tab = "ringkasan" | "bookmark" | "notifikasi" | "profil";

const TABS: { key: Tab; label: string; icon: React.ReactNode }[] = [
  { key: "ringkasan",  label: "Ringkasan",  icon: <BookOpen size={16} /> },
  { key: "bookmark",   label: "Bookmark",   icon: <BookOpen size={16} /> },
  { key: "notifikasi", label: "Notifikasi", icon: <Bell size={16} /> },
  { key: "profil",     label: "Profil",     icon: <Settings size={16} /> },
];

function DashboardInner() {
  const router        = useRouter();
  const searchParams  = useSearchParams();
  const { user, isAuthenticated, _hasHydrated, updateUser } = useAuthStore();

  const rawTab = searchParams.get("tab") as Tab | null;
  const activeTab: Tab = TABS.some((t) => t.key === rawTab) ? rawTab! : "ringkasan";

  useEffect(() => {
    if (!_hasHydrated) return;
    if (!isAuthenticated) router.push("/masuk");
  }, [isAuthenticated, _hasHydrated, router]);

  // Profile form state
  const [displayName, setDisplayName] = useState(user?.display_name ?? "");
  const [bio, setBio]                 = useState(user?.bio ?? "");
  const [profSaved, setProfSaved]     = useState(false);

  if (!user) return null;

  function setTab(tab: Tab) {
    router.push(`/dashboard?tab=${tab}`, { scroll: false });
  }

  // Bookmarked articles
  const bookmarkedArticles = mockBookmarks
    .map((b) => getArticleById(b.article_id))
    .filter(Boolean) as typeof mockArticles;

  const unreadCount = mockNotifications.filter((n) => !n.is_read).length;

  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    await new Promise((r) => setTimeout(r, 500));
    updateUser({ display_name: displayName, bio: bio || undefined });
    setProfSaved(true);
    setTimeout(() => setProfSaved(false), 3000);
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
        {/* Sidebar */}
        <aside>
          {/* Avatar card */}
          <div className="rounded-2xl border border-border-main bg-card p-5 text-center">
            <Image
              src={user.avatar_url}
              alt={user.display_name}
              width={80}
              height={80}
              className="mx-auto rounded-full"
            />
            <h2 className="mt-3 font-display text-lg font-bold">{user.display_name}</h2>
            <p className="text-xs text-muted">@{user.username}</p>
            <div className="mt-2 flex justify-center">
              <MemberBadge
                tier={user.membership_tier}
                role={user.role}
                isVerified={user.is_verified && user.profession === "practitioner"}
                size="md"
              />
            </div>
            {user.membership_tier === "free" && (
              <Link
                href="/upgrade"
                className="mt-4 inline-flex w-full items-center justify-center gap-1 rounded-full bg-amber-tcm py-2 text-xs font-semibold text-white hover:bg-amber-tcm/90"
              >
                <Crown size={14} /> Upgrade Premium
              </Link>
            )}
          </div>

          {/* Tab nav */}
          <nav className="mt-4 space-y-1 rounded-2xl border border-border-main bg-card p-2">
            {TABS.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors ${
                  activeTab === t.key
                    ? "bg-primary/10 font-medium text-primary"
                    : "hover:bg-surface text-text-main"
                }`}
              >
                {t.icon}
                {t.label}
                {t.key === "notifikasi" && unreadCount > 0 && (
                  <span className="ml-auto inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-white">
                    {unreadCount}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main content */}
        <section>
          {/* ── Ringkasan ── */}
          {activeTab === "ringkasan" && (
            <>
              <h1 className="mb-2 font-display text-3xl font-bold">
                Selamat datang, {user.display_name.split(" ")[0]}!
              </h1>
              <p className="mb-8 text-muted">Ringkasan aktivitas Anda di tcm.my.id.</p>
              <div className="grid gap-4 sm:grid-cols-3">
                <StatBox label="Artikel Dibaca" value="24" />
                <StatBox label="Diskusi" value="8" />
                <StatBox label="Tersimpan" value={String(mockBookmarks.length)} />
              </div>
              <div className="mt-10">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="font-display text-xl font-semibold">Bookmark Terbaru</h3>
                  <button onClick={() => setTab("bookmark")} className="text-sm text-primary hover:underline">
                    Lihat semua
                  </button>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {bookmarkedArticles.slice(0, 3).map((a) => (
                    <ArticleCard key={a.id} article={a} />
                  ))}
                </div>
              </div>
            </>
          )}

          {/* ── Bookmark ── */}
          {activeTab === "bookmark" && (
            <>
              <h1 className="mb-6 font-display text-2xl font-bold">Artikel Tersimpan</h1>
              {bookmarkedArticles.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-border-main bg-surface p-12 text-center text-muted">
                  Belum ada artikel yang disimpan.
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {bookmarkedArticles.map((a) => (
                    <ArticleCard key={a.id} article={a} />
                  ))}
                </div>
              )}
            </>
          )}

          {/* ── Notifikasi ── */}
          {activeTab === "notifikasi" && (
            <>
              <div className="mb-6 flex items-center justify-between">
                <h1 className="font-display text-2xl font-bold">Notifikasi</h1>
                {unreadCount > 0 && (
                  <span className="text-sm text-primary">{unreadCount} belum dibaca</span>
                )}
              </div>
              <div className="space-y-3">
                {mockNotifications.map((n) => (
                  <NotifRow key={n.id} notif={n} />
                ))}
              </div>
            </>
          )}

          {/* ── Profil ── */}
          {activeTab === "profil" && (
            <>
              <h1 className="mb-6 font-display text-2xl font-bold">Edit Profil</h1>
              <form onSubmit={handleSaveProfile} className="max-w-lg space-y-5">
                <div>
                  <label className="mb-1 block text-sm font-medium text-text-main">
                    Nama Tampil
                  </label>
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    minLength={2}
                    maxLength={50}
                    required
                    className="w-full rounded-xl border border-border-main bg-white px-4 py-2.5 text-sm outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-text-main">
                    Bio <span className="text-muted">(opsional)</span>
                  </label>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    maxLength={300}
                    rows={4}
                    className="w-full resize-none rounded-xl border border-border-main bg-white px-4 py-2.5 text-sm outline-none focus:border-primary"
                  />
                  <p className="mt-1 text-right text-xs text-muted">{bio.length}/300</p>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-text-main">Email</label>
                  <input
                    type="email"
                    value={user.email}
                    disabled
                    className="w-full cursor-not-allowed rounded-xl border border-border-main bg-surface px-4 py-2.5 text-sm text-muted"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-text-main">Username</label>
                  <input
                    type="text"
                    value={user.username}
                    disabled
                    className="w-full cursor-not-allowed rounded-xl border border-border-main bg-surface px-4 py-2.5 text-sm text-muted"
                  />
                </div>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
                >
                  {profSaved ? <><Check size={16} /> Tersimpan!</> : "Simpan Perubahan"}
                </button>
                <p className="text-xs text-muted">
                  Untuk mengubah email atau password, hubungi admin.
                </p>
              </form>
            </>
          )}
        </section>
      </div>
    </div>
  );
}

function StatBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border-main bg-card p-4 text-center">
      <div className="font-display text-3xl font-bold text-primary">{value}</div>
      <div className="text-sm text-muted">{label}</div>
    </div>
  );
}

function NotifRow({ notif }: { notif: MockNotification }) {
  const typeColors: Record<MockNotification["type"], string> = {
    new_reply:       "bg-primary/10 text-primary",
    reply_upvote:    "bg-purple-100 text-purple-700",
    article_approved:"bg-green-100 text-green-700",
    article_rejected:"bg-red-100 text-red-700",
    system:          "bg-surface text-muted",
  };
  const typeLabels: Record<MockNotification["type"], string> = {
    new_reply:        "Balasan",
    reply_upvote:     "Upvote",
    article_approved: "Disetujui",
    article_rejected: "Ditolak",
    system:           "Sistem",
  };

  return (
    <div className={`flex gap-4 rounded-xl border ${notif.is_read ? "border-border-main" : "border-primary/30 bg-primary/5"} p-4`}>
      <span className={`mt-0.5 shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${typeColors[notif.type]}`}>
        {typeLabels[notif.type]}
      </span>
      <div className="min-w-0 flex-1">
        <p className={`text-sm font-medium ${notif.is_read ? "text-text-main" : "text-primary"}`}>
          {notif.title}
        </p>
        <p className="mt-0.5 text-xs text-muted">{notif.body}</p>
        <p className="mt-1 text-xs text-muted">
          {new Date(notif.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
        </p>
      </div>
      {notif.link && (
        <Link href={notif.link} className="shrink-0 text-muted hover:text-primary">
          <ExternalLink size={16} />
        </Link>
      )}
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense>
      <DashboardInner />
    </Suspense>
  );
}
