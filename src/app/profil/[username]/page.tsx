import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Calendar } from "lucide-react";
import { serverFetch } from "@/lib/api";
import { formatDate } from "@/lib/utils";
import ArticleCard from "@/components/ui/ArticleCard";
import MemberBadge from "@/components/ui/MemberBadge";
import ThreadRow from "@/components/ui/ThreadRow";

interface UserProfile {
  id: string;
  username: string;
  display_name: string;
  avatar_url: string | null;
  bio: string | null;
  profession: "general" | "practitioner" | "student";
  role: "member" | "moderator" | "admin" | "superadmin" | "agent";
  membership_tier: "free" | "premium";
  is_verified: boolean;
  is_active: boolean;
  created_at: string;
}

interface ProfileArticle {
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

interface ProfileThread {
  id: string;
  title: string;
  slug: string;
  subforum: { id: string; name: string; slug: string };
  author: { id: string; username: string; display_name: string; avatar_url: string | null; role: string };
  reply_count: number;
  is_pinned: boolean;
  is_locked: boolean;
  created_at: string;
  last_activity_at: string | null;
}

export async function generateMetadata({ params }: { params: { username: string } }): Promise<Metadata> {
  const res = await serverFetch<UserProfile>(`/users/${params.username}`);
  const u = res.success ? res.data : null;
  return {
    title: u ? `${u.display_name} (@${u.username}) — tcm.my.id` : "Profil — tcm.my.id",
    description: u?.bio ?? `Profil anggota ${params.username} di komunitas TCM Indonesia.`,
  };
}

export default async function ProfilPage({ params }: { params: { username: string } }) {
  const userRes = await serverFetch<UserProfile>(`/users/${params.username}`);
  if (!userRes.success) notFound();
  const user = userRes.data;

  // Fetch user's articles and threads
  const [articlesRes, threadsRes] = await Promise.all([
    serverFetch<ProfileArticle[]>(`/articles?author=${user.id}&per_page=9`),
    serverFetch<ProfileThread[]>(`/users/${params.username}/threads`),
  ]);

  const userArticles = articlesRes.success ? articlesRes.data : [];
  const userThreads = threadsRes.success ? threadsRes.data : [];

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8 rounded-2xl border border-border-main bg-gradient-to-br from-primary-light/40 to-white p-6 sm:p-8">
        <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center">
          {user.avatar_url ? (
            <Image
              src={user.avatar_url}
              alt={user.display_name}
              width={100}
              height={100}
              className="rounded-full border-4 border-white shadow-sm"
              unoptimized
            />
          ) : (
            <div className="flex h-[100px] w-[100px] items-center justify-center rounded-full border-4 border-white bg-primary text-3xl font-bold text-white shadow-sm">
              {(user.display_name ?? "?").trim().charAt(0).toUpperCase() || "?"}
            </div>
          )}
          <div className="flex-1">
            <h1 className="font-display text-3xl font-bold text-text-main">{user.display_name}</h1>
            <div className="mt-1 text-sm text-muted">@{user.username}</div>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <MemberBadge
                tier={user.membership_tier}
                role={user.role}
                isVerified={user.is_verified && user.profession === "practitioner"}
                size="md"
              />
              <span className="inline-flex items-center gap-1 text-xs text-muted">
                <Calendar size={12} /> Bergabung {formatDate(user.created_at)}
              </span>
            </div>
            {user.bio && <p className="mt-4 max-w-2xl text-sm text-text-main">{user.bio}</p>}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="mb-10 grid grid-cols-3 gap-4">
        <StatBox label="Artikel" value={userArticles.length} />
        <StatBox label="Diskusi" value={userThreads.length} />
        <StatBox label="Reputasi" value={(userArticles.length * 10 + userThreads.length * 5).toString()} />
      </div>

      {/* Articles */}
      {userArticles.length > 0 && (
        <section className="mb-10">
          <h2 className="mb-4 font-display text-2xl font-bold">Artikel Kontribusi</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {userArticles.map((a) => (
              <ArticleCard key={a.id} article={a as Parameters<typeof ArticleCard>[0]["article"]} />
            ))}
          </div>
        </section>
      )}

      {/* Threads */}
      {userThreads.length > 0 && (
        <section>
          <h2 className="mb-4 font-display text-2xl font-bold">Diskusi</h2>
          <div className="space-y-3">
            {userThreads.map((t) => (
              <ThreadRow key={t.id} thread={t as Parameters<typeof ThreadRow>[0]["thread"]} />
            ))}
          </div>
        </section>
      )}

      {userArticles.length === 0 && userThreads.length === 0 && (
        <div className="rounded-xl border border-border-main bg-white p-10 text-center">
          <p className="text-muted">Belum ada aktivitas publik.</p>
        </div>
      )}
    </div>
  );
}

function StatBox({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border border-border-main bg-card p-4 text-center">
      <div className="font-display text-2xl font-bold text-primary">{value}</div>
      <div className="text-sm text-muted">{label}</div>
    </div>
  );
}
