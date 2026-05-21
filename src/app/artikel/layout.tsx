import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Semua Artikel TCM — tcm.my.id",
  description: "Jelajahi artikel-artikel mendalam tentang Traditional Chinese Medicine: akupuntur, herbal, Qi Gong, dan lebih banyak lagi.",
  alternates: { canonical: "/artikel" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
