import Image from "next/image";
import Link from "next/link";
import { MessageCircle, Eye, Pin, Lock, Flag } from "lucide-react";
import { formatRelativeTime } from "@/lib/utils";
import MemberBadge from "./MemberBadge";

interface ThreadData {
  id: string;
  title: string;
  slug?: string;
  subforum: { id: string; name: string; slug: string };
  author: {
    id: string;
    username: string;
    display_name: string;
    avatar_url: string | null;
    role: string;
    membership_tier?: string;
    is_verified?: boolean;
    practitioner_verified?: boolean;
  } | null;
  reply_count: number;
  view_count?: number;
  is_pinned: boolean;
  is_locked: boolean;
  is_flagged?: boolean;
  moderation_status?: "published" | "pending" | "hidden" | "deleted";
  status?: string;
  created_at: string;
  last_reply_author?: { display_name: string } | null;
}

export default function ThreadRow({ thread }: { thread: ThreadData }) {
  return (
    <Link
      href={`/forum/${thread.subforum.slug}/${thread.id}`}
      className="group flex flex-col gap-3 rounded-lg border border-border-main bg-card p-4 transition-colors hover:border-primary/40 hover:bg-primary-light/20 sm:flex-row sm:items-center"
    >
      <div className="flex flex-1 items-start gap-3">
        {thread.author?.avatar_url ? (
          <Image
            src={thread.author.avatar_url}
            alt={thread.author.display_name}
            width={40}
            height={40}
            className="h-10 w-10 flex-shrink-0 rounded-full"
          />
        ) : (
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary-light text-sm font-bold text-primary">
            {(thread.author?.display_name ?? "?")[0]}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            {thread.is_pinned && <Pin size={14} className="text-primary" />}
            {thread.is_locked && <Lock size={14} className="text-muted" />}
            {thread.is_flagged && <Flag size={14} className="text-red-600" aria-label="Ditandai moderasi" />}
            {(thread.moderation_status === "hidden" || thread.moderation_status === "deleted" || thread.status === "hidden" || thread.status === "deleted") && (
              <span className="rounded-full bg-red-50 px-2 py-0.5 text-[11px] font-semibold text-red-700">Disembunyikan</span>
            )}
            <h3 className="font-medium text-text-main group-hover:text-primary line-clamp-2">
              {thread.title}
            </h3>
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted">
            <span className="font-medium text-text-main">{thread.author?.display_name ?? "Anonim"}</span>
            {thread.author && (
              <MemberBadge
                tier={thread.author.membership_tier as "free" | "premium" | undefined}
                role={thread.author.role}
                isVerified={thread.author.practitioner_verified ?? thread.author.is_verified}
              />
            )}
            <span>•</span>
            <span>{formatRelativeTime(thread.created_at)}</span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-4 text-xs text-muted sm:flex-col sm:items-end sm:gap-1">
        <span className="flex items-center gap-1">
          <MessageCircle size={12} /> {thread.reply_count} balasan
        </span>
        <span className="flex items-center gap-1">
          <Eye size={12} /> {thread.view_count}
        </span>
        {thread.last_reply_author && (
          <span className="text-xs">
            Balasan: <span className="font-medium">{thread.last_reply_author.display_name}</span>
          </span>
        )}
      </div>
    </Link>
  );
}
