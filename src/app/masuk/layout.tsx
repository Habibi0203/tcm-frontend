import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Masuk — tcm.my.id",
  description: "Login ke akun komunitas TCM Indonesia Anda.",
  alternates: { canonical: "/masuk" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
