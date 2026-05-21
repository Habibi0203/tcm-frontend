import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Aturan Jual Beli — tcm.my.id",
  description: "Aturan keamanan forum jual beli herbal, alat, dan produk terkait TCM di tcm.my.id.",
  alternates: { canonical: "/aturan-jual-beli" },
};

export default function AturanJualBeliPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8 rounded-2xl border border-amber-200 bg-amber-light/30 p-6">
        <p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-amber-tcm">Keamanan Transaksi</p>
        <h1 className="font-display text-4xl font-bold text-text-main">Aturan Jual Beli</h1>
        <p className="mt-3 text-sm text-muted">Terakhir diperbarui: 21 Mei 2026</p>
      </div>

      <div className="prose prose-stone max-w-none dark:prose-invert prose-headings:font-display prose-a:text-primary">
        <p>
          Forum jual beli adalah area berisiko tinggi karena berkaitan dengan produk kesehatan, herbal, alat terapi,
          dan transaksi antar pengguna. Aturan ini dibuat untuk mengurangi risiko penipuan, klaim medis berlebihan,
          dan produk yang tidak aman.
        </p>

        <h2>Aturan Wajib Penjual</h2>
        <ul>
          <li>Jelaskan produk secara jujur: nama produk, komposisi, ukuran, kondisi, harga, dan lokasi pengiriman.</li>
          <li>Jika produk memerlukan izin edar atau dokumen legal, cantumkan informasi yang benar dan dapat diverifikasi.</li>
          <li>Ungkapkan bila posting bersifat promosi, afiliasi, reseller, sponsor, atau titipan pihak lain.</li>
          <li>Jangan menyamarkan risiko, kontraindikasi, atau batas penggunaan produk.</li>
        </ul>

        <h2>Dilarang Keras</h2>
        <ul>
          <li>Klaim menyembuhkan kanker, diabetes, hipertensi, autoimun, infertilitas, atau penyakit serius lain secara pasti.</li>
          <li>Klaim menggantikan obat dokter, operasi, terapi medis, atau konsultasi profesional.</li>
          <li>Menjual produk ilegal, palsu, kadaluarsa, tidak jelas komposisinya, atau tanpa izin yang seharusnya diperlukan.</li>
          <li>Testimoni medis berlebihan seperti “pasti sembuh”, “100% aman”, “tanpa efek samping”, atau “dokter tidak perlu”.</li>
          <li>Skema penipuan, dropship menyesatkan, manipulasi harga, atau tautan pembayaran mencurigakan.</li>
        </ul>

        <h2>Untuk Pembeli</h2>
        <ul>
          <li>Periksa reputasi penjual, detail produk, izin edar, dan risiko penggunaan.</li>
          <li>Jangan mengirim data pribadi atau data medis sensitif secara publik.</li>
          <li>Konsultasikan penggunaan herbal/alat terapi dengan tenaga kesehatan jika memiliki kondisi medis atau obat rutin.</li>
          <li>Transaksi antar pengguna menjadi tanggung jawab pembeli dan penjual.</li>
        </ul>

        <h2>Moderasi dan Sanksi</h2>
        <p>
          tcm.my.id dapat menyembunyikan atau menghapus posting jual beli, mengunci thread, meminta klarifikasi,
          membatasi akun, atau memblokir pengguna bila konten dianggap berisiko. Keputusan moderasi dapat dilakukan
          tanpa pemberitahuan awal untuk mencegah bahaya atau penipuan.
        </p>

        <h2>Batas Tanggung Jawab Platform</h2>
        <p>
          tcm.my.id bukan pihak penjual, pembeli, distributor, atau penjamin produk. Platform tidak bertanggung jawab
          atas kerugian transaksi antar pengguna, efek penggunaan produk, keterlambatan pengiriman, atau klaim yang
          dibuat oleh penjual.
        </p>

        <h2>Rujukan</h2>
        <p>
          Baca juga <Link href="/pedoman-komunitas">Pedoman Komunitas</Link>, <Link href="/disclaimer-medis">Disclaimer Medis</Link>,
          dan <Link href="/syarat-ketentuan">Syarat & Ketentuan</Link>.
        </p>
      </div>
    </div>
  );
}
