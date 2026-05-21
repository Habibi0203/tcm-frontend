import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Standar Editorial & Shinse AI — tcm.my.id",
  description: "Cara tcm.my.id menyusun, meninjau, dan membatasi konten edukasi TCM, termasuk peran Shinse AI.",
  alternates: { canonical: "/standar-editorial" },
};

export default function StandarEditorialPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="font-display text-4xl font-bold text-text-main">Standar Editorial & Status Shinse AI</h1>
      <p className="mt-4 text-muted">
        tcm.my.id adalah platform edukasi dan komunitas. Konten kami ditujukan untuk membantu pembaca memahami
        Traditional Chinese Medicine secara bertahap, bukan untuk menggantikan diagnosis, resep, atau terapi personal.
      </p>

      <section className="prose prose-slate mt-8 max-w-none">
        <h2>Cara Artikel Dibuat</h2>
        <ul>
          <li>Artikel disusun dari sumber edukasi, pengalaman komunitas, dan referensi TCM yang relevan.</li>
          <li>Konten diberi kategori, tag, ringkasan, dan disclaimer medis jika membahas kesehatan.</li>
          <li>Artikel dapat berada pada status draft, review, published, archived, atau scheduled sebelum/telah tayang.</li>
          <li>Konten yang sensitif dapat ditinjau, diperbarui, atau ditarik jika berisiko menyesatkan.</li>
        </ul>

        <h2>Batasan Konten Medis</h2>
        <p>
          Kami tidak mengizinkan klaim kepastian sembuh, ajakan menghentikan obat dokter, klaim produk ilegal,
          atau diagnosis individual tanpa pemeriksaan langsung. Untuk keputusan kesehatan pribadi, pembaca harus
          berkonsultasi dengan tenaga kesehatan atau praktisi yang kompeten.
        </p>

        <h2>Status “Shinse AI”</h2>
        <p>
          Shinse AI adalah asisten edukasi berbasis AI. Ia dapat membantu menjelaskan konsep, menyusun draft, atau
          memberi ringkasan, tetapi bukan dokter, bukan praktisi TCM terverifikasi, dan tidak boleh dianggap sebagai
          pemberi diagnosis atau terapi personal. Konten berbantuan AI tetap perlu konteks, kehati-hatian, dan review manusia.
        </p>

        <h2>Koreksi dan Pembaruan</h2>
        <p>
          Jika menemukan kekeliruan, klaim berlebihan, atau informasi yang perlu diperbarui, gunakan fitur laporan konten
          atau hubungi pengelola. Moderator dapat meninjau, mengunci, menyembunyikan, atau memperbarui konten sesuai
          <Link href="/pedoman-komunitas"> Pedoman Komunitas</Link>.
        </p>

        <h2>Hubungan dengan Disclaimer Medis</h2>
        <p>
          Standar ini melengkapi <Link href="/disclaimer-medis">Disclaimer Medis</Link>,
          <Link href="/syarat-ketentuan"> Syarat & Ketentuan</Link>, dan
          <Link href="/kebijakan-privasi"> Kebijakan Privasi</Link>.
        </p>
      </section>
    </div>
  );
}
