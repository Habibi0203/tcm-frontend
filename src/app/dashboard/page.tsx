"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useCallback, Suspense } from "react";
import { BookOpen, Bell, Settings, Check, ExternalLink, KeyRound } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { apiFetch } from "@/lib/api";
import ArticleCard from "@/components/ui/ArticleCard";
import MemberBadge from "@/components/ui/MemberBadge";

type Tab = "ringkasan" | "bookmark" | "notifikasi" | "profil";

interface BookmarkedArticle {
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

interface NotifItem {
  id: string;
  type: "article_approved" | "article_rejected" | "new_reply" | "reply_upvote" | "system";
  title: string;
  body: string | null;
  link: string | null;
  is_read: boolean;
  created_at: string;
}

const TABS: { key: Tab; label: string; icon: React.ReactNode }[] = [
  { key: "ringkasan",  label: "Ringkasan",  icon: <BookOpen size={16} /> },
  { key: "bookmark",   label: "Bookmark",   icon: <BookOpen size={16} /> },
  { key: "notifikasi", label: "Notifikasi", icon: <Bell size={16} /> },
  { key: "profil",     label: "Profil",     icon: <Settings size={16} /> },
];

function DashboardInner() {
  const router        = useRouter();
  const searchParams  = useSearchParams();
  const { user, isAuthenticated, access_token, _hasHydrated, updateUser } = useAuthStore();

  const rawTab = searchParams.get("tab") as Tab | null;
  const activeTab: Tab = TABS.some((t) => t.key === rawTab) ? rawTab! : "ringkasan";

  const [bookmarks, setBookmarks]       = useState<BookmarkedArticle[]>([]);
  const [notifications, setNotifications] = useState<NotifItem[]>([]);
  const [loading, setLoading]           = useState(true);

  useEffect(() => {
    if (!_hasHydrated) return;
    if (!isAuthenticated) router.push("/masuk");
  }, [isAuthenticated, _hasHydrated, router]);

  // Fetch bookmarks & notifications from API
  const fetchDashboardData = useCallback(async () => {
    if (!access_token) return;
    setLoading(true);
    const [bmRes, notifRes] = await Promise.all([
      apiFetch<BookmarkedArticle[]>("/me/bookmarks", { token: access_token }),
      apiFetch<NotifItem[]>("/me/notifications", { token: access_token }),
    ]);
    if (bmRes.success) setBookmarks(bmRes.data);
    if (notifRes.success) setNotifications(notifRes.data);
    setLoading(false);
  }, [access_token]);

  useEffect(() => {
    if (isAuthenticated && access_token) {
      fetchDashboardData();
    }
  }, [isAuthenticated, access_token, fetchDashboardData]);

  // Profile form state
  const [displayName, setDisplayName] = useState(user?.display_name ?? "");
  const [bio, setBio]                 = useState(user?.bio ?? "");
  const [profSaved, setProfSaved]     = useState(false);
  const [profSaving, setProfSaving]   = useState(false);
  const [profError, setProfError]     = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword]         = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passSaving, setPassSaving]           = useState(false);
  const [passSaved, setPassSaved]             = useState(false);
  const [passError, setPassError]             = useState("");

  if (!user) return null;

  function setTab(tab: Tab) {
    router.push(`/dashboard?tab=${tab}`, { scroll: false });
  }

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    if (!access_token) return;
    setProfSaving(true);
    setProfError("");
    setProfSaved(false);

    const res = await apiFetch("/me", {
      method: "PATCH",
      token: access_token,
      body: { display_name: displayName.trim(), bio: bio.trim() || null },
    });

    setProfSaving(false);
    if (res.success) {
      updateUser({ display_name: displayName.trim(), bio: bio.trim() || null });
      setProfSaved(true);
      setTimeout(() => setProfSaved(false), 3000);
      return;
    }

    setProfError(res.error.message || "Gagal menyimpan perubahan profil.");
  }

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    if (!access_token) return;

    setPassError("");
    setPassSaved(false);

    if (newPassword.length < 8) {
      setPassError("Password baru minimal 8 karakter.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPassError("Konfirmasi password baru tidak sama.");
      return;
    }

    setPassSaving(true);
    const res = await apiFetch<{ message: string }>("/me/password", {
      method: "PATCH",
      token: access_token,
      body: {
        current_password: currentPassword,
        new_password: newPassword,
      },
    });
    setPassSaving(false);

    if (res.success) {
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setPassSaved(true);
      setTimeout(() => setPassSaved(false), 3000);
      return;
    }

    setPassError(res.error.message || "Gagal mengubah password.");
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
        {/* Sidebar */}
        <aside>
          {/* Avatar card */}
          <div className="rounded-2xl border border-border-main bg-card p-5 text-center">
            {user.avatar_url ? (
              <Image
                src={user.avatar_url}
                alt={user.display_name}
                width={80}
                height={80}
                className="mx-auto rounded-full"
                unoptimized
              />
            ) : (
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary text-2xl font-bold text-white">
                {(user.display_name ?? "?").trim().charAt(0).toUpperCase() || "?"}
              </div>
            )}
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
                <StatBox label="Artikel Dibaca" value="-" />
                <StatBox label="Diskusi" value="-" />
                <StatBox label="Tersimpan" value={String(bookmarks.length)} />
              </div>
              <div className="mt-10">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="font-display text-xl font-semibold">Bookmark Terbaru</h3>
                  <button onClick={() => setTab("bookmark")} className="text-sm text-primary hover:underline">
                    Lihat semua
                  </button>
                </div>
                {loading ? (
                  <p className="text-muted text-sm">Memuat...</p>
                ) : bookmarks.length > 0 ? (
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {bookmarks.slice(0, 3).map((a) => (
                      <ArticleCard key={a.id} article={a as Parameters<typeof ArticleCard>[0]["article"]} />
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted">Belum ada bookmark.</p>
                )}
              </div>
            </>
          )}

          {/* ── Bookmark ── */}
          {activeTab === "bookmark" && (
            <>
              <h1 className="mb-6 font-display text-2xl font-bold">Artikel Tersimpan</h1>
              {bookmarks.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-border-main bg-surface p-12 text-center text-muted">
                  Belum ada artikel yang disimpan.
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {bookmarks.map((a) => (
                    <ArticleCard key={a.id} article={a as Parameters<typeof ArticleCard>[0]["article"]} />
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
                {notifications.length === 0 ? (
                  <p className="text-sm text-muted">Belum ada notifikasi.</p>
                ) : (
                  notifications.map((n) => (
                    <NotifRow key={n.id} notif={n} />
                  ))
                )}
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
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="submit"
                    disabled={profSaving}
                    className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {profSaved ? <><Check size={16} /> Tersimpan!</> : profSaving ? "Menyimpan..." : "Simpan Perubahan"}
                  </button>
                  {profError && <p className="text-sm text-red-400">{profError}</p>}
                </div>
              </form>

              <div className="mt-10 max-w-lg rounded-2xl border border-border-main bg-card p-5">
                <div className="mb-4 flex items-center gap-2">
                  <KeyRound size={18} className="text-primary" />
                  <h2 className="font-display text-xl font-bold">Ganti Password</h2>
                </div>
                <form onSubmit={handleChangePassword} className="space-y-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-text-main">Password Saat Ini</label>
                    <input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      required
                      className="w-full rounded-xl border border-border-main bg-white px-4 py-2.5 text-sm outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-text-main">Password Baru</label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      minLength={8}
                      required
                      className="w-full rounded-xl border border-border-main bg-white px-4 py-2.5 text-sm outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-text-main">Konfirmasi Password Baru</label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      minLength={8}
                      required
                      className="w-full rounded-xl border border-border-main bg-white px-4 py-2.5 text-sm outline-none focus:border-primary"
                    />
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      type="submit"
                      disabled={passSaving}
                      className="inline-flex items-center gap-2 rounded-xl bg-bark px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-bark-light disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {passSaved ? <><Check size={16} /> Password Diubah</> : passSaving ? "Menyimpan..." : "Ganti Password"}
                    </button>
                    {passError && <p className="text-sm text-red-400">{passError}</p>}
                  </div>
                  <p className="text-xs text-muted">
                    Gunakan minimal 8 karakter. Setelah berhasil diubah, login berikutnya gunakan password baru.
                  </p>
                </form>
              </div>
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

function NotifRow({ notif }: { notif: NotifItem }) {
  const typeColors: Record<NotifItem["type"], string> = {
    new_reply:       "bg-primary/10 text-primary",
    reply_upvote:    "bg-purple-100 text-purple-700",
    article_approved:"bg-green-100 text-green-700",
    article_rejected:"bg-red-100 text-red-700",
    system:          "bg-surface text-muted",
  };
  const typeLabels: Record<NotifItem["type"], string> = {
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
