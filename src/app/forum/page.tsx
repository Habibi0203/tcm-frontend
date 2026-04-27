import type { Metadata } from "next";
import Link from "next/link";
import { MessageCircle, Lock, ArrowRight } from "lucide-react";
import { serverFetch } from "@/lib/api";
import { formatRelativeTime } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Forum Diskusi — tcm.my.id",
  description: "Diskusi TCM bersama komunitas.",
};

interface Subforum {
  id:               string;
  name:             string;
  slug:             string;
  description:      string;
  access_tier:      "free" | "premium";
  thread_count:     number;
  last_activity_at: string | null;
}

export default async function ForumPage() {
  const res = await serverFetch<Subforum[]>("/subforums");
  const subforums = res.success ? res.data : [];

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="mb-8">
        <h1 className="font-display text-4xl font-bold text-text-main">Forum Komunitas</h1>
        <p className="mt-2 text-muted">Tempat bertukar pikiran, bertanya, dan berbagi pengalaman seputar TCM.</p>
      </header>

      {subforums.length === 0 ? (
        <div className="rounded-xl border border-border-main bg-white p-10 text-center">
          <p className="font-display text-xl font-semibold">Forum belum tersedia</p>
          <p className="mt-2 text-sm text-muted">Silakan coba beberapa saat lagi.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {subforums.map((s) => (
            <Link key={s.id} href={`/forum/${s.slug}`}
              className="group rounded-xl border border-border-main bg-card p-6 transition-all hover:border-primary hover:shadow-md">
              <div className="mb-3 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-light text-primary">
                  <MessageCircle size={20} />
                </div>
                <div className="flex-1">
                  <h2 className="font-display text-xl font-semibold text-text-main group-hover:text-primary">
                    {s.name}
                  </h2>
                </div>
                {s.access_tier === "premium" && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-light px-2 py-0.5 text-xs font-semibold text-amber-tcm">
                    <Lock size={10} /> Akses Khusus
                  </span>
                )}
              </div>
              <p className="mb-4 text-sm text-muted">{s.description}</p>
              <div className="flex items-center justify-between text-xs text-muted">
                <span>{s.thread_count} thread</span>
                <span>Aktivitas: {s.last_activity_at ? formatRelativeTime(s.last_activity_at) : "—"}</span>
              </div>
              <div className="mt-4 flex items-center gap-1 text-sm font-medium text-primary">
                Masuk Subforum <ArrowRight size={14} />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
