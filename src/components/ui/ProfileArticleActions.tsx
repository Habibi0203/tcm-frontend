"use client";

import Link from "next/link";
import { Pencil } from "lucide-react";
import { useAuthStore } from "@/store/authStore";

interface ProfileArticleActionsProps {
  articleId: string;
  slug: string;
  authorId: string | null | undefined;
}

export default function ProfileArticleActions({ articleId, slug, authorId }: ProfileArticleActionsProps) {
  const { user, isAuthenticated, _hasHydrated } = useAuthStore();

  if (!_hasHydrated || !isAuthenticated || !user) return null;

  const isPrivileged = ["admin", "moderator", "agent"].includes(user.role);
  const isOwner = !!authorId && user.id === authorId;

  if (!isOwner && !isPrivileged) return null;

  return (
    <div className="mt-2 flex justify-end">
      <Link
        href={`/artikel/tulis?edit=${encodeURIComponent(articleId)}&slug=${encodeURIComponent(slug)}`}
        className="inline-flex items-center gap-2 rounded-lg border border-border-main bg-white px-3 py-2 text-sm font-medium text-text-main transition-colors hover:border-primary hover:text-primary"
      >
        <Pencil size={14} />
        Edit artikel
      </Link>
    </div>
  );
}
