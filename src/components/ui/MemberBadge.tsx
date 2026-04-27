import { Shield, Stethoscope, User } from "lucide-react";

interface MemberBadgeProps {
  tier?: "free" | "premium";
  role?: string;
  isVerified?: boolean;
  size?: "sm" | "md";
}

export default function MemberBadge({ tier, role, isVerified, size = "sm" }: MemberBadgeProps) {
  const textSize = size === "sm" ? "text-xs" : "text-sm";
  const padding = size === "sm" ? "px-2 py-0.5" : "px-2.5 py-1";
  const iconSize = size === "sm" ? 12 : 14;

  if (role === "admin") {
    return (
      <span className={`inline-flex items-center gap-1 rounded-full bg-red-100 text-red-700 font-medium ${textSize} ${padding}`}>
        <Shield size={iconSize} /> Admin
      </span>
    );
  }
  if (role === "moderator") {
    return (
      <span className={`inline-flex items-center gap-1 rounded-full bg-blue-100 text-blue-700 font-medium ${textSize} ${padding}`}>
        <Shield size={iconSize} /> Moderator
      </span>
    );
  }
  if (isVerified) {
    return (
      <span className={`inline-flex items-center gap-1 rounded-full bg-purple-100 text-purple-tcm font-medium ${textSize} ${padding}`}>
        <Stethoscope size={iconSize} /> Praktisi
      </span>
    );
  }
  if (tier === "premium") {
    return (
      <span className={`inline-flex items-center gap-1 rounded-full bg-gray-100 text-gray-600 font-medium ${textSize} ${padding}`}>
        <User size={iconSize} /> Member
      </span>
    );
  }
  return (
    <span className={`inline-flex items-center gap-1 rounded-full bg-gray-100 text-gray-600 font-medium ${textSize} ${padding}`}>
      <User size={iconSize} /> Member
    </span>
  );
}
