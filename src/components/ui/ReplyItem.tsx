"use client";

import Image from "next/image";
import { useState } from "react";
import { ThumbsUp, MessageSquare, ChevronDown, ChevronUp } from "lucide-react";
import MemberBadge from "./MemberBadge";
import ReportButton from "./ReportButton";

interface ThreadReply {
  id: string;
  content: string;
  author: {
    id: string;
    username: string;
    display_name: string;
    avatar_url: string | null;
    role: string;
    membership_tier?: string;
    is_verified?: boolean;
  } | null;
  upvote_count: number;
  created_at: string;
  replies?: ThreadReply[];
}

interface ReplyItemProps {
  reply: ThreadReply;
  /** If true, render as a nested (child) reply with smaller indentation */
  isNested?: boolean;
  onUpvote?: (id: string) => void;
  onReply?: (parentId: string) => void;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric", month: "short", year: "numeric",
  });
}

export default function ReplyItem({ reply, isNested = false, onUpvote, onReply }: ReplyItemProps) {
  const [upvoted, setUpvoted] = useState(false);
  const [showChildren, setShowChildren] = useState(true);
  const hasChildren = reply.replies && reply.replies.length > 0;

  function handleUpvote() {
    setUpvoted((v) => !v);
    onUpvote?.(reply.id);
  }

  return (
    <div className={`relative ${isNested ? "ml-10 mt-3 border-l-2 border-border-main pl-4" : ""}`}>
      {/* Top bar: avatar + meta */}
      <div className="flex items-start gap-3">
        {reply.author?.avatar_url ? (
          <Image
            src={reply.author.avatar_url}
            alt={reply.author.display_name}
            width={isNested ? 28 : 36}
            height={isNested ? 28 : 36}
            className="shrink-0 rounded-full"
          />
        ) : (
          <div className={`flex shrink-0 items-center justify-center rounded-full bg-primary-light text-xs font-bold text-primary ${isNested ? "h-7 w-7" : "h-9 w-9"}`}>
            {(reply.author?.display_name ?? "?")[0]}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-semibold text-text-main">
              {reply.author?.display_name ?? "Anonim"}
            </span>
            {reply.author && (
              <MemberBadge
                tier={reply.author.membership_tier as "free" | "premium" | undefined}
                role={reply.author.role}
                isVerified={reply.author.is_verified && reply.author.role === "member"}
                size="sm"
              />
            )}
            <span className="text-xs text-muted">{formatDate(reply.created_at)}</span>
          </div>

          {/* Content */}
          <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-text-main">
            {reply.content}
          </p>

          {/* Action bar */}
          <div className="mt-3 flex items-center gap-4 text-xs text-muted">
            <button
              onClick={handleUpvote}
              className={`flex items-center gap-1 transition-colors hover:text-primary ${upvoted ? "text-primary font-medium" : ""}`}
            >
              <ThumbsUp size={14} />
              <span>{reply.upvote_count + (upvoted ? 1 : 0)}</span>
            </button>
            {!isNested && onReply && (
              <button
                onClick={() => onReply(reply.id)}
                className="flex items-center gap-1 transition-colors hover:text-primary"
              >
                <MessageSquare size={14} />
                Balas
              </button>
            )}
            <ReportButton targetType="reply" targetId={reply.id} compact />
            {hasChildren && (
              <button
                onClick={() => setShowChildren((v) => !v)}
                className="flex items-center gap-1 transition-colors hover:text-primary"
              >
                {showChildren ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                {showChildren ? "Sembunyikan" : `${reply.replies!.length} balasan`}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Nested child replies (1 level only) */}
      {hasChildren && showChildren && (
        <div className="mt-1 space-y-3">
          {reply.replies!.map((child) => (
            <ReplyItem key={child.id} reply={child} isNested onUpvote={onUpvote} />
          ))}
        </div>
      )}
    </div>
  );
}
