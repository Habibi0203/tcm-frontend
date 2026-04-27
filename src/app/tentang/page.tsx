import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, AlertTriangle } from "lucide-react";

export const metadata: Metadata = {
  title: "Tentang Kami — tcm.my.id",
  description:
    "Pelajari misi, tim, dan pendekatan editorial tcm.my.id.",
};

const TEAM = [
  {
    name: "Bang Dzulfi",
    role: "Penulis Edukasi TCM",
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=BangDzulfi&backgroundColor=3C3489&fontColor=ffffff",
    bio: "Fokus pada penjelasan konsep dasar, pelurusan miskonsepsi, dan bahasa yang rapi serta hati-hati.",
  },
  {
    name: "Arini",
    role: "Penulis Gaya Hidup & Komunitas",
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Arini&backgroundColor=BA7517&fontColor=ffffff",
    bio: "Membawa bahasa yang hangat, ringan, dan mudah dipahami untuk pembaca umum yang baru belajar TCM.",
  },
  {
    name: "Bang Zub",
    role: "Penulis Praktik & Herbal TCM",
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=BangZub&backgroundColor=1D9E75&fontColor=ffffff",
    bio: "Fokus pada penerapan praktis, pertanyaan lapangan, dan pembahasan yang dekat dengan kebutuhan pembaca.",
  },
  {
    name: "Admin Web",
    role: "Pengelola Platform",
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=AdminWeb&backgroundColor=6B7280&fontColor=ffffff",
    bio: "Menjaga website, alur publikasi, dan pembaruan teknis agar platform tetap rapi dan berjalan stabil.",
  },
];

export default function TentangPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      {/* ── Hero Section ── */}
      <section className="mb-16 text-center">
        <div className="mb-4 inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary">
          Komunitas TCM Indonesia
        </div>
        <h1 className="mb-4 font-display text-4xl font-bold leading-tight text-text-main md:text-5xl">
          Tentang <span className="text-primary">tcm.my.id</span>
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-muted">
          Ruang belajar dan publikasi TCM yang bertumbuh pelan-pelan, dengan fokus pada konten
          yang lebih hati-hati, lebih mudah dipahami, dan lebih jujur soal batasannya.
        </p>
      </section>

      {/* ── Misi Section ── */}
      <section className="mb-16">
        <h2 className="mb-6 font-display text-2xl font-bold text-text-main">Misi Kami</h2>
        <div className="space-y-5 text-[17px] leading-relaxed text-text-main">
          <p>
            Kami hadir untuk menjembatani kesenjangan informasi TCM di Indonesia. Ribuan tahun
            kearifan pengobatan tradisional Tiongkok seringkali terjebak dalam bahasa yang sulit
            diakses, informasi yang tidak terverifikasi, atau klaim berlebihan yang justru
            merugikan masyarakat.
          </p>
          <p>
            tcm.my.id berupaya menyajikan materi TCM yang lebih rapi, mudah diikuti, dan tidak
            buru-buru membuat klaim. Konten kami disusun oleh tim penulis internal dengan gaya
            editorial yang berbeda-beda, lalu ditinjau ulang agar tetap selaras dengan arah situs.
          </p>
          <p>
            Kami sedang membangun kombinasi artikel edukatif, profil penulis, dan ruang diskusi
            komunitas secara bertahap. Fokus kami bukan terlihat besar di awal, tapi membuat fondasi
            yang berguna dan bisa dipercaya.
          </p>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {[
            { label: "Fokus", value: "Edukasi TCM" },
            { label: "Tim Inti", value: "4 Peran" },
            { label: "Pengembangan", value: "Bertahap" },
          ].map((s) => (
            <div key={s.label} className="rounded-2xl border border-border-main bg-card p-5 text-center">
              <p className="font-display text-3xl font-bold text-primary">{s.value}</p>
              <p className="mt-1 text-sm text-muted">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Tim Section ── */}
      <section className="mb-16">
        <h2 className="mb-6 font-display text-2xl font-bold text-text-main">Tim Kami</h2>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {TEAM.map((m) => (
            <div key={m.name} className="rounded-2xl border border-border-main bg-card p-6 text-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={m.avatar}
                alt={m.name}
                width={64}
                height={64}
                className="mx-auto mb-3 rounded-full"
              />
              <h3 className="font-display text-lg font-semibold text-text-main">{m.name}</h3>
              <p className="mb-2 text-xs font-medium text-primary">{m.role}</p>
              <p className="text-sm text-muted">{m.bio}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Disclaimer Section ── */}
      <section className="rounded-2xl border border-amber-200 bg-amber-light/30 p-6">
        <div className="mb-3 flex items-center gap-2">
          <AlertTriangle size={20} className="shrink-0 text-amber-tcm" />
          <h2 className="font-display text-xl font-bold text-text-main">Disclaimer Medis</h2>
        </div>
        <div className="space-y-3 text-sm leading-relaxed text-text-main">
          <p>
            Seluruh konten di tcm.my.id bersifat informatif dan edukatif semata.{" "}
            <strong>Konten ini tidak menggantikan konsultasi, diagnosis, atau perawatan medis profesional.</strong>
          </p>
          <p>
            Traditional Chinese Medicine adalah sistem pengobatan yang kompleks dan memerlukan
            individualisasi dari praktisi berlisensi. Jangan memulai, mengubah, atau menghentikan
            terapi apapun berdasarkan informasi di platform ini tanpa berkonsultasi dengan tenaga
            kesehatan yang berwenang.
          </p>
          <p>
            Jika Anda mengalami kondisi medis serius atau darurat, segera hubungi layanan medis
            terdekat atau{" "}
            <a href="tel:119" className="font-semibold text-primary hover:underline">
              119
            </a>
            .
          </p>
        </div>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href="/artikel"
            className="inline-flex items-center gap-1 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-dark"
          >
            <CheckCircle2 size={14} /> Baca Artikel TCM
          </Link>
          <Link
            href="/forum"
            className="inline-flex items-center gap-1 rounded-lg border border-border-main bg-white px-4 py-2 text-sm font-medium text-text-main hover:bg-surface"
          >
            Bergabung di Forum
          </Link>
        </div>
      </section>
    </div>
  );
}
