import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Syarat & Ketentuan — tcm.my.id",
  description: "Syarat penggunaan tcm.my.id untuk akun, artikel, forum, moderasi, dan konten komunitas.",
  alternates: { canonical: "/syarat-ketentuan" },
};

export default function SyaratKetentuanPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8 rounded-2xl border border-border-main bg-card p-6">
        <p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-primary">Legal</p>
        <h1 className="font-display text-4xl font-bold text-text-main">Syarat & Ketentuan</h1>
        <p className="mt-3 text-sm text-muted">Terakhir diperbarui: 21 Mei 2026</p>
      </div>

      <div className="prose prose-stone max-w-none dark:prose-invert prose-headings:font-display prose-a:text-primary">
        <p>
          Dengan mengakses tcm.my.id, Anda setuju untuk menggunakan platform ini secara bertanggung jawab,
          menghormati pengguna lain, dan memahami bahwa konten kesehatan di sini bersifat edukatif.
        </p>

        <h2>Ruang Lingkup Layanan</h2>
        <p>
          tcm.my.id menyediakan artikel edukatif, ruang diskusi komunitas, dan fitur pendukung pembelajaran
          Traditional Chinese Medicine. Platform ini bukan layanan diagnosis, konsultasi medis personal, atau
          pengganti layanan kesehatan profesional.
        </p>

        <h2>Akun Pengguna</h2>
        <ul>
          <li>Pengguna wajib memberikan informasi akun yang wajar dan tidak menyesatkan.</li>
          <li>Pengguna bertanggung jawab menjaga keamanan email, password, dan sesi login.</li>
          <li>Pengelola dapat membatasi, menangguhkan, atau menghapus akun yang melanggar aturan.</li>
        </ul>

        <h2>Aturan Konten dan Forum</h2>
        <ul>
          <li>Dilarang spam, penipuan, pelecehan, doxing, ujaran kebencian, dan konten ilegal.</li>
          <li>Dilarang memberi diagnosis personal yang mengklaim pasti benar tanpa pemeriksaan profesional.</li>
          <li>Dilarang mendorong pengguna menghentikan obat/terapi dokter tanpa konsultasi tenaga kesehatan.</li>
          <li>Pengguna bertanggung jawab atas konten yang dipublikasikan.</li>
        </ul>

        <h2>Konten Jual Beli</h2>
        <p>
          Forum jual beli, bila tersedia, harus digunakan secara hati-hati. Klaim menyembuhkan penyakit, produk ilegal,
          informasi izin edar palsu, atau transaksi menyesatkan dapat dihapus dan akun terkait dapat dibatasi.
          Transaksi antar pengguna menjadi tanggung jawab masing-masing pihak.
        </p>

        <h2>Moderasi</h2>
        <p>
          Pengelola dapat meninjau, menyembunyikan, menghapus, atau membatasi konten demi keamanan komunitas,
          kepatuhan hukum, dan pengurangan risiko kesehatan. Keputusan moderasi dapat dilakukan tanpa pemberitahuan
          terlebih dahulu jika konten dinilai berisiko tinggi.
        </p>

        <h2>Batas Tanggung Jawab</h2>
        <p>
          tcm.my.id tidak bertanggung jawab atas kerugian akibat penggunaan informasi secara mandiri tanpa konsultasi
          profesional, interaksi antar pengguna, atau transaksi yang terjadi di luar kendali platform.
        </p>

        <h2>Disclaimer Medis</h2>
        <p>
          Baca juga <Link href="/disclaimer-medis">Disclaimer Medis</Link> untuk memahami batas konten kesehatan di platform ini.
        </p>

        <h2>Perubahan Ketentuan</h2>
        <p>
          Ketentuan ini dapat diperbarui sewaktu-waktu. Versi terbaru akan tersedia di halaman ini.
        </p>
      </div>
    </div>
  );
}
