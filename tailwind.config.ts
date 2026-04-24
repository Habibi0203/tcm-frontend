import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  // dark mode via class on <html>
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // ── Semantic tokens — driven by CSS vars, auto-switch in dark mode ──
        primary:        "rgb(var(--tw-primary)        / <alpha-value>)",
        "primary-dark": "rgb(var(--tw-primary-dark)   / <alpha-value>)",
        "primary-light":"rgb(var(--tw-primary-light)  / <alpha-value>)",
        "amber-tcm":    "rgb(var(--tw-amber)          / <alpha-value>)",
        "amber-light":  "rgb(var(--tw-amber-light)    / <alpha-value>)",
        surface:        "rgb(var(--tw-surface)        / <alpha-value>)",
        card:           "rgb(var(--tw-card)           / <alpha-value>)",
        "text-main":    "rgb(var(--tw-text-main)      / <alpha-value>)",
        muted:          "rgb(var(--tw-muted)          / <alpha-value>)",
        "border-main":  "rgb(var(--tw-border-main)    / <alpha-value>)",
        parchment:      "rgb(var(--tw-parchment)      / <alpha-value>)",

        // ── Fixed structural palette (same in light & dark) ──────────────
        bark:           "#3d2b1f",
        "bark-light":   "#5c3d2e",
        clay:           "#c4874f",
        earth:          "#8b5e3c",
        sand:           "#e8d5b7",
        gold:           "#c9983a",
        "gold-light":   "#e8bc65",
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        sans:    ["var(--font-sans)", "sans-serif"],
        chinese: ["var(--font-chinese)", "serif"],
        mono:    ["var(--font-jetbrains)", "monospace"],
      },
      maxWidth: {
        reading: "700px",
      },
    },
  },
  plugins: [typography],
};
export default config;
