"use client";

import { Globe, Loader2 } from "lucide-react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState, useTransition } from "react";

export default function TranslateToggle({ hasEnglish = false }: { hasEnglish?: boolean }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [loading, setLoading] = useState(false);

  const currentLang = searchParams.get("lang") === "en" ? "en" : "id";

  const handleToggle = (lang: "id" | "en") => {
    if (lang === currentLang) return;
    setLoading(true);
    const params = new URLSearchParams(searchParams.toString());
    if (lang === "en") params.set("lang", "en");
    else params.delete("lang");
    setTimeout(() => {
      startTransition(() => {
        router.push(`${pathname}?${params.toString()}`);
        setLoading(false);
      });
    }, 1500);
  };

  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-border-main bg-white p-1 text-sm">
      {loading ? <Loader2 size={14} className="ml-2 animate-spin text-primary" /> : <Globe size={14} className="ml-2 text-muted" />}
      <button
        onClick={() => handleToggle("id")}
        disabled={loading || isPending}
        className={`rounded-full px-3 py-1 font-medium transition-colors ${
          currentLang === "id" ? "bg-primary text-white" : "text-muted hover:text-text-main"
        }`}
      >
        ID
      </button>
      <button
        onClick={() => handleToggle("en")}
        disabled={loading || isPending || !hasEnglish}
        className={`rounded-full px-3 py-1 font-medium transition-colors ${
          currentLang === "en" ? "bg-primary text-white" : "text-muted hover:text-text-main"
        }`}
      >
        EN
      </button>
    </div>
  );
}
