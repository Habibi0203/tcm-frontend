"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import {
  ArrowLeft,
  Bold,
  Italic,
  List,
  ListOrdered,
  Loader2,
  Quote,
  Send,
  Undo2,
  Redo2,
  Lock,
} from "lucide-react";
import { apiFetch } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import { useToast } from "@/components/ui/Toast";

interface SubforumDetail {
  id: string;
  name: string;
  slug: string;
  description: string;
  access_tier: "free" | "premium";
  thread_count: number;
  last_activity_at: string | null;
}

export default function NewThreadPage() {
  const params = useParams<{ subforum: string }>();
  const router = useRouter();
  const { toast } = useToast();
  const { user, isAuthenticated, access_token, _hasHydrated } = useAuthStore();

  const [subforum, setSubforum] = useState<SubforumDetail | null>(null);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: "Jelaskan topik diskusi Anda dengan jelas dan ringkas…",
      }),
    ],
    editorProps: {
      attributes: {
        class:
          "prose prose-sm max-w-none min-h-[220px] px-4 py-3 focus:outline-none text-text-main leading-relaxed",
      },
    },
  });

  useEffect(() => {
    let cancelled = false;

    async function loadSubforum() {
      setLoading(true);
      const res = await apiFetch<SubforumDetail>(`/subforums/${params.subforum}`);
      if (cancelled) return;

      if (!res.success) {
        toast(res.error?.message || "Subforum tidak ditemukan.", "error");
        router.push("/forum");
        return;
      }

      setSubforum(res.data);
      setLoading(false);
    }

    loadSubforum();
    return () => {
      cancelled = true;
    };
  }, [params.subforum, router, toast]);

  const needsPremium = useMemo(() => {
    if (!subforum || subforum.access_tier !== "premium") return false;
    if (!user) return true;
    const privileged = user.role === "admin" || user.role === "moderator" || user.role === "agent";
    return !privileged && user.membership_tier !== "premium";
  }, [subforum, user]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!isAuthenticated || !access_token) {
      toast("Login terlebih dahulu untuk membuat thread.", "error");
      return;
    }

    const html = editor?.getHTML() ?? "";
    const plainText = editor?.getText().trim() ?? "";

    if (title.trim().length < 5) {
      toast("Judul thread minimal 5 karakter.", "error");
      return;
    }

    if (plainText.length < 10) {
      toast("Isi thread minimal 10 karakter.", "error");
      return;
    }

    setSubmitting(true);
    const res = await apiFetch<{ id: string; title: string; created_at: string }>(`/subforums/${params.subforum}/threads`, {
      method: "POST",
      token: access_token,
      body: {
        title: title.trim(),
        content: html,
      },
    });
    setSubmitting(false);

    if (!res.success) {
      toast(res.error?.message || "Gagal membuat thread baru.", "error");
      return;
    }

    toast("Thread baru berhasil dibuat.", "success");
    router.push(`/forum/${params.subforum}/${res.data.id}`);
  }

  if (loading || !_hasHydrated) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="space-y-4">
          <div className="h-8 w-40 animate-pulse rounded bg-border-main/40" />
          <div className="h-40 animate-pulse rounded-2xl bg-border-main/30" />
          <div className="h-72 animate-pulse rounded-2xl bg-border-main/30" />
        </div>
      </div>
    );
  }

  if (!subforum) return null;

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <Link
        href={`/forum/${params.subforum}`}
        className="mb-4 inline-flex items-center gap-1 text-sm text-muted hover:text-primary"
      >
        <ArrowLeft size={14} /> Kembali ke {subforum.name}
      </Link>

      <header className="mb-8">
        <div className="mb-2 flex items-center gap-2">
          {subforum.access_tier === "premium" ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-light px-2 py-0.5 text-xs font-semibold text-amber-tcm">
              <Lock size={10} /> Akses Khusus
            </span>
          ) : null}
        </div>
        <h1 className="font-display text-3xl font-bold text-text-main">Thread Baru</h1>
        <p className="mt-2 text-sm text-muted">
          Mulai diskusi baru di <span className="font-medium text-text-main">{subforum.name}</span>.
          Tulis judul yang jelas dan jelaskan konteks seperlunya supaya anggota lain mudah membantu.
        </p>
      </header>

      {!isAuthenticated ? (
        <div className="rounded-2xl border border-border-main bg-card p-6 text-center">
          <p className="mb-3 text-sm text-muted">Login dulu untuk membuat thread baru.</p>
          <Link
            href="/masuk"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-dark"
          >
            Masuk / Daftar
          </Link>
        </div>
      ) : needsPremium ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-light/30 p-6">
          <p className="text-sm text-text-main">
            Area ini belum dibuka untuk semua akun. Untuk sementara, gunakan subforum umum terlebih dahulu.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="mb-1 block text-sm font-medium text-text-main">
              Judul thread <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Contoh: Pengalaman awal belajar teori Yin-Yang"
              maxLength={200}
              required
              className="w-full rounded-xl border border-border-main bg-white px-4 py-3 font-display text-lg font-semibold placeholder:font-normal placeholder:text-muted focus:border-primary focus:outline-none"
            />
            <p className="mt-2 text-xs text-muted">Minimal 5 karakter, maksimal 200 karakter.</p>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-text-main">
              Isi thread <span className="text-red-500">*</span>
            </label>
            <div className="overflow-hidden rounded-xl border border-border-main bg-white focus-within:border-primary">
              {editor ? (
                <div className="flex flex-wrap items-center gap-1 border-b border-border-main bg-surface px-3 py-2">
                  <ToolbarBtn
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    active={editor.isActive("bold")}
                    aria-label="Bold"
                  >
                    <Bold size={16} />
                  </ToolbarBtn>
                  <ToolbarBtn
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    active={editor.isActive("italic")}
                    aria-label="Italic"
                  >
                    <Italic size={16} />
                  </ToolbarBtn>
                  <div className="mx-1 h-5 w-px bg-border-main" />
                  <ToolbarBtn
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    active={editor.isActive("bulletList")}
                    aria-label="Bullet list"
                  >
                    <List size={16} />
                  </ToolbarBtn>
                  <ToolbarBtn
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    active={editor.isActive("orderedList")}
                    aria-label="Ordered list"
                  >
                    <ListOrdered size={16} />
                  </ToolbarBtn>
                  <ToolbarBtn
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                    active={editor.isActive("blockquote")}
                    aria-label="Quote"
                  >
                    <Quote size={16} />
                  </ToolbarBtn>
                  <div className="mx-1 h-5 w-px bg-border-main" />
                  <ToolbarBtn
                    onClick={() => editor.chain().focus().undo().run()}
                    disabled={!editor.can().undo()}
                    aria-label="Undo"
                  >
                    <Undo2 size={16} />
                  </ToolbarBtn>
                  <ToolbarBtn
                    onClick={() => editor.chain().focus().redo().run()}
                    disabled={!editor.can().redo()}
                    aria-label="Redo"
                  >
                    <Redo2 size={16} />
                  </ToolbarBtn>
                </div>
              ) : null}
              <EditorContent editor={editor} />
            </div>
            <p className="mt-2 text-xs text-muted">
              Minimal 10 karakter. Tulislah seperlunya, jangan berlebihan dalam klaim medis.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 font-semibold text-white transition-colors hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
              {submitting ? "Menerbitkan…" : "Buat Thread"}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="text-sm text-muted hover:text-text-main"
            >
              Batal
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

function ToolbarBtn({
  onClick,
  active = false,
  disabled = false,
  children,
  ...rest
}: {
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  "aria-label"?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`rounded p-1.5 text-sm transition-colors ${
        active ? "bg-primary text-white" : "text-muted hover:bg-border-main hover:text-text-main"
      } disabled:opacity-40`}
      {...rest}
    >
      {children}
    </button>
  );
}
