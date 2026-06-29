"use client";

import { useAuthStore } from "@/store/authStore";
import PremiumGate from "@/components/ui/PremiumGate";

interface Props {
  content: string;
  contentEn: string | null;
  lang: "id" | "en";
  accessTier: "free" | "premium";
  title: string;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function processInline(text: string): string {
  const escaped = escapeHtml(text);
  return escaped
    .replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/`(.+?)`/g, '<code>$1</code>');
}

function flushParagraph(lines: string[], html: string[], isLead: boolean): boolean {
  if (!lines.length) return isLead;
  const text = lines.join(" ").trim();
  if (!text) return isLead;
  html.push(
    isLead
      ? `<p class="article-lead">${processInline(text)}</p>`
      : `<p>${processInline(text)}</p>`
  );
  lines.length = 0;
  return false;
}

function flushList(items: string[], html: string[], ordered = false) {
  if (!items.length) return;
  const tag = ordered ? "ol" : "ul";
  html.push(`<${tag}>${items.map((item) => `<li>${processInline(item)}</li>`).join("")}</${tag}>`);
  items.length = 0;
}

function renderTable(rows: string[]): string {
  const parsed = rows
    .map((row) => row.trim().replace(/^\|/, "").replace(/\|$/, "").split("|").map((cell) => cell.trim()))
    .filter((cells) => cells.length > 1);
  if (parsed.length < 2) return rows.map((row) => `<p>${processInline(row)}</p>`).join("");

  const headers = parsed[0];
  const body = parsed.slice(2);
  return `<div class="article-table-wrap"><table><thead><tr>${headers.map((h) => `<th>${processInline(h)}</th>`).join("")}</tr></thead><tbody>${body.map((row) => `<tr>${headers.map((_, idx) => `<td>${processInline(row[idx] || "")}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;
}

// ──── Raw HTML block preservation (SVG, diagrams, etc.) ────

/**
 * A contiguous block of lines that contain raw HTML tags which must
 * be preserved verbatim through markdown rendering.
 */
interface RawHtmlBlock {
  placeholder: string;
  lines: string[];
}

/**
 * Check if a trimmed line is part of a raw HTML block.
 * Matches lines starting with HTML tags: <div, <svg, </div, </svg,
 * <details, </details, <summary, </summary, <circle, <rect, <line,
 * <ellipse, <text, <path, etc.
 */
function isRawHtmlLine(trimmed: string): boolean {
  return /^<\/?(?:div|svg|details|summary|circle|rect|line|ellipse|text|path|g|defs|use|style|script)\b/i.test(trimmed)
      || /^\s*<!--/.test(trimmed)
      || /^\s*-->/.test(trimmed);
}

/**
 * Extract contiguous raw HTML blocks from lines and replace them with placeholders.
 */
function extractRawHtmlBlocks(lines: string[]): { lines: string[]; blocks: RawHtmlBlock[] } {
  const blocks: RawHtmlBlock[] = [];
  const output: string[] = [];
  let i = 0;

  while (i < lines.length) {
    const trimmed = lines[i].trim();

    if (isRawHtmlLine(trimmed)) {
      // Start a raw HTML block
      const blockLines: string[] = [];
      while (i < lines.length && isRawHtmlLine(lines[i].trim())) {
        blockLines.push(lines[i].trim());
        i++;
      }
      const placeholder = `%%RAW_HTML_BLOCK_${blocks.length}%%`;
      blocks.push({ placeholder, lines: blockLines });
      output.push(placeholder);
    } else {
      output.push(lines[i]);
      i++;
    }
  }

  return { lines: output, blocks };
}

/**
 * Restore raw HTML blocks in the rendered HTML output.
 * Placeholders that ended up inside <p> tags get unwrapped.
 */
function restoreRawHtmlBlocks(html: string, blocks: RawHtmlBlock[]): string {
  let result = html;
  for (const block of blocks) {
    const rawHtml = block.lines.join("\n");
    const escapedPlaceholder = block.placeholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    // Check if the placeholder is wrapped in a <p> tag
    const inParagraph = new RegExp(`<p(?:\\s[^>]*)?>${escapedPlaceholder}</p>`, 'g');
    if (inParagraph.test(result)) {
      result = result.replace(inParagraph, rawHtml);
    } else {
      result = result.replace(block.placeholder, rawHtml);
    }
  }
  return result;
}

// ──── End raw HTML preservation ────

function markdownToHtml(md: string): string {
  const rawLines = md.split("\n");

  // Step 0: Extract raw HTML blocks (SVG, diagram wrappers, etc.)
  const { lines, blocks } = extractRawHtmlBlocks(rawLines);

  const html: string[] = [];
  const paragraph: string[] = [];
  const listItems: string[] = [];
  const orderedItems: string[] = [];
  let tableRows: string[] = [];
  let isLead = true;

  const flushAll = () => {
    if (tableRows.length) {
      html.push(renderTable(tableRows));
      tableRows = [];
    }
    flushList(listItems, html, false);
    flushList(orderedItems, html, true);
    isLead = flushParagraph(paragraph, html, isLead);
  };

  for (const rawLine of lines) {
    const trimmed = rawLine.trim();

    if (!trimmed) {
      flushAll();
      continue;
    }

    // Pass through raw HTML block placeholders as-is
    if (trimmed.startsWith("%%RAW_HTML_BLOCK_")) {
      flushAll();
      html.push(trimmed);
      continue;
    }

    if (trimmed.includes("|") && /^\|?.+\|.+/.test(trimmed)) {
      isLead = flushParagraph(paragraph, html, isLead);
      flushList(listItems, html, false);
      flushList(orderedItems, html, true);
      tableRows.push(trimmed);
      continue;
    }

    if (tableRows.length) {
      html.push(renderTable(tableRows));
      tableRows = [];
    }

    if (/^---+$/.test(trimmed)) {
      flushAll();
      html.push('<hr />');
      continue;
    }

    if (trimmed.startsWith("> ")) {
      flushAll();
      html.push(`<blockquote>${processInline(trimmed.slice(2))}</blockquote>`);
      continue;
    }

    if (trimmed.startsWith("### ")) {
      flushAll();
      html.push(`<h3>${processInline(trimmed.slice(4))}</h3>`);
      continue;
    }

    if (trimmed.startsWith("## ")) {
      flushAll();
      html.push(`<h2>${processInline(trimmed.slice(3))}</h2>`);
      continue;
    }

    if (trimmed.startsWith("# ")) {
      flushAll();
      html.push(`<h2>${processInline(trimmed.slice(2))}</h2>`);
      continue;
    }

    const bullet = trimmed.match(/^[-*]\s+(.+)$/);
    if (bullet) {
      isLead = flushParagraph(paragraph, html, isLead);
      flushList(orderedItems, html, true);
      listItems.push(bullet[1]);
      continue;
    }

    const ordered = trimmed.match(/^\d+[.)]\s+(.+)$/);
    if (ordered) {
      isLead = flushParagraph(paragraph, html, isLead);
      flushList(listItems, html, false);
      orderedItems.push(ordered[1]);
      continue;
    }

    flushList(listItems, html, false);
    flushList(orderedItems, html, true);
    paragraph.push(trimmed);
  }

  flushAll();

  const rendered = html.join("\n");

  // Step N: Restore raw HTML blocks
  return restoreRawHtmlBlocks(rendered, blocks);
}

function looksLikeHtml(text: string): boolean {
  const trimmed = text.trim();
  // Treat content as HTML only when it clearly starts as an HTML document/block.
  // Mixed Markdown with a few <details>/<summary> tags must still go through
  // Markdown rendering; otherwise raw #, ##, bullets, and **bold** leak to UI.
  // Also detect embedded SVG blocks that warrant HTML-mode rendering.
  return /^<\/?(?:article|section|div|p|h[1-6]|ul|ol|blockquote|table|details|svg)\b/i.test(trimmed);
}

function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&");
}

function stripTrailingDisclaimer(text: string): string {
  return text
    .replace(/<p[^>]*>\s*---\s*<\/p>\s*<p[^>]*>\s*<em>\s*Disclaimer:[\s\S]*?<\/em>\s*<\/p>\s*$/i, "")
    .replace(/(?:\r?\n)\s*---\s*(?:\r?\n)+\s*\*?Disclaimer:[\s\S]*$/i, "")
    .replace(/\n\s*<details>\s*<summary>Disclaimer<\/summary>[\s\S]*?<\/details>\s*$/i, "")
    .trim();
}

function normalizeArticleContent(text: string): string {
  const decoded = stripTrailingDisclaimer(decodeHtmlEntities(text));

  if (looksLikeHtml(decoded)) {
    return decoded
      .replace(/^\s*<article[^>]*>/i, "")
      .replace(/<\/article>\s*$/i, "")
      .replace(/^\s*<h1\b[^>]*>[\s\S]*?<\/h1>\s*/i, "")
      .trim();
  }

  return decoded.replace(/^\s*#\s+.+(?:\r?\n)+/i, "").trim();
}

function stripHtml(text: string): string {
  return text
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function extractEditorialSections(markdown: string): { main: string; source: string | null; note: string | null } {
  let main = markdown.trim();
  let note: string | null = null;
  let source: string | null = null;

  const noteMatch = main.match(/(?:\r?\n){0,2}\*\*Catatan(?: transparansi & keselamatan)?:\*\*\s*([\s\S]*?)(?=(?:\r?\n){1,3}\*\*(?:Basis sumber|Sumber):\*\*|\s*$)/i);
  if (noteMatch) {
    note = noteMatch[1].trim();
    main = main.replace(noteMatch[0], "").trim();
  }

  const sourceMatch = main.match(/(?:\r?\n){0,2}\*\*(?:Basis sumber|Sumber):\*\*\s*([\s\S]*?)\s*$/i);
  if (sourceMatch) {
    source = sourceMatch[1].trim();
    main = main.replace(sourceMatch[0], "").trim();
  }

  main = main.replace(/(?:\r?\n)\s*---\s*$/i, "").trim();
  return { main, source, note };
}

function renderEditorialSections(source: string | null, note: string | null): string {
  let html = "";
  if (source) {
    html += `<section class="article-source-box">`;
    html += `<p class="article-box-label">Sumber</p>`;
    html += `<p>${processInline(source)}</p>`;
    html += `</section>`;
  }
  if (note) {
    html += `<details class="article-note-box">`;
    html += `<summary>Catatan</summary>`;
    html += `<p>${processInline(note)}</p>`;
    html += `</details>`;
  }
  return html;
}

function addHtmlArticleClasses(html: string): string {
  return html
    .replace(/<h2(\s|>)/g, '<h2 class="article-h2"$1')
    .replace(/<h3(\s|>)/g, '<h3 class="article-h3"$1')
    .replace(/<p(\s|>)/g, '<p class="article-p"$1')
    .replace(/<ul(\s|>)/g, '<ul class="article-ul"$1')
    .replace(/<ol(\s|>)/g, '<ol class="article-ol"$1')
    .replace(/<blockquote(\s|>)/g, '<blockquote class="article-quote"$1');
}

function renderRichContent(text: string): string {
  const normalized = normalizeArticleContent(text);
  if (looksLikeHtml(normalized)) return addHtmlArticleClasses(normalized);
  const sections = extractEditorialSections(normalized);
  return markdownToHtml(sections.main) + renderEditorialSections(sections.source, sections.note);
}

export default function ArticleContent({ content, contentEn, lang, accessTier, title }: Props) {
  const { user } = useAuthStore();
  const isFreeUser = !user || user.membership_tier === "free";
  const isPremium = accessTier === "premium";

  let renderedContent = lang === "en" ? contentEn : content;
  let showTranslationPending = false;
  if (lang === "en" && !contentEn) {
    renderedContent = content;
    showTranslationPending = true;
  }

  if (isPremium && isFreeUser) {
    const normalizedPreview = normalizeArticleContent(renderedContent || "");
    const previewSource = looksLikeHtml(normalizedPreview) ? stripHtml(normalizedPreview) : normalizedPreview;
    const words = previewSource.split(" ");
    const preview = words.slice(0, 150).join(" ") + "...";
    return (
      <>
        {showTranslationPending && (
          <div className="mb-4 rounded-xl border border-border-main bg-surface p-4 text-sm text-muted">
            Terjemahan ke Bahasa Inggris sedang diproses. Menampilkan versi Bahasa Indonesia.
          </div>
        )}
        <div
          className="article-body"
          dangerouslySetInnerHTML={{ __html: markdownToHtml(preview) }}
        />
        <div className="mt-8">
          <PremiumGate title={`Akses penuh untuk "${title}" dibuka bertahap`} />
        </div>
      </>
    );
  }

  return (
    <>
      {showTranslationPending && (
        <div className="mb-4 rounded-xl border border-border-main bg-surface p-4 text-sm text-muted">
          The English translation is being processed. Showing the Indonesian version.
        </div>
      )}
      <div
        className="article-body"
        dangerouslySetInnerHTML={{ __html: renderRichContent(renderedContent || "") }}
      />
    </>
  );
}
