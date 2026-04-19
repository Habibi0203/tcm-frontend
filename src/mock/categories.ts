export interface MockCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  color_hex: string;
  icon: string;
  sort_order: number;
  is_active: boolean;
  article_count: number;
}

export const mockCategories: MockCategory[] = [
  {
    id: "cat_001",
    name: "Edukasi TCM Dasar",
    slug: "edukasi-tcm-dasar",
    description: "Fondasi ilmu TCM: filosofi, konsep dasar, dan teori klasik untuk pemula hingga mahir.",
    color_hex: "#1D9E75",
    icon: "BookOpen",
    sort_order: 1,
    is_active: true,
    article_count: 24,
  },
  {
    id: "cat_002",
    name: "Herbal & Tanaman Obat",
    slug: "herbal-tanaman-obat",
    description: "Materia medika TCM, penggunaan herbal, formula klasik, dan penelitian modern.",
    color_hex: "#3B6D11",
    icon: "Leaf",
    sort_order: 2,
    is_active: true,
    article_count: 31,
  },
  {
    id: "cat_003",
    name: "Akupuntur & Meridian",
    slug: "akupuntur-meridian",
    description: "Sistem meridian, titik akupuntur, teknik needling, dan akupresur mandiri.",
    color_hex: "#0C447C",
    icon: "Zap",
    sort_order: 3,
    is_active: true,
    article_count: 19,
  },
  {
    id: "cat_004",
    name: "Protokol Kondisi Spesifik",
    slug: "protokol-kondisi-spesifik",
    description: "Panduan TCM untuk kondisi kesehatan spesifik: diagnosis, terapi, dan manajemen.",
    color_hex: "#BA7517",
    icon: "FileText",
    sort_order: 4,
    is_active: true,
    article_count: 28,
  },
  {
    id: "cat_005",
    name: "Gaya Hidup TCM",
    slug: "gaya-hidup-tcm",
    description: "Yangsheng (pemeliharaan kesehatan), diet, tidur, olahraga, dan ritme sirkadian TCM.",
    color_hex: "#534AB7",
    icon: "Sun",
    sort_order: 5,
    is_active: true,
    article_count: 15,
  },
  {
    id: "cat_006",
    name: "Referensi Praktisi",
    slug: "referensi-praktisi",
    description: "Sumber daya untuk praktisi: kasus klinis, riset terbaru, dan continuing education.",
    color_hex: "#993C1D",
    icon: "Stethoscope",
    sort_order: 6,
    is_active: true,
    article_count: 7,
  },
];
