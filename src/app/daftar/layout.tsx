import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Daftar — tcm.my.id",
  description: "Buat akun gratis di komunitas TCM Indonesia. Akses artikel, forum diskusi, dan tanya praktisi.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
