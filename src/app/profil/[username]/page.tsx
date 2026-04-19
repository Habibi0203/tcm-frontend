import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Calendar } from "lucide-react";
import { mockUsers } from "@/mock/users";
import { mockArticles } from "@/mock/articles";

export async function generateMetadata({ params }: { params: { username: string } }): Promise<Metadata> {
  const u = mockUsers.find((m) => m.username === params.username);
  return {
    title: u ? `${u.display_name} (@${u.username}) — tcm.my.id` : "Profil — tcm.my.id",
    description: u?.bio ?? `Profil anggota ${params.username} di komunitas TCM Indonesia.`,
  };
}
import { mockThreads } from "@/mock/threads";
import { formatDate } from "@/lib/utils";
import ArticleCard from "@/components/ui/ArticleCard";
import MemberBadge from "@/components/ui/MemberBadge";
import ThreadRow from "@/components/ui/ThreadRow";

export default function ProfilPage({ params }: { params: { username: string } }) {
  const user = mockUsers.find((u) => u.username === params.username);
  if (!user) notFound();

  const userArticles = mockArticles.filter((a) => a.author_id === user.id);
  const userThreads = mockThreads.filter((t) => t.author.id === user.id);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8 rounded-2xl border border-border-main bg-gradient-to-br from-primary-light/40 to-white p-6 sm:p-8">
        <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center">
          <Image
            src={user.avatar_url}
            alt={user.display_name}
            width={100}
            height={100}
            className="rounded-full border-4 border-white shadow-sm"
          />
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
            <p className="mt-4 max-w-2xl text-sm text-text-main">{user.bio}</p>
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
              <ArticleCard key={a.id} article={a} />
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
              <ThreadRow key={t.id} thread={t} />
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
