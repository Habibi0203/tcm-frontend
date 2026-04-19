export type MockNotification = {
  id: string;
  user_id: string;
  type: "article_approved" | "article_rejected" | "new_reply" | "reply_upvote" | "system";
  title: string;
  body: string;
  link: string | null;
  is_read: boolean;
  created_at: string;
};

export const mockNotifications: MockNotification[] = [
  {
    id: "notif_001",
    user_id: "usr_003",
    type: "new_reply",
    title: "Dr. Sari membalas thread kamu",
    body: "Pertanyaan yang bagus! Perbedaan utamanya: akupuntur menggunakan...",
    link: "/forum/diskusi-umum/thr_001",
    is_read: false,
    created_at: "2026-04-14T11:00:00Z",
  },
  {
    id: "notif_002",
    user_id: "usr_003",
    type: "reply_upvote",
    title: "Balasanmu mendapat 7 upvote",
    body: "Di thread: Apa perbedaan akupuntur dan akupresur?",
    link: "/forum/diskusi-umum/thr_001",
    is_read: false,
    created_at: "2026-04-15T10:00:00Z",
  },
  {
    id: "notif_003",
    user_id: "usr_003",
    type: "system",
    title: "Selamat datang di tcm.my.id!",
    body: "Mulai perjalanan belajar TCM kamu dengan membaca artikel dasar.",
    link: "/artikel",
    is_read: true,
    created_at: "2026-02-01T00:00:00Z",
  },
];
