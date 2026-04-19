export interface MockSubforum {
  id: string;
  name: string;
  slug: string;
  description: string;
  access_tier: "free" | "premium";
  sort_order: number;
  thread_count: number;
  last_activity_at: string;
  is_active: boolean;
}

export const mockSubforums: MockSubforum[] = [
  {
    id: "sub_001",
    name: "Diskusi Umum TCM",
    slug: "diskusi-umum",
    description: "Pertanyaan umum, diskusi artikel, obrolan seputar TCM untuk semua level.",
    access_tier: "free",
    sort_order: 1,
    thread_count: 47,
    last_activity_at: "2026-04-15T14:30:00Z",
    is_active: true,
  },
  {
    id: "sub_002",
    name: "Sharing Pengalaman",
    slug: "sharing-pengalaman",
    description: "Cerita perjalanan dengan TCM, testimoni, pengalaman terapi, dan kisah inspiratif.",
    access_tier: "free",
    sort_order: 2,
    thread_count: 31,
    last_activity_at: "2026-04-15T11:00:00Z",
    is_active: true,
  },
  {
    id: "sub_003",
    name: "Tanya Praktisi",
    slug: "tanya-praktisi",
    description: "Pertanyaan langsung ke praktisi TCM terverifikasi. Untuk member premium.",
    access_tier: "premium",
    sort_order: 3,
    thread_count: 18,
    last_activity_at: "2026-04-14T16:00:00Z",
    is_active: true,
  },
  {
    id: "sub_004",
    name: "Forum Jual Beli",
    slug: "fjb",
    description: "Listing produk TCM terpercaya — transaksi dilakukan di Shopee/Tokopedia.",
    access_tier: "premium",
    sort_order: 4,
    thread_count: 12,
    last_activity_at: "2026-04-13T09:00:00Z",
    is_active: true,
  },
];

export const getSubforumBySlug = (slug: string) =>
  mockSubforums.find((s) => s.slug === slug);
