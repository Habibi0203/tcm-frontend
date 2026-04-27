"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import {
  Bold, Italic, List, ListOrdered, Quote, Undo2, Redo2,
  Heading2, Heading3, Loader2, Check,
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { apiFetch } from "@/lib/api";
import { useToast } from "@/components/ui/Toast";

interface CategoryItem {
  id: string;
  name: string;
  slug: string;
}

interface ArticleDetail {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string;
  access_tier: "free" | "premium";
  status: string;
  category: { id: string; name: string; slug: string; color_hex: string } | null;
}

export default function TulisArtikelPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isAuthenticated, access_token, _hasHydrated } = useAuthStore();
  const { toast } = useToast();

  const editId = searchParams.get("edit")?.trim() || "";
  const editSlug = searchParams.get("slug")?.trim() || "";
  const isEditMode = Boolean(editId && editSlug);

  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [accessTier, setAccessTier] = useState<"free" | "premium">("free");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [isLoadingArticle, setIsLoadingArticle] = useState(false);
  const [loadedArticle, setLoadedArticle] = useState<ArticleDetail | null>(null);

  const pageTitle = useMemo(() => (isEditMode ? "Edit Artikel" : "Tulis Artikel"), [isEditMode]);
  const pageDescription = useMemo(
    () =>
      isEditMode
        ? "Perbarui isi artikel Anda lalu simpan perubahan."
        : "Artikel akan masuk queue review sebelum dipublikasikan.",
    [isEditMode],
  );

  useEffect(() => {
    if (!_hasHydrated) return;
    if (!isAuthenticated) router.push("/masuk");
  }, [isAuthenticated, _hasHydrated, router]);

  useEffect(() => {
    async function loadCategories() {
      const res = await apiFetch<CategoryItem[]>("/articles/categories");
      if (res.success) setCategories(res.data);
    }
    loadCategories();
  }, []);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder: "Tulis konten artikel di sini…" }),
    ],
    editorProps: {
      attributes: {
        class:
          "prose prose-sm max-w-none min-h-[320px] px-4 py-3 focus:outline-none text-text-main leading-relaxed",
      },
    },
  });

  useEffect(() => {
    if (!_hasHydrated || !isAuthenticated || !access_token || !isEditMode) return;

    let cancelled = false;

    async function loadArticle() {
      setIsLoadingArticle(true);
      const res = await apiFetch<ArticleDetail>(`/articles/${encodeURIComponent(editSlug)}`, {
        token: access_token ?? undefined,
      });
      if (cancelled) return;

      setIsLoadingArticle(false);
      if (!res.success) {
        toast(res.error?.message || "Gagal memuat artikel untuk diedit.", "error");
        return;
      }

      if (res.data.id !== editId) {
        toast("Artikel edit tidak cocok dengan data yang diminta.", "error");
        return;
      }

      setLoadedArticle(res.data);
      setTitle(res.data.title || "");
      setExcerpt(res.data.excerpt || "");
      setCategoryId(res.data.category?.id || "");
      setAccessTier(res.data.access_tier || "free");
    }

    loadArticle();

    return () => {
      cancelled = true;
    };
  }, [_hasHydrated, isAuthenticated, access_token, isEditMode, editId, editSlug, toast]);

  useEffect(() => {
    if (!editor || !loadedArticle) return;
    if (editor.getHTML() === loadedArticle.content) return;
    editor.commands.setContent(loadedArticle.content || "");
  }, [editor, loadedArticle]);

  if (!user) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const content = editor?.getHTML() ?? "";
    if (!title.trim() || !content || !categoryId) {
      toast("Judul, konten, dan kategori wajib diisi.", "error");
      return;
    }

    setIsSubmitting(true);

    const body = {
      title: title.trim(),
      excerpt: excerpt.trim() || undefined,
      content,
      category_id: categoryId,
      access_tier: accessTier,
    };

    const res = isEditMode
      ? await apiFetch<{ id: string; slug: string; status: string }>(`/articles/${encodeURIComponent(editId)}`, {
          method: "PATCH",
          token: access_token ?? undefined,
          body,
        })
      : await apiFetch<{ id: string; slug: string; status: string }>("/articles", {
          method: "POST",
          token: access_token ?? undefined,
          body,
        });

    setIsSubmitting(false);
    if (res.success) {
      setSubmitted(true);
      toast(isEditMode ? "Perubahan artikel berhasil disimpan!" : "Artikel dikirim untuk review!", "success");
      setTimeout(() => {
        if (isEditMode) {
          router.push(`/artikel/${loadedArticle?.slug || editSlug}`);
        } else {
          router.push("/dashboard");
        }
      }, 1200);
    } else {
      toast(res.error?.message || (isEditMode ? "Gagal menyimpan perubahan artikel." : "Gagal mengirim artikel."), "error");
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="mb-8">
        <h1 className="font-display text-3xl font-bold text-text-main">{pageTitle}</h1>
        <p className="mt-1 text-sm text-muted">{pageDescription}</p>
      </header>

      {isEditMode && isLoadingArticle ? (
        <div className="mb-6 flex items-center gap-3 rounded-xl border border-border-main bg-white px-4 py-4 text-sm text-muted">
          <Loader2 size={18} className="animate-spin" />
          Memuat artikel yang akan diedit…
        </div>
      ) : null}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="mb-1 block text-sm font-medium text-text-main">
            Judul <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Tulis judul artikel yang menarik..."
            maxLength={200}
            required
            className="w-full rounded-xl border border-border-main bg-white px-4 py-3 font-display text-lg font-semibold placeholder:font-normal placeholder:text-muted focus:border-primary focus:outline-none"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-text-main">
            Ringkasan <span className="text-muted">(opsional)</span>
          </label>
          <textarea
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            placeholder="Ringkasan singkat artikel untuk preview..."
            maxLength={300}
            rows={2}
            className="w-full resize-none rounded-xl border border-border-main bg-white px-4 py-3 text-sm placeholder:text-muted focus:border-primary focus:outline-none"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-text-main">
              Kategori <span className="text-red-500">*</span>
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              required
              className="w-full rounded-xl border border-border-main bg-white px-4 py-2.5 text-sm focus:border-primary focus:outline-none"
            >
              <option value="">— Pilih kategori —</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-text-main">Akses</label>
            <select
              value={accessTier}
              onChange={(e) => setAccessTier(e.target.value as "free" | "premium")}
              className="w-full rounded-xl border border-border-main bg-white px-4 py-2.5 text-sm focus:border-primary focus:outline-none"
            >
              <option value="free">Gratis</option>
              <option value="premium">Akses Khusus</option>
            </select>
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-text-main">
            Konten <span className="text-red-500">*</span>
          </label>
          <div className="overflow-hidden rounded-xl border border-border-main bg-white focus-within:border-primary">
            {editor && (
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
                  onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                  active={editor.isActive("heading", { level: 2 })}
                  aria-label="H2"
                >
                  <Heading2 size={16} />
                </ToolbarBtn>
                <ToolbarBtn
                  onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                  active={editor.isActive("heading", { level: 3 })}
                  aria-label="H3"
                >
                  <Heading3 size={16} />
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
            )}
            <EditorContent editor={editor} />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={isSubmitting || submitted || (isEditMode && isLoadingArticle)}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-7 py-3 font-semibold text-white transition-colors hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting && <Loader2 size={16} className="animate-spin" />}
            {submitted && <Check size={16} />}
            {isSubmitting
              ? (isEditMode ? "Menyimpan…" : "Mengirim…")
              : submitted
                ? (isEditMode ? "Tersimpan!" : "Terkirim!")
                : (isEditMode ? "Simpan Perubahan" : "Kirim untuk Review")}
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
        active
          ? "bg-primary text-white"
          : "text-muted hover:bg-border-main hover:text-text-main"
      } disabled:opacity-40`}
      {...rest}
    >
      {children}
    </button>
  );
}
