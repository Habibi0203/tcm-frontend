"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Loader2, MessageCircle, Send } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { apiFetch } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import { useToast } from "@/components/ui/Toast";
import MemberBadge from "@/components/ui/MemberBadge";

export interface ArticleCommentItem {
  id: string;
  article_id?: string;
  parent_id?: string | null;
  content: string;
  like_count?: number;
  created_at: string;
  author: {
    id: string;
    username: string;
    display_name: string;
    avatar_url: string | null;
    role?: string;
  } | null;
}

interface ArticleCommentsProps {
  articleId: string;
  initialComments: ArticleCommentItem[];
}

export default function ArticleComments({ articleId, initialComments }: ArticleCommentsProps) {
  const { isAuthenticated, access_token, user } = useAuthStore();
  const { toast } = useToast();
  const [comments, setComments] = useState<ArticleCommentItem[]>(initialComments);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function loadComments() {
    setLoading(true);
    const result = await apiFetch<ArticleCommentItem[]>(`/articles/${articleId}/comments`);
    setLoading(false);

    if (!result.success) {
      toast(result.error.message ?? "Gagal memuat komentar.", "error");
      return;
    }

    setComments(result.data);
  }

  useEffect(() => {
    setComments(initialComments);
  }, [initialComments]);

  async function handleSubmit() {
    const trimmed = content.trim();
    if (!trimmed) {
      toast("Komentar tidak boleh kosong.", "error");
      return;
    }
    if (!isAuthenticated || !access_token) {
      toast("Login terlebih dahulu untuk berkomentar.", "error");
      return;
    }

    setSubmitting(true);
    const result = await apiFetch<ArticleCommentItem>(`/articles/${articleId}/comments`, {
      method: "POST",
      token: access_token,
      body: { content: trimmed },
    });
    setSubmitting(false);

    if (!result.success) {
      toast(result.error.message ?? "Gagal mengirim komentar.", "error");
      return;
    }

    setContent("");
    toast("Komentar berhasil dikirim.", "success");

    const optimisticAuthor = user
      ? {
          id: user.id,
          username: user.username,
          display_name: user.display_name,
          avatar_url: user.avatar_url,
          role: user.role,
        }
      : null;

    setComments((prev) => [
      {
        ...result.data,
        author: result.data.author ?? optimisticAuthor,
      },
      ...prev,
    ]);

    const refresh = await apiFetch<ArticleCommentItem[]>(`/articles/${articleId}/comments`);
    if (refresh.success) {
      setComments(refresh.data);
    }
  }

  return (
    <section className="mt-10 border-t border-border-main pt-8">
      <div className="mb-5 flex items-center justify-between gap-3">
        <h2 className="font-display text-xl font-bold text-text-main">
          Diskusi ({comments.length})
        </h2>
        <button
          onClick={loadComments}
          disabled={loading}
          className="text-sm text-primary hover:text-primary-dark disabled:opacity-60"
        >
          {loading ? "Memuat..." : "Refresh"}
        </button>
      </div>

      <div className="mb-6 rounded-2xl border border-border-main bg-card">
        <div className="border-b border-border-main px-4 py-3">
          <span className="text-sm font-semibold text-text-main">Tulis Komentar</span>
        </div>

        {isAuthenticated ? (
          <>
            <div className="p-4">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={4}
                maxLength={2000}
                placeholder="Bagikan pengalaman, pertanyaan, atau tanggapan Anda tentang artikel ini..."
                className="w-full rounded-xl border border-border-main bg-surface px-4 py-3 text-sm text-text-main outline-none transition focus:border-primary"
              />
              <div className="mt-2 text-right text-xs text-muted">{content.length}/2000</div>
            </div>
            <div className="flex justify-end border-t border-border-main px-4 py-3">
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-dark disabled:opacity-60"
              >
                {submitting ? (
                  <>
                    <Loader2 size={14} className="animate-spin" /> Mengirim...
                  </>
                ) : (
                  <>
                    <Send size={14} /> Kirim Komentar
                  </>
                )}
              </button>
            </div>
          </>
        ) : (
          <div className="px-4 py-6 text-center">
            <p className="mb-3 text-sm text-muted">Login untuk ikut berdiskusi di artikel ini.</p>
            <Link href="/masuk" className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-dark">
              Masuk / Daftar
            </Link>
          </div>
        )}
      </div>

      {comments.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border-main bg-surface px-5 py-8 text-center text-sm text-muted">
          <div className="mb-2 flex justify-center text-primary"><MessageCircle size={20} /></div>
          Belum ada komentar. Jadilah yang pertama memulai diskusi.
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment.id} className="flex gap-3 rounded-xl border border-border-main p-4">
              <div className="h-9 w-9 shrink-0 overflow-hidden rounded-full bg-border-main">
                {comment.author?.avatar_url ? (
                  <Image src={comment.author.avatar_url} alt={comment.author.display_name} width={36} height={36} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-xs font-bold text-primary">
                    {(comment.author?.display_name ?? "?")[0]}
                  </div>
                )}
              </div>
              <div className="flex-1">
                <div className="mb-1 flex flex-wrap items-center gap-2">
                  <span className="text-sm font-semibold text-text-main">{comment.author?.display_name ?? "Anonim"}</span>
                  {comment.author?.role && (
                    <MemberBadge role={comment.author.role as "member" | "moderator" | "admin" | "superadmin"} />
                  )}
                  <span className="text-xs text-muted">{formatDate(comment.created_at)}</span>
                </div>
                <p className="whitespace-pre-wrap text-sm text-text-main">{comment.content}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
