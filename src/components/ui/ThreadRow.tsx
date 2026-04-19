import Image from "next/image";
import Link from "next/link";
import { MessageCircle, Eye, Pin, Lock } from "lucide-react";
import { MockThread } from "@/mock/threads";
import { formatRelativeTime } from "@/lib/utils";
import MemberBadge from "./MemberBadge";

export default function ThreadRow({ thread }: { thread: MockThread }) {
  return (
    <Link
      href={`/forum/${thread.subforum.slug}/${thread.id}`}
      className="group flex flex-col gap-3 rounded-lg border border-border-main bg-card p-4 transition-colors hover:border-primary/40 hover:bg-primary-light/20 sm:flex-row sm:items-center"
    >
      <div className="flex flex-1 items-start gap-3">
        <Image
          src={thread.author.avatar_url}
          alt={thread.author.display_name}
          width={40}
          height={40}
          className="h-10 w-10 flex-shrink-0 rounded-full"
        />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            {thread.is_pinned && <Pin size={14} className="text-primary" />}
            {thread.is_locked && <Lock size={14} className="text-muted" />}
            <h3 className="font-medium text-text-main group-hover:text-primary line-clamp-2">
              {thread.title}
            </h3>
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted">
            <span className="font-medium text-text-main">{thread.author.display_name}</span>
            <MemberBadge
              tier={thread.author.membership_tier}
              role={thread.author.role}
              isVerified={thread.author.is_verified}
            />
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
