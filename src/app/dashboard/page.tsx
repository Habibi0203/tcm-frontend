"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useCallback, Suspense } from "react";
import { BookOpen, Bell, Settings, Check, ExternalLink, KeyRound, ShieldAlert, Loader2, Sparkles, ClipboardCheck, Eye, XCircle } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { apiFetch } from "@/lib/api";
import ArticleCard from "@/components/ui/ArticleCard";
import MemberBadge from "@/components/ui/MemberBadge";
import { USER_INTERESTS } from "@/lib/interests";

type Tab = "ringkasan" | "bookmark" | "notifikasi" | "approval" | "content-qc" | "moderasi" | "profil";

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

interface ModerationReport {
  id: string;
  reporter_id: string;
  target_type: "thread" | "reply";
  target_id: string;
  reason: string;
  details: string | null;
  status: "open" | "reviewed" | "dismissed" | "actioned";
  resolution_note: string | null;
  auto_detected?: boolean;
  safety_matches?: string[] | null;
  created_at: string;
  reviewed_at: string | null;
  reporter: { username: string | null; display_name: string | null };
  reviewer: { username: string } | null;
  target: {
    type: "thread" | "reply";
    id: string;
    thread_id: string | null;
    thread_title: string | null;
    subforum_slug: string | null;
    reply_excerpt: string | null;
    url: string | null;
  };
}

interface ContentQcAudit {
  id: string;
  article_id: string | null;
  article_slug: string | null;
  article_title: string;
  author_username: string | null;
  status: "pass" | "caution" | "reject" | "needs_review" | "takedown";
  recommended_action: string | null;
  risk_tier: number | null;
  quality_score: number | null;
  duplicate_score: number | null;
  summary: string | null;
  issues: string[] | null;
  source_basis: { type?: string; title?: string; ref?: string; note?: string }[] | null;
  created_by: string | null;
  created_at: string;
}

interface ApprovalArticle {
  id: string;
  title: string;
  slug: string;
  status: "draft" | "review" | "published" | "archived" | "scheduled";
  access_tier: "free" | "premium";
  author_id: string;
  created_at: string;
  published_at: string | null;
  view_count: number;
  like_count: number;
}

const BASE_TABS: { key: Tab; label: string; icon: React.ReactNode }[] = [
  { key: "ringkasan",  label: "Ringkasan",  icon: <BookOpen size={16} /> },
  { key: "bookmark",   label: "Bookmark",   icon: <BookOpen size={16} /> },
  { key: "notifikasi", label: "Notifikasi", icon: <Bell size={16} /> },
  { key: "profil",     label: "Profil",     icon: <Settings size={16} /> },
];

const APPROVAL_TAB: { key: Tab; label: string; icon: React.ReactNode } = {
  key: "approval",
  label: "Approval",
  icon: <ClipboardCheck size={16} />,
};


const CONTENT_QC_TAB: { key: Tab; label: string; icon: React.ReactNode } = {
  key: "content-qc",
  label: "Content QC",
  icon: <ShieldAlert size={16} />,
};

const MODERATION_TAB: { key: Tab; label: string; icon: React.ReactNode } = {
  key: "moderasi",
  label: "Moderasi",
  icon: <ShieldAlert size={16} />,
};

const REPORT_REASONS: Record<string, string> = {
  medical_claim: "Klaim medis berbahaya",
  illegal_product: "Produk ilegal/tidak aman",
  fraud: "Penipuan/transaksi",
  spam: "Spam/promosi",
  harassment: "Pelecehan",
  privacy: "Data pribadi/medis",
  other: "Lainnya",
};

const REPORT_STATUS: Record<string, string> = {
  open: "Terbuka",
  reviewed: "Ditinjau",
  dismissed: "Diabaikan",
  actioned: "Ditindak",
};

function DashboardInner() {
  const router        = useRouter();
  const searchParams  = useSearchParams();
  const { user, isAuthenticated, access_token, _hasHydrated, updateUser } = useAuthStore();

  const tabs = user?.role === "admin"
    ? [...BASE_TABS.slice(0, 3), APPROVAL_TAB, CONTENT_QC_TAB, MODERATION_TAB, BASE_TABS[3]]
    : user?.role === "moderator"
      ? [...BASE_TABS.slice(0, 3), APPROVAL_TAB, MODERATION_TAB, BASE_TABS[3]]
      : BASE_TABS;
  const rawTab = searchParams.get("tab") as Tab | null;
  const activeTab: Tab = tabs.some((t) => t.key === rawTab) ? rawTab! : "ringkasan";

  const [bookmarks, setBookmarks]       = useState<BookmarkedArticle[]>([]);
  const [notifications, setNotifications] = useState<NotifItem[]>([]);
  const [reports, setReports]           = useState<ModerationReport[]>([]);
  const [reportsMeta, setReportsMeta]   = useState<{ page: number; per_page: number; total: number; total_pages: number } | null>(null);
  const [approvalArticles, setApprovalArticles] = useState<ApprovalArticle[]>([]);
  const [approvalMeta, setApprovalMeta] = useState<{ page: number; per_page: number; total: number; total_pages: number } | null>(null);
  const [approvalLoading, setApprovalLoading] = useState(false);
  const [approvalError, setApprovalError] = useState("");
  const [approvalActionId, setApprovalActionId] = useState<string | null>(null);
  const [qcAudits, setQcAudits] = useState<ContentQcAudit[]>([]);
  const [qcMeta, setQcMeta] = useState<{ page: number; per_page: number; total: number; total_pages: number } | null>(null);
  const [qcLoading, setQcLoading] = useState(false);
  const [qcError, setQcError] = useState("");
  const [qcStatusFilter, setQcStatusFilter] = useState("");

  const [reportStatusFilter, setReportStatusFilter] = useState("open");
  const [reportReasonFilter, setReportReasonFilter] = useState("");
  const [reportTypeFilter, setReportTypeFilter] = useState("");
  const [reportAutoFilter, setReportAutoFilter] = useState("");
  const [reportPage, setReportPage] = useState(1);
  const [reportsLoading, setReportsLoading] = useState(false);
  const [reportActionId, setReportActionId] = useState<string | null>(null);
  const [reportError, setReportError]   = useState("");
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

  const isAdmin = user?.role === "admin";
  const isModerator = Boolean(user && ["admin", "moderator"].includes(user.role));

  const fetchReports = useCallback(async () => {
    if (!access_token || !isModerator) return;
    setReportsLoading(true);
    setReportError("");
    const params = new URLSearchParams({ page: String(reportPage), per_page: "10" });
    if (reportStatusFilter) params.set("status", reportStatusFilter);
    if (reportReasonFilter) params.set("reason", reportReasonFilter);
    if (reportTypeFilter) params.set("target_type", reportTypeFilter);
    if (reportAutoFilter) params.set("auto_detected", reportAutoFilter);
    const res = await apiFetch<ModerationReport[]>(`/admin/reports?${params.toString()}`, { token: access_token });
    setReportsLoading(false);
    if (res.success) {
      setReports(res.data);
      setReportsMeta(res.meta ?? null);
      return;
    }
    setReportError(res.error.message || "Gagal memuat laporan moderasi.");
  }, [access_token, isModerator, reportAutoFilter, reportPage, reportReasonFilter, reportStatusFilter, reportTypeFilter]);

  const fetchApprovalArticles = useCallback(async () => {
    if (!access_token || !isModerator) return;
    setApprovalLoading(true);
    setApprovalError("");
    const res = await apiFetch<ApprovalArticle[]>("/admin/articles?status=review&per_page=20", { token: access_token });
    setApprovalLoading(false);
    if (res.success) {
      setApprovalArticles(res.data);
      setApprovalMeta(res.meta ?? null);
      return;
    }
    setApprovalError(res.error.message || "Gagal memuat artikel review.");
  }, [access_token, isModerator]);

  useEffect(() => {
    if (activeTab === "approval") fetchApprovalArticles();
  }, [activeTab, fetchApprovalArticles]);


  const fetchQcAudits = useCallback(async () => {
    if (!access_token || !isAdmin) return;
    setQcLoading(true);
    setQcError("");
    const params = new URLSearchParams({ page: "1", per_page: "20" });
    if (qcStatusFilter) params.set("status", qcStatusFilter);
    const res = await apiFetch<ContentQcAudit[]>(`/admin/content-qc-audits?${params.toString()}`, { token: access_token });
    setQcLoading(false);
    if (res.success) {
      setQcAudits(res.data);
      setQcMeta(res.meta ?? null);
      return;
    }
    setQcError(res.error.message || "Gagal memuat hasil Content QC.");
  }, [access_token, isAdmin, qcStatusFilter]);

  useEffect(() => {
    if (activeTab === "content-qc") fetchQcAudits();
  }, [activeTab, fetchQcAudits]);

  useEffect(() => {
    if (activeTab === "moderasi") fetchReports();
  }, [activeTab, fetchReports]);

  // Profile form state
  const [displayName, setDisplayName] = useState(user?.display_name ?? "");
  const [bio, setBio]                 = useState(user?.bio ?? "");
  const [profession, setProfession]   = useState(user?.profession ?? "general");
  const [interests, setInterests]     = useState<string[]>(user?.interests ?? []);
  const [profSaved, setProfSaved]     = useState(false);
  const [profSaving, setProfSaving]   = useState(false);
  const [profError, setProfError]     = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword]         = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passSaving, setPassSaving]           = useState(false);
  const [passSaved, setPassSaved]             = useState(false);
  const [passError, setPassError]             = useState("");

  useEffect(() => {
    if (!user) return;
    setDisplayName(user.display_name ?? "");
    setBio(user.bio ?? "");
    setProfession(user.profession ?? "general");
    setInterests(user.interests ?? []);
  }, [user]);

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
      body: {
        display_name: displayName.trim(),
        bio: bio.trim() || null,
        profession,
        interests,
      },
    });

    setProfSaving(false);
    if (res.success) {
      updateUser({
        display_name: displayName.trim(),
        bio: bio.trim() || null,
        profession,
        interests,
        onboarding_completed: interests.length > 0 || Boolean(bio.trim()),
      });
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

    if (newPassword.length < 10) {
      setPassError("Password baru minimal 10 karakter.");
      return;
    }

    if (newPassword.length > 128) {
      setPassError("Password baru maksimal 128 karakter.");
      return;
    }

    if (!/[a-z]/.test(newPassword) || !/[A-Z]/.test(newPassword) || !/[0-9]/.test(newPassword)) {
      setPassError("Password baru harus mengandung huruf kecil, huruf besar, dan angka.");
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
            {tabs.map((t) => (
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
              {!user.onboarding_completed && (
                <div className="mb-8 rounded-2xl border border-primary/20 bg-primary-light/35 p-5">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex gap-3">
                      <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-white">
                        <Sparkles size={18} />
                      </div>
                      <div>
                        <p className="font-display text-lg font-semibold text-text-main">Selesaikan onboarding komunitas</p>
                        <p className="mt-1 text-sm text-muted">Tambahkan bio singkat dan topik minat supaya pengalaman komunitas lebih relevan.</p>
                      </div>
                    </div>
                    <button onClick={() => setTab("profil")} className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark">
                      Lengkapi sekarang
                    </button>
                  </div>
                </div>
              )}
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

          {/* ── Approval Artikel ── */}
          {activeTab === "approval" && isModerator && (
            <>
              <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h1 className="font-display text-2xl font-bold">Approval Artikel</h1>
                  <p className="mt-1 text-sm text-muted">Satu tempat untuk meninjau draft AI-assisted sebelum publish. Tidak perlu masuk akun agent.</p>
                </div>
                <button
                  onClick={fetchApprovalArticles}
                  disabled={approvalLoading}
                  className="inline-flex items-center gap-2 rounded-lg border border-border-main px-4 py-2 text-sm font-medium text-text-main hover:bg-surface disabled:opacity-60"
                >
                  {approvalLoading ? <Loader2 size={14} className="animate-spin" /> : null}
                  Refresh
                </button>
              </div>
              <div className="mb-5 rounded-2xl border border-primary/20 bg-primary-light/30 p-4 text-sm text-text-main">
                <p className="font-semibold">Aturan approval</p>
                <p className="mt-1 text-muted">Approve hanya jika Guardian sudah pass/caution aman, disclaimer ada, dan tidak ada klaim diagnosis, resep personal, atau pengganti obat. Untuk Tier 3, tetap perlu keputusan Master.</p>
              </div>
              {approvalError && <p className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{approvalError}</p>}
              {approvalLoading && approvalArticles.length === 0 ? (
                <p className="text-sm text-muted">Memuat artikel review…</p>
              ) : approvalArticles.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-border-main bg-surface p-10 text-center text-muted">
                  Tidak ada artikel yang menunggu review.
                </div>
              ) : (
                <div className="space-y-4">
                  {approvalArticles.map((article) => (
                    <ApprovalArticleCard
                      key={article.id}
                      article={article}
                      token={access_token ?? ""}
                      busy={approvalActionId === article.id}
                      onActionStart={() => setApprovalActionId(article.id)}
                      onActionDone={() => { setApprovalActionId(null); fetchApprovalArticles(); }}
                      onActionError={(msg) => { setApprovalActionId(null); setApprovalError(msg); }}
                    />
                  ))}
                </div>
              )}
              {approvalMeta && approvalMeta.total > 0 && (
                <p className="mt-4 text-xs text-muted">Total menunggu review: {approvalMeta.total}</p>
              )}
            </>
          )}



          {/* ── Content QC / Audit (Admin only) ── */}
          {activeTab === "content-qc" && isAdmin && (
            <>
              <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h1 className="font-display text-2xl font-bold">Content QC / Audit</h1>
                  <p className="mt-1 text-sm text-muted">Area admin-only untuk hasil audit artikel otomatis. Laporan QC ditulis ke dashboard ini, bukan dikirim ke chat.</p>
                </div>
                <button
                  onClick={fetchQcAudits}
                  disabled={qcLoading}
                  className="inline-flex items-center gap-2 rounded-lg border border-border-main px-4 py-2 text-sm font-medium text-text-main hover:bg-surface disabled:opacity-60"
                >
                  {qcLoading ? <Loader2 size={14} className="animate-spin" /> : null}
                  Refresh
                </button>
              </div>
              <div className="mb-5 grid gap-3 rounded-2xl border border-border-main bg-card p-4 md:grid-cols-3">
                <label className="text-xs font-medium text-text-main">
                  Status QC
                  <select value={qcStatusFilter} onChange={(e) => setQcStatusFilter(e.target.value)} className="mt-1 w-full rounded-lg border border-border-main bg-white px-3 py-2 text-sm">
                    <option value="">Semua</option>
                    <option value="pass">Pass</option>
                    <option value="caution">Caution</option>
                    <option value="needs_review">Needs review</option>
                    <option value="reject">Reject</option>
                    <option value="takedown">Takedown</option>
                  </select>
                </label>
                <div className="flex items-end text-xs text-muted">
                  {qcMeta ? `${qcMeta.total} audit tercatat` : "Belum ada metadata"}
                </div>
              </div>
              {qcError && <p className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{qcError}</p>}
              {qcLoading && qcAudits.length === 0 ? (
                <p className="text-sm text-muted">Memuat hasil QC…</p>
              ) : qcAudits.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-border-main bg-surface p-10 text-center text-muted">
                  Belum ada hasil Content QC.
                </div>
              ) : (
                <div className="space-y-4">
                  {qcAudits.map((audit) => <ContentQcAuditCard key={audit.id} audit={audit} />)}
                </div>
              )}
            </>
          )}

          {/* ── Moderasi ── */}
          {activeTab === "moderasi" && isModerator && (
            <>
              <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h1 className="font-display text-2xl font-bold">Laporan Moderasi</h1>
                  <p className="mt-1 text-sm text-muted">Antrian laporan forum berdasarkan filter yang dipilih.</p>
                </div>
                <button
                  onClick={fetchReports}
                  disabled={reportsLoading}
                  className="inline-flex items-center gap-2 rounded-lg border border-border-main px-4 py-2 text-sm font-medium text-text-main hover:bg-surface disabled:opacity-60"
                >
                  {reportsLoading ? <Loader2 size={14} className="animate-spin" /> : null}
                  Refresh
                </button>
              </div>
              <div className="mb-5 grid gap-3 rounded-2xl border border-border-main bg-card p-4 md:grid-cols-5">
                <label className="text-xs font-medium text-text-main">
                  Status
                  <select value={reportStatusFilter} onChange={(e) => { setReportStatusFilter(e.target.value); setReportPage(1); }} className="mt-1 w-full rounded-lg border border-border-main bg-white px-3 py-2 text-sm">
                    <option value="">Semua</option>
                    <option value="open">Terbuka</option>
                    <option value="reviewed">Ditinjau</option>
                    <option value="dismissed">Diabaikan</option>
                    <option value="actioned">Ditindak</option>
                  </select>
                </label>
                <label className="text-xs font-medium text-text-main">
                  Alasan
                  <select value={reportReasonFilter} onChange={(e) => { setReportReasonFilter(e.target.value); setReportPage(1); }} className="mt-1 w-full rounded-lg border border-border-main bg-white px-3 py-2 text-sm">
                    <option value="">Semua</option>
                    {Object.entries(REPORT_REASONS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                  </select>
                </label>
                <label className="text-xs font-medium text-text-main">
                  Tipe Konten
                  <select value={reportTypeFilter} onChange={(e) => { setReportTypeFilter(e.target.value); setReportPage(1); }} className="mt-1 w-full rounded-lg border border-border-main bg-white px-3 py-2 text-sm">
                    <option value="">Semua</option>
                    <option value="thread">Thread</option>
                    <option value="reply">Reply</option>
                  </select>
                </label>
                <label className="text-xs font-medium text-text-main">
                  Deteksi
                  <select value={reportAutoFilter} onChange={(e) => { setReportAutoFilter(e.target.value); setReportPage(1); }} className="mt-1 w-full rounded-lg border border-border-main bg-white px-3 py-2 text-sm">
                    <option value="">Semua</option>
                    <option value="true">Otomatis</option>
                    <option value="false">Manual user</option>
                  </select>
                </label>
                <div className="flex items-end text-xs text-muted">
                  {reportsMeta ? `${reportsMeta.total} laporan · halaman ${reportsMeta.page}/${reportsMeta.total_pages}` : "Memuat metadata…"}
                </div>
              </div>
              {reportError && <p className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{reportError}</p>}
              {reportsLoading && reports.length === 0 ? (
                <p className="text-sm text-muted">Memuat laporan…</p>
              ) : reports.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-border-main bg-surface p-10 text-center text-muted">
                  Tidak ada laporan terbuka.
                </div>
              ) : (
                <>
                  <div className="space-y-4">
                    {reports.map((report) => (
                      <ModerationReportCard
                        key={report.id}
                        report={report}
                        busy={reportActionId === report.id}
                        token={access_token ?? ""}
                        onActionStart={() => setReportActionId(report.id)}
                        onActionDone={() => { setReportActionId(null); fetchReports(); }}
                        onActionError={(msg) => { setReportActionId(null); setReportError(msg); }}
                      />
                    ))}
                  </div>
                {reportsMeta && reportsMeta.total_pages > 1 && (
                  <div className="mt-5 flex items-center justify-between rounded-xl border border-border-main bg-card px-4 py-3 text-sm">
                    <button disabled={reportsMeta.page <= 1 || reportsLoading} onClick={() => setReportPage((p) => Math.max(1, p - 1))} className="rounded-lg border border-border-main px-3 py-1.5 disabled:opacity-50">
                      Sebelumnya
                    </button>
                    <span className="text-muted">Halaman {reportsMeta.page} dari {reportsMeta.total_pages}</span>
                    <button disabled={reportsMeta.page >= reportsMeta.total_pages || reportsLoading} onClick={() => setReportPage((p) => p + 1)} className="rounded-lg border border-border-main px-3 py-1.5 disabled:opacity-50">
                      Berikutnya
                    </button>
                  </div>
                )}
                </>
              )}
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
                  <label className="mb-1 block text-sm font-medium text-text-main">Peran belajar</label>
                  <select
                    value={profession}
                    onChange={(e) => setProfession(e.target.value)}
                    className="w-full rounded-xl border border-border-main bg-white px-4 py-2.5 text-sm outline-none focus:border-primary"
                  >
                    <option value="general">Umum / peminat TCM</option>
                    <option value="student">Mahasiswa / sedang belajar TCM</option>
                    <option value="practitioner">Praktisi TCM</option>
                  </select>
                  <p className="mt-1 text-xs text-muted">Untuk badge praktisi terverifikasi tetap perlu verifikasi admin.</p>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-text-main">Minat TCM</label>
                  <div className="flex flex-wrap gap-2">
                    {USER_INTERESTS.map((item) => {
                      const active = interests.includes(item.value);
                      return (
                        <button
                          key={item.value}
                          type="button"
                          onClick={() => setInterests((current) => active ? current.filter((v) => v !== item.value) : [...current, item.value])}
                          className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                            active
                              ? "border-primary bg-primary text-white"
                              : "border-border-main bg-white text-muted hover:bg-surface"
                          }`}
                          aria-pressed={active}
                        >
                          {item.label}
                        </button>
                      );
                    })}
                  </div>
                  <p className="mt-2 text-xs text-muted">Pilih satu atau lebih topik yang ingin Anda ikuti.</p>
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
                      minLength={10}
                      maxLength={128}
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
                      minLength={10}
                      maxLength={128}
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
                    Gunakan 10-128 karakter dengan huruf kecil, huruf besar, dan angka. Setelah berhasil diubah, login berikutnya gunakan password baru.
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



function ContentQcAuditCard({ audit }: { audit: ContentQcAudit }) {
  const statusClass = audit.status === "pass"
    ? "bg-green-100 text-green-700"
    : audit.status === "caution" || audit.status === "needs_review"
      ? "bg-amber-light text-amber-tcm"
      : "bg-red-100 text-red-700";

  return (
    <article className="rounded-2xl border border-border-main bg-card p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className={`rounded-full px-2 py-0.5 font-semibold ${statusClass}`}>{audit.status}</span>
            {audit.recommended_action && <span className="rounded-full bg-surface px-2 py-0.5 font-semibold text-muted">Action: {audit.recommended_action}</span>}
            {audit.risk_tier ? <span className="rounded-full bg-surface px-2 py-0.5 font-semibold text-muted">Tier {audit.risk_tier}</span> : null}
            <span className="text-muted">{new Date(audit.created_at).toLocaleString("id-ID", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}</span>
          </div>
          <h2 className="mt-3 font-display text-lg font-bold text-text-main">{audit.article_title}</h2>
          <p className="mt-1 text-xs text-muted">
            {audit.author_username ? `@${audit.author_username}` : "author tidak tercatat"}
            {audit.article_slug ? ` · /${audit.article_slug}` : ""}
          </p>
        </div>
        {audit.article_slug && (
          <Link href={`/artikel/${audit.article_slug}`} target="_blank" className="inline-flex items-center gap-1 rounded-lg border border-border-main px-3 py-1.5 text-xs font-medium text-primary hover:bg-surface">
            Artikel <ExternalLink size={13} />
          </Link>
        )}
      </div>
      <div className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
        <div className="rounded-xl bg-surface p-3"><p className="text-xs text-muted">Quality</p><p className="font-semibold">{audit.quality_score ?? "-"}/100</p></div>
        <div className="rounded-xl bg-surface p-3"><p className="text-xs text-muted">Duplikasi</p><p className="font-semibold">{audit.duplicate_score ?? "-"}/100</p></div>
        <div className="rounded-xl bg-surface p-3"><p className="text-xs text-muted">Dibuat oleh</p><p className="font-semibold">{audit.created_by ?? "content-qc"}</p></div>
      </div>
      {audit.summary && <p className="mt-4 text-sm leading-relaxed text-text-main">{audit.summary}</p>}
      {audit.issues && audit.issues.length > 0 && (
        <div className="mt-4 rounded-xl border border-border-main bg-surface p-3">
          <p className="mb-2 text-xs font-semibold text-text-main">Catatan QC</p>
          <ul className="list-disc space-y-1 pl-5 text-sm text-muted">
            {audit.issues.slice(0, 8).map((issue, idx) => <li key={idx}>{issue}</li>)}
          </ul>
        </div>
      )}
      {audit.source_basis && audit.source_basis.length > 0 && (
        <div className="mt-4 rounded-xl border border-border-main bg-white p-3">
          <p className="mb-2 text-xs font-semibold text-text-main">Basis sumber</p>
          <ul className="space-y-2 text-sm text-muted">
            {audit.source_basis.slice(0, 5).map((src, idx) => (
              <li key={idx}>
                <span className="font-medium text-text-main">{src.title || src.ref || "Sumber"}</span>
                {src.type ? <span> · {src.type}</span> : null}
                {src.note ? <p className="text-xs">{src.note}</p> : null}
              </li>
            ))}
          </ul>
        </div>
      )}
    </article>
  );
}

function ApprovalArticleCard({
  article,
  busy,
  token,
  onActionStart,
  onActionDone,
  onActionError,
}: {
  article: ApprovalArticle;
  busy: boolean;
  token: string;
  onActionStart: () => void;
  onActionDone: () => void;
  onActionError: (message: string) => void;
}) {
  async function updateStatus(status: "published" | "draft" | "archived", reason: string) {
    if (status === "published") {
      const ok = window.confirm(`Publish artikel "${article.title}" ke publik sekarang?`);
      if (!ok) return;
    }
    onActionStart();
    const res = await apiFetch<{ message: string }>(`/admin/articles/${article.id}/status`, {
      method: "PATCH",
      token,
      body: { status, reason },
    });
    if (res.success) {
      onActionDone();
      return;
    }
    onActionError(res.error.message || "Gagal memperbarui status artikel.");
  }

  return (
    <article className="rounded-2xl border border-border-main bg-card p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="rounded-full bg-amber-light px-2 py-0.5 font-semibold text-amber-tcm">Review</span>
            <span className="rounded-full bg-surface px-2 py-0.5 font-semibold text-muted">{article.access_tier}</span>
            <span className="text-muted">{new Date(article.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}</span>
          </div>
          <h2 className="mt-3 font-display text-lg font-bold text-text-main">{article.title}</h2>
          <p className="mt-1 break-all text-xs text-muted">/{article.slug}</p>
        </div>
        <Link href={`/artikel/${article.slug}`} target="_blank" className="inline-flex items-center gap-1 rounded-lg border border-border-main px-3 py-1.5 text-xs font-medium text-primary hover:bg-surface">
          Preview <Eye size={13} />
        </Link>
      </div>
      <div className="mt-5 flex flex-wrap gap-2 border-t border-border-main pt-4">
        <button disabled={busy} onClick={() => updateStatus("published", "Disetujui dari dashboard approval.")} className="inline-flex items-center gap-1 rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-white hover:bg-primary-dark disabled:opacity-60">
          <Check size={13} /> Approve & Publish
        </button>
        <button disabled={busy} onClick={() => updateStatus("draft", "Dikembalikan ke draft untuk revisi.")} className="rounded-lg border border-border-main px-3 py-2 text-xs font-medium text-text-main hover:bg-surface disabled:opacity-60">
          Kembalikan ke Draft
        </button>
        <button disabled={busy} onClick={() => {
          const reason = window.prompt("Alasan arsip/tolak artikel:", "Perlu revisi safety / kualitas sebelum publish.");
          if (!reason) return;
          updateStatus("archived", reason);
        }} className="inline-flex items-center gap-1 rounded-lg bg-red-600 px-3 py-2 text-xs font-semibold text-white hover:bg-red-700 disabled:opacity-60">
          <XCircle size={13} /> Tolak / Arsip
        </button>
      </div>
    </article>
  );
}

function ModerationReportCard({
  report,
  busy,
  token,
  onActionStart,
  onActionDone,
  onActionError,
}: {
  report: ModerationReport;
  busy: boolean;
  token: string;
  onActionStart: () => void;
  onActionDone: () => void;
  onActionError: (message: string) => void;
}) {
  async function updateReport(status: "reviewed" | "dismissed" | "actioned", opts: { hide_content?: boolean; lock_thread?: boolean; deletion_reason?: string } = {}) {
    onActionStart();
    const res = await apiFetch<{ message: string }>(`/admin/reports/${report.id}`, {
      method: "PATCH",
      token,
      body: {
        status,
        resolution_note: opts.deletion_reason ?? (status === "actioned" ? "Ditindak dari dashboard moderasi." : "Ditinjau dari dashboard moderasi."),
        ...opts,
      },
    });
    if (res.success) {
      onActionDone();
      return;
    }
    onActionError(res.error.message || "Gagal memperbarui laporan.");
  }

  return (
    <article className="rounded-2xl border border-border-main bg-card p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="rounded-full bg-red-100 px-2 py-0.5 font-semibold text-red-700">{REPORT_STATUS[report.status] ?? report.status}</span>
            <span className="rounded-full bg-amber-light px-2 py-0.5 font-semibold text-amber-tcm">{REPORT_REASONS[report.reason] ?? report.reason}</span>
            {report.auto_detected && <span className="rounded-full bg-purple-100 px-2 py-0.5 font-semibold text-purple-700">Auto-detect</span>}
            <span className="text-muted">{new Date(report.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}</span>
          </div>
          <h2 className="mt-3 font-display text-lg font-bold text-text-main">
            {report.target.thread_title || `${report.target.type} ${report.target.id}`}
          </h2>
          <p className="mt-1 text-xs text-muted">
            Dilaporkan oleh @{report.reporter.username ?? "unknown"} · Target: {report.target.type}
          </p>
        </div>
        {report.target.url && (
          <Link href={report.target.url} className="inline-flex items-center gap-1 rounded-lg border border-border-main px-3 py-1.5 text-xs font-medium text-primary hover:bg-surface">
            Buka konten <ExternalLink size={13} />
          </Link>
        )}
      </div>
      {report.target.reply_excerpt && (
        <blockquote className="mt-4 rounded-lg border-l-4 border-border-main bg-surface px-4 py-3 text-sm text-muted">
          {report.target.reply_excerpt}
        </blockquote>
      )}
      {report.details && <p className="mt-4 text-sm text-text-main">{report.details}</p>}
      {report.safety_matches && report.safety_matches.length > 0 && (
        <p className="mt-2 text-xs text-purple-700">Pola terdeteksi: {report.safety_matches.join(", ")}</p>
      )}
      <div className="mt-5 flex flex-wrap gap-2 border-t border-border-main pt-4">
        <button disabled={busy} onClick={() => updateReport("reviewed")} className="rounded-lg border border-border-main px-3 py-2 text-xs font-medium text-text-main hover:bg-surface disabled:opacity-60">
          Tandai ditinjau
        </button>
        <button disabled={busy} onClick={() => updateReport("dismissed")} className="rounded-lg border border-border-main px-3 py-2 text-xs font-medium text-muted hover:bg-surface disabled:opacity-60">
          Abaikan
        </button>
        <button disabled={busy} onClick={() => updateReport("actioned", { lock_thread: true })} className="rounded-lg bg-amber-tcm px-3 py-2 text-xs font-semibold text-white hover:bg-amber-700 disabled:opacity-60">
          Lock thread
        </button>
        <button disabled={busy} onClick={() => {
          const reason = window.prompt("Alasan menyembunyikan konten:", "Melanggar pedoman komunitas / klaim medis berbahaya.");
          if (!reason) return;
          updateReport("actioned", { hide_content: true, deletion_reason: reason });
        }} className="rounded-lg bg-red-600 px-3 py-2 text-xs font-semibold text-white hover:bg-red-700 disabled:opacity-60">
          Sembunyikan konten
        </button>
      </div>
    </article>
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
