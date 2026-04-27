import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Daftar — tcm.my.id",
  description: "Buat akun gratis di komunitas TCM Indonesia. Akses artikel, ruang diskusi, dan pembaruan konten edukatif.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
