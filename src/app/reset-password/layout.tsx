import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reset Password — tcm.my.id",
};

export default function ResetPasswordLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
