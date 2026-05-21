import type { Metadata } from "next";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";

export const metadata: Metadata = {
  title: "Disclaimer Medis — tcm.my.id",
  description: "Batas penggunaan konten kesehatan dan edukasi Traditional Chinese Medicine di tcm.my.id.",
  alternates: { canonical: "/disclaimer-medis" },
};

export default function DisclaimerMedisPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8 rounded-2xl border border-amber-200 bg-amber-light/30 p-6">
        <div className="mb-3 flex items-center gap-2">
          <AlertTriangle size={24} className="text-amber-tcm" />
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-tcm">Keamanan Kesehatan</p>
        </div>
        <h1 className="font-display text-4xl font-bold text-text-main">Disclaimer Medis</h1>
        <p className="mt-3 text-sm text-muted">Terakhir diperbarui: 21 Mei 2026</p>
      </div>

      <div className="prose prose-stone max-w-none dark:prose-invert prose-headings:font-display prose-a:text-primary">
        <p>
          Informasi di tcm.my.id disediakan untuk tujuan edukasi umum tentang Traditional Chinese Medicine dan
          kesehatan holistik. Konten ini tidak dimaksudkan sebagai pengganti konsultasi, diagnosis, terapi,
          resep, atau nasihat medis profesional.
        </p>

        <h2>Bukan Diagnosis atau Terapi Personal</h2>
        <p>
          TCM memerlukan pemeriksaan individual oleh praktisi yang kompeten. Gejala yang mirip dapat memiliki
          pola disharmoni yang berbeda, sehingga saran umum dari artikel atau forum tidak boleh dipakai sebagai
          keputusan klinis pribadi.
        </p>

        <h2>Konsultasikan ke Profesional</h2>
        <p>
          Selalu konsultasikan kondisi Anda kepada dokter, tenaga kesehatan, atau praktisi TCM yang kompeten,
          terutama jika sedang hamil, menyusui, memiliki penyakit kronis, menggunakan obat rutin, menjalani terapi
          dokter, atau mengalami gejala berat.
        </p>

        <h2>Jangan Menghentikan Terapi Dokter</h2>
        <p>
          Jangan memulai, mengubah dosis, atau menghentikan obat dan terapi medis tanpa arahan tenaga kesehatan
          yang berwenang. Herbal dan terapi komplementer dapat memiliki interaksi dan kontraindikasi.
        </p>

        <h2>Kondisi Darurat</h2>
        <p>
          Jika mengalami gejala darurat seperti sesak berat, nyeri dada, kelemahan mendadak, pingsan, perdarahan
          berat, reaksi alergi berat, atau kondisi mengancam jiwa, segera hubungi layanan darurat medis setempat
          atau <a href="tel:119">119</a>.
        </p>

        <h2>Konten Komunitas</h2>
        <p>
          Pendapat pengguna di forum adalah tanggung jawab masing-masing pengguna dan tidak selalu mencerminkan
          pandangan tcm.my.id. Laporkan konten yang memberi klaim berbahaya, diagnosis pasti, atau ajakan menghentikan
          terapi medis tanpa konsultasi.
        </p>

        <p>
          Lihat juga <Link href="/syarat-ketentuan">Syarat & Ketentuan</Link> dan <Link href="/kebijakan-privasi">Kebijakan Privasi</Link>.
        </p>
      </div>
    </div>
  );
}
