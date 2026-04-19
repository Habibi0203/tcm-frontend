"use client";

import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { ArrowLeft, Eye, MessageCircle, ThumbsUp, Pin, Lock, Send, Loader2 } from "lucide-react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { getThreadById } from "@/mock/threads";
import { formatDate } from "@/lib/utils";
import MemberBadge from "@/components/ui/MemberBadge";
import ReplyItem from "@/components/ui/ReplyItem";
import { useAuthStore } from "@/store/authStore";
import { useToast } from "@/components/ui/Toast";
import type { ThreadReply } from "@/mock/threads";

export default function ThreadDetailPage({
  params,
}: {
  params: { subforum: string; thread: string };
}) {
  const thread = getThreadById(params.thread);
  if (!thread) notFound();

  const { user, isAuthenticated } = useAuthStore();
  const { toast }                 = useToast();
  const [replying, setReplying]   = useState(false);
  const [parentId, setParentId]   = useState<string | null>(null);
  const [upvoted,  setUpvoted]    = useState(false);
  const replyRef                  = useRef<HTMLDivElement>(null);

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
        class:
          "min-h-[100px] px-4 py-3 text-sm focus:outline-none text-text-main leading-relaxed",
      },
    },
  });

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
    await new Promise((r) => setTimeout(r, 600));
    setReplying(false);
    editor?.commands.clearContent();
    setParentId(null);
    toast("Balasan berhasil dikirim!", "success");
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <Link
        href={`/forum/${params.subforum}`}
        className="mb-4 inline-flex items-center gap-1 text-sm text-muted hover:text-primary"
      >
        <ArrowLeft size={14} /> Kembali ke {thread.subforum.name}
      </Link>

      {/* Thread header */}
      <div className="mb-6 rounded-2xl border border-border-main bg-card p-6">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          {thread.is_pinned && (
            <span className="inline-flex items-center gap-1 rounded-full bg-primary-light px-2 py-0.5 text-xs font-semibold text-primary-dark">
              <Pin size={10} /> Dipinkan
            </span>
          )}
          {thread.is_locked && (
            <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 text-xs font-semibold text-muted">
              <Lock size={10} /> Terkunci
            </span>
          )}
          <span className="text-xs text-muted">Diposting di {thread.subforum.name}</span>
        </div>

        <h1 className="mb-4 font-display text-3xl font-bold text-text-main">
          {thread.title}
        </h1>

        {/* Author */}
        <div className="mb-6 flex items-center gap-3 border-b border-border-main pb-4">
          <Image
            src={thread.author.avatar_url}
            alt={thread.author.display_name}
            width={44}
            height={44}
            className="rounded-full"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-medium text-text-main">{thread.author.display_name}</span>
              <MemberBadge
                tier={thread.author.membership_tier}
                role={thread.author.role}
                isVerified={thread.author.is_verified}
              />
            </div>
            <div className="text-xs text-muted">{formatDate(thread.created_at)}</div>
          </div>
        </div>

        {/* Thread body */}
        <div className="whitespace-pre-line text-[17px] leading-relaxed text-text-main">
          {thread.content}
        </div>

        {/* Stats bar */}
        <div className="mt-6 flex items-center gap-4 border-t border-border-main pt-4 text-sm text-muted">
          <button
            onClick={() => setUpvoted((v) => !v)}
            className={`flex items-center gap-1 transition-colors hover:text-primary ${upvoted ? "font-semibold text-primary" : ""}`}
          >
            <ThumbsUp size={14} />
            {thread.upvote_count + (upvoted ? 1 : 0)}
          </button>
          <span className="flex items-center gap-1">
            <MessageCircle size={14} /> {thread.reply_count} balasan
          </span>
          <span className="flex items-center gap-1">
            <Eye size={14} /> {thread.view_count}
          </span>
        </div>
      </div>

      {/* Replies */}
      <h2 className="mb-4 font-display text-xl font-semibold">
        Balasan ({thread.reply_count})
      </h2>
      <div className="space-y-5">
        {(thread.replies ?? []).length > 0 ? (
          (thread.replies as ThreadReply[]).map((r) => (
            <div key={r.id} className="rounded-xl border border-border-main bg-card p-5">
              <ReplyItem reply={r} onUpvote={() => undefined} onReply={handleReply} />
            </div>
          ))
        ) : (
          <p className="rounded-xl bg-surface p-6 text-center text-sm text-muted">
            Belum ada balasan. Jadilah yang pertama!
          </p>
        )}
      </div>

      {/* Tiptap reply form */}
      {!thread.is_locked && (
        <div ref={replyRef} className="mt-8 rounded-2xl border border-border-main bg-white">
          <div className="border-b border-border-main px-5 py-3">
            <h3 className="text-sm font-semibold text-text-main">
              {parentId ? "Membalas komentar" : "Tulis Balasan"}
            </h3>
            {parentId && (
              <button
                onClick={() => setParentId(null)}
                className="text-xs text-muted underline hover:text-primary"
              >
                Batal membalas
              </button>
            )}
          </div>

          {isAuthenticated && user ? (
            <>
              <div className="flex gap-3 p-4">
                <Image
                  src={user.avatar_url}
                  alt={user.display_name}
                  width={32}
                  height={32}
                  className="mt-1 shrink-0 rounded-full"
                />
                <div className="min-h-[120px] flex-1 rounded-xl border border-border-main focus-within:border-primary">
                  <EditorContent editor={editor} />
                </div>
              </div>
              <div className="flex justify-end px-4 pb-4">
                <button
                  onClick={handleSubmit}
                  disabled={replying}
                  className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-dark disabled:opacity-60"
                >
                  {replying ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <Send size={14} />
                  )}
                  {replying ? "Mengirim…" : "Kirim Balasan"}
                </button>
              </div>
            </>
          ) : (
            <div className="p-6 text-center text-sm text-muted">
              <Link href="/masuk" className="font-medium text-primary hover:underline">
                Login
              </Link>{" "}
              untuk ikut berdiskusi.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
