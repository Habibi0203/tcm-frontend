export interface ThreadAuthor {
  id: string;
  display_name: string;
  avatar_url: string;
  membership_tier: "free" | "premium";
  role?: string;
  is_verified?: boolean;
}

export interface ThreadReply {
  id: string;
  thread_id: string;
  parent_reply_id: string | null;
  author: ThreadAuthor;
  content: string;
  upvote_count: number;
  is_deleted: boolean;
  created_at: string;
  replies?: ThreadReply[];
}

export interface MockThread {
  id: string;
  subforum_id: string;
  subforum: { name: string; slug: string };
  author: ThreadAuthor;
  title: string;
  content: string;
  is_pinned: boolean;
  is_locked: boolean;
  is_deleted: boolean;
  status: "open" | "closed" | "resolved";
  view_count: number;
  reply_count: number;
  upvote_count: number;
  is_agent_seeded: boolean;
  last_reply_author: { display_name: string } | null;
  last_reply_at: string;
  created_at: string;
  replies?: ThreadReply[];
}

export const mockThreads: MockThread[] = [
  {
    id: "thr_001",
    subforum_id: "sub_001",
    subforum: { name: "Diskusi Umum TCM", slug: "diskusi-umum" },
    author: {
      id: "usr_003",
      display_name: "Budi Santoso",
      avatar_url: "https://api.dicebear.com/7.x/initials/svg?seed=BudiSantoso&backgroundColor=6B6B68&fontColor=ffffff",
      membership_tier: "free",
    },
    title: "Apa perbedaan akupuntur dan akupresur? Mana yang lebih efektif?",
    content: "Halo semua! Saya masih newbie di TCM dan penasaran dengan dua terapi ini.\n\nSetau saya akupuntur pakai jarum, akupresur pakai tekanan jari. Tapi selain itu apa bedanya? Dan kalau untuk kondisi umum seperti stres dan sakit kepala, mana yang lebih direkomendasikan?\n\nSaya agak takut jarum hehe, jadi pengen coba akupresur dulu. Apakah hasilnya jauh berbeda?\n\nTerima kasih sebelumnya!",
    is_pinned: false,
    is_locked: false,
    is_deleted: false,
    status: "open",
    view_count: 234,
    reply_count: 12,
    upvote_count: 18,
    is_agent_seeded: false,
    last_reply_author: { display_name: "Dr. Sari Wijaya" },
    last_reply_at: "2026-04-15T14:30:00Z",
    created_at: "2026-04-14T09:00:00Z",
    replies: [
      {
        id: "rep_001",
        thread_id: "thr_001",
        parent_reply_id: null,
        author: {
          id: "usr_002",
          display_name: "Dr. Sari Wijaya",
          avatar_url: "https://api.dicebear.com/7.x/initials/svg?seed=SariWijaya&backgroundColor=3C3489&fontColor=ffffff",
          membership_tier: "premium",
          role: "member",
          is_verified: true,
        },
        content: "Pertanyaan bagus, Budi! Akupuntur menggunakan jarum tipis yang diinsersikan ke titik akupuntur. Efeknya lebih kuat dan menjangkau lapisan lebih dalam. Akupresur pakai tekanan jari di titik yang sama, cocok untuk pemeliharaan dan kondisi ringan, bisa dilakukan sendiri. Untuk stres dan sakit kepala, akupresur mandiri cukup efektif. Coba titik LI4 dan GB20. Kalau ingin coba akupuntur, jarumnya sangat tipis — kebanyakan pasien malah rileks selama sesi.",
        upvote_count: 24,
        is_deleted: false,
        created_at: "2026-04-14T10:15:00Z",
      },
      {
        id: "rep_002",
        thread_id: "thr_001",
        parent_reply_id: null,
        author: {
          id: "usr_004",
          display_name: "Rina Kusuma",
          avatar_url: "https://api.dicebear.com/7.x/initials/svg?seed=RinaKusuma&backgroundColor=BA7517&fontColor=ffffff",
          membership_tier: "premium",
          is_verified: true,
        },
        content: "Nambahin dari Dr. Sari — saya dulu juga takut jarum tapi setelah coba ternyata hampir tidak terasa. Jarumnya beda banget sama jarum suntik. Kalau belum siap, akupresur dulu aja.",
        upvote_count: 11,
        is_deleted: false,
        created_at: "2026-04-14T11:30:00Z",
      },
    ],
  },
  {
    id: "thr_002",
    subforum_id: "sub_001",
    subforum: { name: "Diskusi Umum TCM", slug: "diskusi-umum" },
    author: {
      id: "usr_001",
      display_name: "Admin TCM",
      avatar_url: "https://api.dicebear.com/7.x/initials/svg?seed=AdminTCM&backgroundColor=1D9E75&fontColor=ffffff",
      membership_tier: "premium",
      role: "admin",
    },
    title: "Panduan Komunitas & Tata Tertib Forum tcm.my.id",
    content: "Selamat datang di forum komunitas tcm.my.id!\n\nSebelum mulai berdiskusi, mohon baca panduan berikut:\n\n1. Hormati semua anggota\n2. Informasi medis harus dikonfirmasi praktisi berlisensi\n3. Dilarang spam atau promosi berlebihan\n4. Untuk jual beli, gunakan subforum Forum Jual Beli\n\nSelamat berdiskusi!",
    is_pinned: true,
    is_locked: false,
    is_deleted: false,
    status: "open",
    view_count: 892,
    reply_count: 3,
    upvote_count: 45,
    is_agent_seeded: true,
    last_reply_author: { display_name: "Hendra Gunawan" },
    last_reply_at: "2026-04-10T08:00:00Z",
    created_at: "2026-01-01T00:00:00Z",
    replies: [],
  },
  {
    id: "thr_003",
    subforum_id: "sub_002",
    subforum: { name: "Sharing Pengalaman", slug: "sharing-pengalaman" },
    author: {
      id: "usr_005",
      display_name: "Hendra Gunawan",
      avatar_url: "https://api.dicebear.com/7.x/initials/svg?seed=HendraGunawan&backgroundColor=0C447C&fontColor=ffffff",
      membership_tier: "free",
    },
    title: "Pengalaman 3 Bulan Rutin Konsumsi Astragalus (Huang Qi) — Update",
    content: "Halo teman-teman, mau sharing pengalaman saya konsumsi Huang Qi selama 3 bulan.\n\nBackground: Saya sering masuk angin dan daya tahan tubuh lemah. Setelah baca artikel di sini tentang Wei Qi, saya coba beli granul Huang Qi di apotek TCM.\n\nBulan 1: Belum terasa banyak perubahan.\nBulan 2: Dua kali hampir masuk angin tapi tidak jadi parah.\nBulan 3: Jelas lebih berenergi pagi hari. Flu hampir tidak ada.\n\nOverall sangat happy! Harga ~80rb/bulan.",
    is_pinned: false,
    is_locked: false,
    is_deleted: false,
    status: "open",
    view_count: 156,
    reply_count: 8,
    upvote_count: 32,
    is_agent_seeded: false,
    last_reply_author: { display_name: "Rina Kusuma" },
    last_reply_at: "2026-04-15T11:00:00Z",
    created_at: "2026-04-13T15:00:00Z",
    replies: [
      {
        id: "rep_003",
        thread_id: "thr_003",
        parent_reply_id: null,
        author: {
          id: "usr_004",
          display_name: "Rina Kusuma",
          avatar_url: "https://api.dicebear.com/7.x/initials/svg?seed=RinaKusuma&backgroundColor=BA7517&fontColor=ffffff",
          membership_tier: "premium",
          is_verified: true,
        },
        content: "Wah bagus sekali progressnya! Huang Qi memang salah satu tonik imunitas terbaik dalam TCM. Untuk hasil optimal, bisa dikombinasikan dengan Da Zao dan Bai Zhu. Huang Qi lebih cocok diminum pagi/siang karena sifatnya mengangkat Qi.",
        upvote_count: 15,
        is_deleted: false,
        created_at: "2026-04-14T09:00:00Z",
      },
    ],
  },
  {
    id: "thr_004",
    subforum_id: "sub_001",
    subforum: { name: "Diskusi Umum TCM", slug: "diskusi-umum" },
    author: {
      id: "usr_003",
      display_name: "Budi Santoso",
      avatar_url: "https://api.dicebear.com/7.x/initials/svg?seed=BudiSantoso&backgroundColor=6B6B68&fontColor=ffffff",
      membership_tier: "free",
    },
    title: "Rekomendasi buku TCM untuk pemula dalam Bahasa Indonesia?",
    content: "Halo! Saya ingin belajar TCM lebih serius tapi kebanyakan buku yang saya temukan dalam bahasa Inggris atau Mandarin.\n\nAda rekomendasi buku TCM yang bagus dalam Bahasa Indonesia? Atau terjemahan yang bagus?\n\nTerima kasih!",
    is_pinned: false,
    is_locked: false,
    is_deleted: false,
    status: "open",
    view_count: 89,
    reply_count: 6,
    upvote_count: 14,
    is_agent_seeded: false,
    last_reply_author: { display_name: "Dr. Sari Wijaya" },
    last_reply_at: "2026-04-14T17:00:00Z",
    created_at: "2026-04-12T14:00:00Z",
    replies: [],
  },
  {
    id: "thr_005",
    subforum_id: "sub_002",
    subforum: { name: "Sharing Pengalaman", slug: "sharing-pengalaman" },
    author: {
      id: "usr_004",
      display_name: "Rina Kusuma",
      avatar_url: "https://api.dicebear.com/7.x/initials/svg?seed=RinaKusuma&backgroundColor=BA7517&fontColor=ffffff",
      membership_tier: "premium",
      is_verified: true,
    },
    title: "Review Klinik TCM di Jakarta: Pengalaman Konsultasi Pertama",
    content: "Minggu lalu saya akhirnya berani coba konsultasi di klinik TCM profesional untuk pertama kalinya. Biaya konsultasi + akupuntur sekitar 300-350rb.\n\nProsesnya: anamnesis detail, diagnosis lidah, diagnosis nadi 3 posisi, penjelasan temuan, akupuntur 30 menit + herbal.\n\nSangat impressed dengan ketelitian diagnosis. Praktisi benar-benar mendengarkan dan menjelaskan kondisi secara holistik.",
    is_pinned: false,
    is_locked: false,
    is_deleted: false,
    status: "open",
    view_count: 203,
    reply_count: 14,
    upvote_count: 41,
    is_agent_seeded: false,
    last_reply_author: { display_name: "Budi Santoso" },
    last_reply_at: "2026-04-15T10:00:00Z",
    created_at: "2026-04-11T10:00:00Z",
    replies: [],
  },
  {
    id: "thr_006",
    subforum_id: "sub_001",
    subforum: { name: "Diskusi Umum TCM", slug: "diskusi-umum" },
    author: {
      id: "usr_001",
      display_name: "Admin TCM",
      avatar_url: "https://api.dicebear.com/7.x/initials/svg?seed=AdminTCM&backgroundColor=1D9E75&fontColor=ffffff",
      membership_tier: "premium",
      role: "admin",
    },
    title: "Diskusi: Bagaimana TCM memandang COVID-19 dan long-COVID?",
    content: "Dalam TCM, COVID-19 sering dikategorikan sebagai wabah Qi (Yi Li) yang menyerang Paru-paru dan menghasilkan kombinasi kondisi: panas, lembab, dan beracun.\n\nUntuk long-COVID, banyak pasien menunjukkan pola defisiensi Qi Paru-paru, defisiensi Qi dan Yin, serta stagnasi Qi dan Darah.\n\nBagaimana pengalaman teman-teman?",
    is_pinned: false,
    is_locked: false,
    is_deleted: false,
    status: "open",
    view_count: 312,
    reply_count: 19,
    upvote_count: 28,
    is_agent_seeded: true,
    last_reply_author: { display_name: "Dr. Sari Wijaya" },
    last_reply_at: "2026-04-13T20:00:00Z",
    created_at: "2026-04-09T08:00:00Z",
    replies: [],
  },
  {
    id: "thr_007",
    subforum_id: "sub_003",
    subforum: { name: "Tanya Praktisi", slug: "tanya-praktisi" },
    author: {
      id: "usr_003",
      display_name: "Budi Santoso",
      avatar_url: "https://api.dicebear.com/7.x/initials/svg?seed=BudiSantoso&backgroundColor=6B6B68&fontColor=ffffff",
      membership_tier: "free",
    },
    title: "Tanya tentang herbal TCM untuk diabetes tipe 2",
    content: "Pertanyaan untuk praktisi: ayah saya penderita diabetes tipe 2 yang terkontrol dengan metformin.\n\nApakah ada herbal TCM yang bisa dikombinasikan dengan pengobatan konvensional untuk membantu kontrol gula darah? Dan apa yang perlu diperhatikan agar tidak ada interaksi obat?",
    is_pinned: false,
    is_locked: false,
    is_deleted: false,
    status: "open",
    view_count: 67,
    reply_count: 2,
    upvote_count: 8,
    is_agent_seeded: false,
    last_reply_author: { display_name: "Dr. Sari Wijaya" },
    last_reply_at: "2026-04-14T16:00:00Z",
    created_at: "2026-04-13T11:00:00Z",
    replies: [],
  },
  {
    id: "thr_008",
    subforum_id: "sub_002",
    subforum: { name: "Sharing Pengalaman", slug: "sharing-pengalaman" },
    author: {
      id: "usr_005",
      display_name: "Hendra Gunawan",
      avatar_url: "https://api.dicebear.com/7.x/initials/svg?seed=HendraGunawan&backgroundColor=0C447C&fontColor=ffffff",
      membership_tier: "free",
    },
    title: "Belajar Ba Duan Jin dari YouTube vs kelas langsung — mana lebih efektif?",
    content: "Setelah baca artikel tentang Ba Duan Jin di sini, saya jadi tertarik belajar.\n\nTapi saya masih bingung: apakah cukup belajar dari YouTube atau perlu kelas langsung dengan instruktur?\n\nKelas langsung: bisa dapat koreksi postur, tapi lebih mahal.\nYouTube: gratis dan fleksibel, tapi takut salah gerak.\n\nAda yang punya pengalaman?",
    is_pinned: false,
    is_locked: false,
    is_deleted: false,
    status: "open",
    view_count: 94,
    reply_count: 7,
    upvote_count: 12,
    is_agent_seeded: false,
    last_reply_author: { display_name: "Rina Kusuma" },
    last_reply_at: "2026-04-15T09:30:00Z",
    created_at: "2026-04-14T12:00:00Z",
    replies: [],
  },
];

export const getThreadsBySubforum = (subforumSlug: string) =>
  mockThreads
    .filter((t) => t.subforum.slug === subforumSlug && !t.is_deleted)
    .sort((a, b) => {
      if (a.is_pinned !== b.is_pinned) return a.is_pinned ? -1 : 1;
      return new Date(b.last_reply_at).getTime() - new Date(a.last_reply_at).getTime();
    });

export const getThreadById = (id: string) =>
  mockThreads.find((t) => t.id === id);

export const getLatestThreads = (count: number = 5) =>
  [...mockThreads]
    .filter((t) => !t.is_deleted && !t.is_pinned)
    .sort((a, b) => new Date(b.last_reply_at).getTime() - new Date(a.last_reply_at).getTime())
    .slice(0, count);

/** Flat list of all mock replies (from all threads) — useful for ReplyItem renders */
export const mockReplies: ThreadReply[] = mockThreads.flatMap((t) => t.replies ?? []);

export const getRepliesByThread = (threadId: string): ThreadReply[] =>
  mockReplies.filter((r) => r.thread_id === threadId);
