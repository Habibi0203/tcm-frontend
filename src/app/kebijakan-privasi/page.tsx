import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Kebijakan Privasi — tcm.my.id",
  description: "Kebijakan privasi tcm.my.id terkait data akun, aktivitas komunitas, dan penggunaan layanan.",
  alternates: { canonical: "/kebijakan-privasi" },
};

export default function KebijakanPrivasiPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8 rounded-2xl border border-border-main bg-card p-6">
        <p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-primary">Legal</p>
        <h1 className="font-display text-4xl font-bold text-text-main">Kebijakan Privasi</h1>
        <p className="mt-3 text-sm text-muted">Terakhir diperbarui: 21 Mei 2026</p>
      </div>

      <div className="prose prose-stone max-w-none dark:prose-invert prose-headings:font-display prose-a:text-primary">
        <p>
          Kebijakan ini menjelaskan bagaimana tcm.my.id mengelola data pengguna saat menggunakan
          artikel, akun, forum, dan fitur komunitas. Kami berusaha mengumpulkan data secara terbatas,
          proporsional, dan sesuai kebutuhan operasional platform.
        </p>

        <h2>Data yang Kami Kumpulkan</h2>
        <ul>
          <li>Data akun seperti email, username, nama tampilan, avatar, dan password yang disimpan dalam bentuk hash.</li>
          <li>Data aktivitas komunitas seperti thread, balasan, komentar, like, bookmark, dan laporan konten.</li>
          <li>Data teknis seperti alamat IP, user-agent, waktu akses, log error, dan aktivitas keamanan untuk mencegah penyalahgunaan.</li>
          <li>Data preferensi seperti tema tampilan atau pengaturan yang dibutuhkan untuk pengalaman pengguna.</li>
        </ul>

        <h2>Tujuan Penggunaan Data</h2>
        <ul>
          <li>Menyediakan akses akun, autentikasi, dan fitur komunitas.</li>
          <li>Menjaga keamanan layanan, mencegah spam, brute force, penipuan, dan penyalahgunaan forum.</li>
          <li>Menampilkan konten publik yang dibuat pengguna sesuai aturan komunitas.</li>
          <li>Menganalisis performa, memperbaiki bug, dan meningkatkan kualitas layanan.</li>
        </ul>

        <h2>Data Publik</h2>
        <p>
          Username, nama tampilan, profil publik, thread, komentar, dan balasan yang Anda kirim di forum dapat
          terlihat oleh pengguna lain atau pengunjung publik, kecuali fitur tertentu dinyatakan privat.
        </p>

        <h2>Cookie dan Session</h2>
        <p>
          tcm.my.id dapat menggunakan cookie/session untuk login, keamanan, preferensi tampilan, dan fungsi dasar
          layanan. Jangan membagikan akses akun atau perangkat login kepada pihak lain.
        </p>

        <h2>Berbagi Data ke Pihak Ketiga</h2>
        <p>
          Kami tidak menjual data pribadi pengguna. Data dapat diproses oleh penyedia infrastruktur, email, hosting,
          database, atau layanan keamanan sepanjang diperlukan untuk menjalankan platform.
        </p>

        <h2>Keamanan Data</h2>
        <p>
          Kami menerapkan langkah keamanan bertahap, termasuk HTTPS, pembatasan akses, logging keamanan, dan kontrol
          autentikasi. Namun tidak ada sistem yang sepenuhnya bebas risiko, sehingga pengguna tetap perlu menjaga
          keamanan akun masing-masing.
        </p>

        <h2>Hak Pengguna</h2>
        <p>
          Anda dapat meminta koreksi, penghapusan, atau peninjauan data akun sepanjang tidak bertentangan dengan
          kebutuhan keamanan, audit penyalahgunaan, atau kewajiban operasional yang sah.
        </p>

        <h2>Konten Kesehatan</h2>
        <p>
          Jangan mengirim data medis pribadi yang sensitif ke forum publik. Jika ingin membahas kondisi kesehatan,
          samarkan identitas dan hindari membagikan informasi yang tidak ingin diketahui publik.
        </p>

        <h2>Kontak</h2>
        <p>
          Untuk pertanyaan privasi, permintaan koreksi, atau penghapusan akun, hubungi pengelola melalui halaman
          <Link href="/tentang"> Tentang Kami</Link> atau kanal kontak resmi yang tersedia di platform.
        </p>
      </div>
    </div>
  );
}
