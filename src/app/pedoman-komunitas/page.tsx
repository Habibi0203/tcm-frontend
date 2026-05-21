import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Pedoman Komunitas — tcm.my.id",
  description: "Pedoman diskusi aman, sehat, dan bertanggung jawab di komunitas tcm.my.id.",
  alternates: { canonical: "/pedoman-komunitas" },
};

export default function PedomanKomunitasPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8 rounded-2xl border border-border-main bg-card p-6">
        <p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-primary">Komunitas</p>
        <h1 className="font-display text-4xl font-bold text-text-main">Pedoman Komunitas</h1>
        <p className="mt-3 text-sm text-muted">Terakhir diperbarui: 21 Mei 2026</p>
      </div>

      <div className="prose prose-stone max-w-none dark:prose-invert prose-headings:font-display prose-a:text-primary">
        <p>
          tcm.my.id dibangun sebagai ruang belajar Traditional Chinese Medicine yang aman, tenang, dan bertanggung jawab.
          Pedoman ini berlaku untuk thread, balasan, komentar, profil, dan konten komunitas lain.
        </p>

        <h2>Prinsip Utama</h2>
        <ul>
          <li>Gunakan forum untuk edukasi, berbagi pengalaman, dan diskusi umum.</li>
          <li>Hormati pengguna lain, termasuk pemula yang baru belajar TCM.</li>
          <li>Berikan konteks dan sumber bila menyampaikan klaim kesehatan.</li>
          <li>Utamakan keselamatan pengguna dibanding memenangkan argumen.</li>
        </ul>

        <h2>Konten Kesehatan</h2>
        <ul>
          <li>Dilarang memberi diagnosis pasti tanpa pemeriksaan profesional.</li>
          <li>Dilarang menyuruh pengguna menghentikan obat atau terapi dokter.</li>
          <li>Dilarang menjanjikan kesembuhan, hasil pasti, atau efek instan.</li>
          <li>Hindari membagikan data medis pribadi yang sensitif di ruang publik.</li>
          <li>Untuk kondisi serius, arahkan pengguna ke dokter, tenaga kesehatan, atau praktisi kompeten.</li>
        </ul>

        <h2>Perilaku yang Dilarang</h2>
        <ul>
          <li>Spam, flood, promosi berulang, atau tautan mencurigakan.</li>
          <li>Penipuan, impersonasi praktisi, atau klaim kredensial palsu.</li>
          <li>Pelecehan, ancaman, doxing, ujaran kebencian, dan provokasi personal.</li>
          <li>Konten ilegal, pornografi, eksploitasi, atau instruksi berbahaya.</li>
          <li>Konten yang sengaja menyesatkan tentang obat, herbal, terapi, atau produk kesehatan.</li>
        </ul>

        <h2>Praktisi dan Klaim Keahlian</h2>
        <p>
          Pengguna yang menyatakan diri sebagai praktisi harus bersedia menjelaskan latar belakang secara wajar bila diminta
          oleh moderator. Badge atau status terverifikasi hanya boleh digunakan bila diberikan oleh platform.
        </p>

        <h2>Moderasi</h2>
        <p>
          Moderator dapat mengedit label, menyembunyikan, menghapus, mengunci thread, atau membatasi akun jika konten dinilai
          berisiko untuk keselamatan komunitas. Pelanggaran berat dapat ditindak tanpa peringatan awal.
        </p>

        <h2>Jual Beli</h2>
        <p>
          Aktivitas jual beli mengikuti aturan tambahan di <Link href="/aturan-jual-beli">Aturan Jual Beli</Link>.
          Produk ilegal, klaim penyembuhan, dan promosi menyesatkan tidak diperbolehkan.
        </p>

        <h2>Rujukan Penting</h2>
        <ul>
          <li><Link href="/disclaimer-medis">Disclaimer Medis</Link></li>
          <li><Link href="/syarat-ketentuan">Syarat & Ketentuan</Link></li>
          <li><Link href="/kebijakan-privasi">Kebijakan Privasi</Link></li>
        </ul>
      </div>
    </div>
  );
}
