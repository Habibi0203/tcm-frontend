import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard — tcm.my.id",
  description: "Kelola profil, bookmark, dan notifikasi Anda di komunitas tcm.my.id.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
