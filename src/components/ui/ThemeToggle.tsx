"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [dark, setDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem("tcm-theme");
    const isDark =
      stored === "dark" ||
      (!stored && window.matchMedia("(prefers-color-scheme: dark)").matches);
    setDark(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  function toggle() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("tcm-theme", next ? "dark" : "light");
  }

  // Prevent hydration mismatch — render nothing until mounted
  if (!mounted) return <div className="h-9 w-9" />;

  return (
    <button
      onClick={toggle}
      className="rounded-full p-2 text-sand/70 transition-colors hover:bg-bark-light hover:text-sand"
      aria-label={dark ? "Mode terang" : "Mode gelap"}
      title={dark ? "Mode terang" : "Mode gelap"}
    >
      {dark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}
