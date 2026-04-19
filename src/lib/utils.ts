export function formatDate(date: string | Date, locale: string = "id-ID"): string {
  const d = new Date(date);
  return d.toLocaleDateString(locale, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatRelativeTime(date: string | Date): string {
  const now = new Date();
  const d = new Date(date);
  const diff = Math.floor((now.getTime() - d.getTime()) / 1000);

  if (diff < 60) return "baru saja";
  if (diff < 3600) return `${Math.floor(diff / 60)} menit lalu`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} jam lalu`;
  if (diff < 604800) return `${Math.floor(diff / 86400)} hari lalu`;
  if (diff < 2419200) return `${Math.floor(diff / 604800)} minggu lalu`;
  return formatDate(date);
}

export function cn(...classes: (string | undefined | boolean | null)[]): string {
  return classes.filter(Boolean).join(" ");
}

export function truncate(text: string, max: number = 150): string {
  if (text.length <= max) return text;
  return text.slice(0, max).trim() + "...";
}

export function firstNWords(text: string, n: number = 300): string {
  const words = text.split(/\s+/);
  if (words.length <= n) return text;
  return words.slice(0, n).join(" ") + "...";
}
