import Link from "next/link";

interface CategoryBadgeProps {
  name: string;
  slug: string;
  color?: string | null;
  size?: "sm" | "md";
  /** Use span instead of Link — required when inside another <a> element (e.g. ArticleCard) */
  asSpan?: boolean;
}

export default function CategoryBadge({ name, slug, color, size = "sm", asSpan = false }: CategoryBadgeProps) {
  const textSize = size === "sm" ? "text-xs" : "text-sm";
  const padding = size === "sm" ? "px-2.5 py-1" : "px-3 py-1.5";
  const className = `inline-flex items-center rounded-full font-medium ${textSize} ${padding}`;
  const safeColor = color?.trim() || "#6B7280";
  const style = { backgroundColor: `${safeColor}20`, color: safeColor };

  if (asSpan) {
    return (
      <span className={className} style={style}>
        {name}
      </span>
    );
  }

  return (
    <Link
      href={`/kategori/${slug}`}
      className={`${className} transition-opacity hover:opacity-80`}
      style={style}
    >
      {name}
    </Link>
  );
}
