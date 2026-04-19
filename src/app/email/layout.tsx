import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Email Templates — tcm.my.id",
  description: "Preview template email transaksional tcm.my.id",
};

/** Email preview pages: no Navbar/Footer, grey chrome wrapper only */
export default function EmailLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-200 py-10">
      <div className="mx-auto mb-6 max-w-2xl px-4">
        <div className="flex items-center justify-between rounded-lg bg-gray-800 px-4 py-2 text-sm text-gray-300">
          <span className="font-mono">📧 Email Preview — tcm.my.id</span>
          <a href="/email" className="text-gray-400 hover:text-white">← Semua template</a>
        </div>
      </div>
      {children}
    </div>
  );
}
