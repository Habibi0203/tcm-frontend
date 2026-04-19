import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lupa Password — tcm.my.id",
  description: "Reset password akun komunitas TCM Indonesia Anda.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
