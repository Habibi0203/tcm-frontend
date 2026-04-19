import type { Metadata } from "next";
import { Noto_Serif, Noto_Sans, JetBrains_Mono, Ma_Shan_Zheng } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import QueryProvider from "@/providers/QueryProvider";
import { ToastProvider } from "@/components/ui/Toast";

const notoSerif = Noto_Serif({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

const notoSans = Noto_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-sans",
  display: "swap",
});

const maShanZheng = Ma_Shan_Zheng({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-chinese",
  display: "swap",
});

const jetBrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  title: "tcm.my.id — Komunitas Traditional Chinese Medicine Indonesia",
  description:
    "Platform komunitas TCM Indonesia. Edukasi, diskusi, dan sumber daya tepercaya tentang Traditional Chinese Medicine untuk pemula hingga praktisi.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${notoSerif.variable} ${notoSans.variable} ${maShanZheng.variable} ${jetBrains.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Anti-flash: apply stored theme before first paint */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var t=localStorage.getItem('tcm-theme');if(t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme:dark)').matches)){document.documentElement.classList.add('dark')}})()`,
          }}
        />
      </head>
      <body className="min-h-screen antialiased">
        <QueryProvider>
          <ToastProvider>
            <Navbar />
            <main>{children}</main>
            <Footer />
          </ToastProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
