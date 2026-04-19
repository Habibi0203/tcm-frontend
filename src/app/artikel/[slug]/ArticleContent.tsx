"use client";

import { useAuthStore } from "@/store/authStore";
import PremiumGate from "@/components/ui/PremiumGate";

interface Props {
  contentId: string;
  contentEn: string | null;
  lang: "id" | "en";
  accessTier: "free" | "premium";
  title: string;
}

function markdownToHtml(md: string): string {
  // very simple markdown -> HTML converter for demo purposes
  const lines = md.split("\n");
  let html = "";
  let inList = false;
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith("### ")) {
      if (inList) { html += "</ul>"; inList = false; }
      html += `<h3 class="mt-6 mb-3 font-display text-xl font-semibold">${trimmed.slice(4)}</h3>`;
    } else if (trimmed.startsWith("## ")) {
      if (inList) { html += "</ul>"; inList = false; }
      html += `<h2 class="mt-8 mb-4 font-display text-2xl font-bold">${trimmed.slice(3)}</h2>`;
    } else if (trimmed.startsWith("# ")) {
      if (inList) { html += "</ul>"; inList = false; }
      html += `<h1 class="mt-10 mb-5 font-display text-3xl font-bold">${trimmed.slice(2)}</h1>`;
    } else if (trimmed.startsWith("- ")) {
      if (!inList) { html += "<ul class='my-3 list-disc pl-6 space-y-1'>"; inList = true; }
      html += `<li>${processInline(trimmed.slice(2))}</li>`;
    } else if (trimmed === "") {
      if (inList) { html += "</ul>"; inList = false; }
    } else {
      if (inList) { html += "</ul>"; inList = false; }
      html += `<p class='my-3 leading-relaxed'>${processInline(trimmed)}</p>`;
    }
  }
  if (inList) html += "</ul>";
  return html;
}

function processInline(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>");
}

export default function ArticleContent({ contentId, contentEn, lang, accessTier, title }: Props) {
  const { user } = useAuthStore();
  const isFreeUser = !user || user.membership_tier === "free";
  const isPremium = accessTier === "premium";

  // Pick content source
  let content = lang === "en" ? contentEn : contentId;
  let showTranslationPending = false;
  if (lang === "en" && !contentEn) {
    content = contentId;
    showTranslationPending = true;
  }

  // Premium gating — show preview (first ~300 words) then gate
  if (isPremium && isFreeUser) {
    const words = (content || "").split(" ");
    const preview = words.slice(0, 150).join(" ") + "...";
    return (
      <>
        {showTranslationPending && (
          <div className="mb-4 rounded-lg border border-border-main bg-surface p-3 text-sm text-muted">
            Terjemahan ke Bahasa Inggris sedang diproses. Menampilkan versi Bahasa Indonesia.
          </div>
        )}
        <div
          className="prose-reading relative font-serif text-[17px] leading-relaxed text-text-main"
          dangerouslySetInnerHTML={{ __html: markdownToHtml(preview) }}
        />
        <div className="mt-8">
          <PremiumGate title={`"${title}" untuk Member Premium`} />
        </div>
      </>
    );
  }

  return (
    <>
      {showTranslationPending && (
        <div className="mb-4 rounded-lg border border-border-main bg-surface p-3 text-sm text-muted">
          The English translation is being processed. Showing the Indonesian version.
        </div>
      )}
      <div
        className="prose-reading font-serif text-[17px] leading-relaxed text-text-main"
        dangerouslySetInnerHTML={{ __html: markdownToHtml(content || "") }}
      />
    </>
  );
}
