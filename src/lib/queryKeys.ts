export const QK = {
  articles: {
    all: ["articles"] as const,
    list: (filters: object) => ["articles", "list", filters] as const,
    detail: (slug: string) => ["articles", "detail", slug] as const,
  },
  forum: {
    subforums: ["forum", "subforums"] as const,
    threads: (slug: string, filters: object) => ["forum", "threads", slug, filters] as const,
    thread: (id: string) => ["forum", "thread", id] as const,
  },
  user: {
    me: ["user", "me"] as const,
    bookmarks: ["user", "bookmarks"] as const,
    notifications: ["user", "notifications"] as const,
  },
};
