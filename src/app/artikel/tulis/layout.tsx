import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tulis Artikel — tcm.my.id",
  description: "Bagikan pengetahuan TCM Anda kepada komunitas Indonesia.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
