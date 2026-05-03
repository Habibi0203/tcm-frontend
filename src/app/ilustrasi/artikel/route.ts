import { getIllustrationColor } from '@/lib/article-illustration';

function escapeXml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function wrapText(value: string, max = 28) {
  const words = value.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let current = '';

  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (next.length <= max) {
      current = next;
      continue;
    }
    if (current) lines.push(current);
    current = word;
    if (lines.length === 2) break;
  }

  if (current && lines.length < 2) lines.push(current);
  if (words.join(' ').length > lines.join(' ').length && lines.length) {
    lines[lines.length - 1] = `${lines[lines.length - 1].slice(0, Math.max(0, max - 1)).trim()}…`;
  }
  return lines.slice(0, 2);
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = (searchParams.get('title') || 'Artikel TCM').trim();
  const category = (searchParams.get('category') || 'Traditional Chinese Medicine').trim();
  const color = searchParams.get('color') || getIllustrationColor();
  const lines = wrapText(title, 30);

  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1200" height="630" viewBox="0 0 1200 630" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1200" y2="630" gradientUnits="userSpaceOnUse">
      <stop stop-color="#F7F3EA"/>
      <stop offset="1" stop-color="#EEE4D0"/>
    </linearGradient>
    <linearGradient id="accent" x1="120" y1="110" x2="1030" y2="540" gradientUnits="userSpaceOnUse">
      <stop stop-color="${escapeXml(color)}" stop-opacity="0.95"/>
      <stop offset="1" stop-color="#C9983A" stop-opacity="0.95"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <circle cx="1050" cy="110" r="130" fill="#FFFFFF" fill-opacity="0.18"/>
  <circle cx="150" cy="540" r="180" fill="#FFFFFF" fill-opacity="0.16"/>
  <rect x="82" y="82" width="1036" height="466" rx="36" fill="url(#accent)"/>
  <rect x="118" y="118" width="240" height="46" rx="23" fill="#FFFFFF" fill-opacity="0.18"/>
  <text x="142" y="148" fill="#FFF8EE" font-family="Noto Sans, Arial, sans-serif" font-size="22" font-weight="700">${escapeXml(category)}</text>
  <text x="118" y="248" fill="#FFF8EE" font-family="Noto Serif, Georgia, serif" font-size="54" font-weight="700">${escapeXml(lines[0] || title)}</text>
  <text x="118" y="316" fill="#FFF8EE" font-family="Noto Serif, Georgia, serif" font-size="54" font-weight="700">${escapeXml(lines[1] || '')}</text>
  <text x="118" y="430" fill="#FFF1D6" font-family="Noto Sans, Arial, sans-serif" font-size="28">Ilustrasi editorial otomatis</text>
  <text x="118" y="482" fill="#FFF1D6" font-family="Noto Sans, Arial, sans-serif" font-size="28">tcm.my.id</text>
  <path d="M959 404C997 354 1005 304 975 262C949 226 906 210 860 219C804 230 765 275 748 334C732 388 738 451 758 504" stroke="#FFF8EE" stroke-width="12" stroke-linecap="round" stroke-opacity="0.75"/>
  <path d="M834 309C858 280 886 265 915 264" stroke="#FFF8EE" stroke-width="12" stroke-linecap="round" stroke-opacity="0.75"/>
  <path d="M816 364C847 347 880 344 915 351" stroke="#FFF8EE" stroke-width="12" stroke-linecap="round" stroke-opacity="0.75"/>
  <path d="M818 420C850 421 882 431 912 451" stroke="#FFF8EE" stroke-width="12" stroke-linecap="round" stroke-opacity="0.75"/>
</svg>`;

  return new Response(svg, {
    headers: {
      'Content-Type': 'image/svg+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
    },
  });
}
