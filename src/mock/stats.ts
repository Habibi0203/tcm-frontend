export const mockPlatformStats = {
  total_articles: 124,
  total_members: 847,
  active_subforums: 4,
  verified_practitioners: 6,
};

export const mockComments = [
  {
    id: "cmt_001",
    article_id: "art_001",
    author: {
      display_name: "Budi Santoso",
      avatar_url: "https://api.dicebear.com/7.x/initials/svg?seed=BudiSantoso&backgroundColor=6B6B68&fontColor=ffffff",
    },
    content: "Artikel yang sangat informatif! Baru tahu bahwa defisiensi Yin bisa menyebabkan berkeringat malam. Saya sering mengalami itu.",
    like_count: 8,
    created_at: "2026-04-11T14:00:00Z",
    replies: [
      {
        id: "cmt_001_r1",
        article_id: "art_001",
        parent_id: "cmt_001",
        author: {
          display_name: "Admin TCM",
          avatar_url: "https://api.dicebear.com/7.x/initials/svg?seed=AdminTCM&backgroundColor=1D9E75&fontColor=ffffff",
        },
        content: "Terima kasih, Budi! Ya, berkeringat malam adalah salah satu tanda klasik defisiensi Yin. Kalau berlanjut, sebaiknya konsultasi ke praktisi TCM.",
        like_count: 4,
        created_at: "2026-04-11T15:30:00Z",
        replies: [],
      },
    ],
  },
  {
    id: "cmt_002",
    article_id: "art_001",
    author: {
      display_name: "Hendra Gunawan",
      avatar_url: "https://api.dicebear.com/7.x/initials/svg?seed=HendraGunawan&backgroundColor=0C447C&fontColor=ffffff",
    },
    content: "Penjelasan Yin-Yang paling mudah dipahami yang pernah saya baca. Terima kasih sudah berbagi!",
    like_count: 12,
    created_at: "2026-04-12T09:00:00Z",
    replies: [],
  },
  {
    id: "cmt_003",
    article_id: "art_001",
    author: {
      display_name: "Dr. Sari Wijaya",
      avatar_url: "https://api.dicebear.com/7.x/initials/svg?seed=SariWijaya&backgroundColor=3C3489&fontColor=ffffff",
    },
    content: "Tambahan: konsep Yin-Yang juga sangat penting dalam memahami siklus sirkadian. Jam 23.00-01.00 adalah waktu puncak Kandung Empedu (Yang dalam Yin), sangat penting untuk tidur di jam tersebut.",
    like_count: 19,
    created_at: "2026-04-13T07:00:00Z",
    replies: [],
  },
];
