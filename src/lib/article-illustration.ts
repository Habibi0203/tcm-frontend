const CATEGORY_COLOR_MAP: Record<string, string> = {
  'akupunktur': '#7A5C2E',
  'herbal-tcm': '#4A6741',
  'filosofi-tcm': '#5E4B8B',
  'praktik-tcm': '#2F6F6D',
  'edukasi-tcm-dasar': '#3B5B8A',
  'protokol-kondisi-spesifik': '#8A4F4F',
  'kondisi-kesehatan': '#8B5E3C',
  'gaya-hidup-tcm': '#4B7A5A',
  'nutrisi-tcm': '#8A6A2F',
  'referensi-praktisi': '#5C6B73',
  'terapi-tcm-lainnya': '#6C5B7B',
  'titik-meridian-tcm': '#6A4E3B',
};

function trimValue(value?: string | null) {
  return value?.toString().trim() || '';
}

export function getIllustrationColor(categorySlug?: string | null) {
  return CATEGORY_COLOR_MAP[trimValue(categorySlug)] || '#4A6741';
}

export function getArticleIllustrationPath(params: {
  title?: string | null;
  categoryName?: string | null;
  categorySlug?: string | null;
}) {
  const search = new URLSearchParams();
  if (trimValue(params.title)) search.set('title', trimValue(params.title));
  if (trimValue(params.categoryName)) search.set('category', trimValue(params.categoryName));
  search.set('color', getIllustrationColor(params.categorySlug));
  return `/ilustrasi/artikel?${search.toString()}`;
}

export function getArticleIllustrationUrl(params: {
  title?: string | null;
  categoryName?: string | null;
  categorySlug?: string | null;
}) {
  return `https://tcm.my.id${getArticleIllustrationPath(params)}`;
}
