"use client";

import { useEffect, useState, useRef } from "react";
import { notFound, useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Eye, MessageCircle, ThumbsUp, Pin, Lock, Send, Loader2 } from "lucide-react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { formatDate } from "@/lib/utils";
import MemberBadge from "@/components/ui/MemberBadge";
import ReplyItem from "@/components/ui/ReplyItem";
import ReportButton from "@/components/ui/ReportButton";
import { useAuthStore } from "@/store/authStore";
import { useToast } from "@/components/ui/Toast";
import { apiFetch } from "@/lib/api";

interface ThreadAuthor {
  id:           string;
  username:     string;
  display_name: string;
  avatar_url:   string | null;
  role:         string;
}

interface ReplyData {
  id:              string;
  content:         string;
  upvote_count:    number;
  created_at:      string;
  parent_reply_id: string | null;
  author:          ThreadAuthor | null;
}

interface ThreadDetail {
  id:          string;
  title:       string;
  content:     string;
  is_pinned:   boolean;
  is_locked:   boolean;
  view_count:  number;
  reply_count: number;
  created_at:  string;
  subforum:    { id: string; name: string; slug: string };
  author:      ThreadAuthor | null;
  replies?:    ReplyData[];
}

export default function ThreadDetailPage() {
  const params  = useParams<{ subforum: string; thread: string }>();
  const { isAuthenticated, access_token } = useAuthStore();
  const { toast }              = useToast();
  const [thread,   setThread]  = useState<ThreadDetail | null>(null);
  const [replies,  setReplies] = useState<ReplyData[]>([]);
  const [loading,  setLoading] = useState(true);
  const [notFoundFlag, setNotFoundFlag] = useState(false);
  const [replying, setReplying]  = useState(false);
  const [parentId, setParentId]  = useState<string | null>(null);
  const [upvoted,  setUpvoted]   = useState(false);
  const replyRef = useRef<HTMLDivElement>(null);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: parentId ? "Tulis balasan…" : "Bagikan pemikiran Anda…",
      }),
    ],
    editorProps: {
      attributes: {
        class: "min-h-[100px] px-4 py-3 text-sm focus:outline-none text-text-main leading-relaxed",
      },
    },
  });

  useEffect(() => {
    async function load() {
      setLoading(true);
      const [tRes, rRes] = await Promise.all([
        apiFetch<ThreadDetail>(`/threads/${params.thread}`),
        apiFetch<ReplyData[]>(`/threads/${params.thread}/replies`),
      ]);
      if (!tRes.success) { setNotFoundFlag(true); setLoading(false); return; }
      setThread(tRes.data);
      setReplies(rRes.success ? rRes.data : []);
      setLoading(false);
    }
    load();
  }, [params.thread]);

  function handleReply(id: string) {
    if (!isAuthenticated) { toast("Login terlebih dahulu untuk membalas.", "error"); return; }
    setParentId(id);
    replyRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    setTimeout(() => editor?.commands.focus(), 300);
  }

  async function handleSubmit() {
    const content = editor?.getText().trim();
    if (!content) { toast("Konten balasan tidak boleh kosong.", "error"); return; }
    if (!isAuthenticated) { toast("Login terlebih dahulu.", "error"); return; }
    setReplying(true);

    const result = await apiFetch<ReplyData>(`/threads/${params.thread}/replies`, {
      method: "POST",
      token: access_token ?? undefined,
      body: { content, parent_reply_id: parentId ?? undefined },
    });

    setReplying(false);

    if (!result.success) {
      toast(result.error.message ?? "Gagal mengirim balasan.", "error");
      return;
    }

    setReplies((prev) => [...prev, result.data]);
    editor?.commands.clearContent();
    setParentId(null);
    toast("Balasan berhasil dikirim!", "success");
  }

  if (notFoundFlag) notFound();

  if (loading || !thread) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-10">
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-32 animate-pulse rounded-xl bg-border-main/30" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <Link href={`/forum/${params.subforum}`}
        className="mb-4 inline-flex items-center gap-1 text-sm text-muted hover:text-primary">
        <ArrowLeft size={14} /> Kembali ke {thread.subforum.name}
      </Link>

      {/* Thread header */}
      <div className="mb-6 rounded-2xl border border-border-main bg-card p-6">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          {thread.is_pinned && (
            <span className="inline-flex items-center gap-1 rounded-full bg-primary-light px-2 py-0.5 text-xs font-semibold text-primary">
              <Pin size={10} /> Pinned
            </span>
          )}
          {thread.is_locked && (
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-light px-2 py-0.5 text-xs font-semibold text-amber-tcm">
              <Lock size={10} /> Terkunci
            </span>
          )}
        </div>
        <h1 className="mb-4 font-display text-2xl font-bold text-text-main sm:text-3xl">{thread.title}</h1>

        {/* Author info */}
        <div className="mb-4 flex items-center gap-3">
          <div className="h-10 w-10 overflow-hidden rounded-full bg-border-main">
            {thread.author?.avatar_url ? (
              <Image src={thread.author.avatar_url} alt={thread.author.display_name} width={40} height={40} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-primary-light text-sm font-bold text-primary">
                {(thread.author?.display_name ?? "?")[0]}
              </div>
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-text-main">{thread.author?.display_name ?? "Anonim"}</span>
              {thread.author && <MemberBadge role={thread.author.role as "member" | "moderator" | "admin" | "superadmin"} />}
            </div>
            <span className="text-xs text-muted">{formatDate(thread.created_at)}</span>
          </div>
        </div>

        <div className="prose prose-sm max-w-none text-text-main" dangerouslySetInnerHTML={{ __html: thread.content }} />

        <div className="mt-4 flex items-center gap-4 border-t border-border-main pt-4 text-xs text-muted">
          <span className="flex items-center gap-1"><Eye size={14} /> {thread.view_count} dilihat</span>
          <span className="flex items-center gap-1"><MessageCircle size={14} /> {thread.reply_count} balasan</span>
          <button onClick={() => setUpvoted(!upvoted)}
            className={`flex items-center gap-1 transition-colors ${upvoted ? "text-primary" : "hover:text-primary"}`}>
            <ThumbsUp size={14} /> {upvoted ? "Disukai" : "Suka"}
          </button>
          <ReportButton targetType="thread" targetId={thread.id} compact />
        </div>
      </div>

      {/* Replies */}
      <div className="mb-6 space-y-3">
        {replies.map((r) => (
          <ReplyItem key={r.id} reply={r as Parameters<typeof ReplyItem>[0]["reply"]} onReply={handleReply} />
        ))}
      </div>

      {/* Reply form */}
      {!thread.is_locked && (
        <div ref={replyRef} className="rounded-2xl border border-border-main bg-card">
          <div className="border-b border-border-main px-4 py-3">
            <span className="text-sm font-semibold text-text-main">
              {parentId ? "Balas komentar" : "Tulis Balasan"}
            </span>
            {parentId && (
              <button onClick={() => setParentId(null)} className="ml-2 text-xs text-muted hover:text-primary">
                (batal)
              </button>
            )}
          </div>
          {isAuthenticated ? (
            <>
              <EditorContent editor={editor} />
              <div className="flex justify-end border-t border-border-main px-4 py-3">
                <button onClick={handleSubmit} disabled={replying}
                  className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-dark disabled:opacity-60">
                  {replying ? <><Loader2 size={14} className="animate-spin" /> Mengirim…</> : <><Send size={14} /> Kirim Balasan</>}
                </button>
              </div>
            </>
          ) : (
            <div className="px-4 py-6 text-center">
              <p className="mb-3 text-sm text-muted">Login untuk ikut berdiskusi</p>
              <Link href="/masuk" className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-dark">
                Masuk / Daftar
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
