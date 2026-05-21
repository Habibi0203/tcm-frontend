import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-16 bg-bark">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* ── Top grid ── */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary font-chinese text-xl text-white">
                道
              </div>
              <span className="font-display text-2xl font-bold text-gold-light">tcm.my.id</span>
            </Link>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-clay">
              Platform komunitas Traditional Chinese Medicine Indonesia. Kami menyediakan
              edukasi, diskusi, dan sumber daya terpercaya untuk semua level — dari pemula
              hingga praktisi.
            </p>
          </div>

          {/* Jelajahi */}
          <div>
            <h4 className="mb-3 text-[0.7rem] font-medium uppercase tracking-[0.15em] text-gold">
              Jelajahi
            </h4>
            <ul className="space-y-2 text-sm text-clay">
              <li><Link href="/artikel" className="hover:text-sand transition-colors">Artikel</Link></li>
              <li><Link href="/forum" className="hover:text-sand transition-colors">Forum</Link></li>
              <li><Link href="/daftar" className="hover:text-sand transition-colors">Daftar Member</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="mb-3 text-[0.7rem] font-medium uppercase tracking-[0.15em] text-gold">
              Legal
            </h4>
            <ul className="space-y-2 text-sm text-clay">
              <li><Link href="/tentang" className="hover:text-sand transition-colors">Tentang Kami</Link></li>
              <li><Link href="/kebijakan-privasi" className="hover:text-sand transition-colors">Kebijakan Privasi</Link></li>
              <li><Link href="/syarat-ketentuan" className="hover:text-sand transition-colors">Syarat &amp; Ketentuan</Link></li>
              <li><Link href="/disclaimer-medis" className="hover:text-sand transition-colors">Disclaimer Medis</Link></li>
              <li><Link href="/pedoman-komunitas" className="hover:text-sand transition-colors">Pedoman Komunitas</Link></li>
              <li><Link href="/aturan-jual-beli" className="hover:text-sand transition-colors">Aturan Jual Beli</Link></li>
            </ul>
          </div>
        </div>

        {/* ── Medical disclaimer ── */}
        <div className="mt-10 rounded-xl border border-bark-light bg-bark-light/60 p-4 text-xs text-clay">
          <strong className="block font-semibold text-sand">⚕️ Disclaimer Medis</strong>
          <p className="mt-1">
            Informasi di tcm.my.id hanya untuk tujuan edukasi dan bukan pengganti konsultasi,
            diagnosis, atau pengobatan medis profesional. Selalu konsultasikan dengan praktisi
            TCM bersertifikat atau dokter untuk kondisi kesehatan Anda.
          </p>
        </div>

        {/* ── Bottom bar ── */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-2 border-t border-white/[0.08] pt-6 text-xs text-earth">
          <span>© 2026 tcm.my.id — Semua hak dilindungi</span>
          <span className="font-chinese text-lg text-gold/60">中</span>
          <span>Konten bersifat edukatif, bukan pengganti saran medis profesional</span>
        </div>
      </div>
    </footer>
  );
}
