export default function WelcomeEmailPage() {
  return (
    <div className="mx-auto max-w-2xl px-4">
      <div
        style={{
          fontFamily: "'Georgia', 'Noto Serif', serif",
          backgroundColor: "#ffffff",
          borderRadius: "12px",
          overflow: "hidden",
          boxShadow: "0 4px 24px rgba(0,0,0,0.10)",
        }}
      >
        {/* Header */}
        <div style={{ backgroundColor: "#3d2b1f", padding: "32px 40px", textAlign: "center" }}>
          <div style={{ fontSize: "2.5rem", color: "#e8bc65", marginBottom: "6px" }}>道</div>
          <div style={{ fontSize: "1.3rem", fontWeight: 700, color: "#e8d5b7", letterSpacing: "0.05em" }}>
            tcm.my.id
          </div>
          <div style={{ fontSize: "0.7rem", color: "#c4874f", letterSpacing: "0.15em", textTransform: "uppercase", marginTop: "2px" }}>
            Komunitas TCM Indonesia
          </div>
        </div>

        {/* Divider bar */}
        <div style={{ height: "4px", background: "linear-gradient(90deg, #4a6741, #c9983a, #8b2020, #c9983a, #4a6741)" }} />

        {/* Body */}
        <div style={{ padding: "40px 40px 32px", backgroundColor: "#faf6ef" }}>
          <p style={{ fontSize: "0.8rem", color: "#8b5e3c", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "8px" }}>
            Selamat Bergabung
          </p>
          <h1 style={{ fontSize: "1.6rem", color: "#1e1410", fontWeight: 700, marginBottom: "16px", lineHeight: 1.3 }}>
            Selamat datang di komunitas TCM Indonesia, <span style={{ color: "#4a6741" }}>Budi</span>! 🌿
          </h1>
          <p style={{ color: "#4a3728", lineHeight: 1.7, marginBottom: "20px", fontSize: "0.95rem" }}>
            Akun Anda di <strong>tcm.my.id</strong> telah berhasil dibuat. Anda kini dapat mulai menjelajahi
            ratusan artikel TCM, berdiskusi di forum komunitas, dan berbagi pengalaman dengan sesama
            praktisi dan pecinta Pengobatan Tradisional Tiongkok di Indonesia.
          </p>

          {/* Feature list */}
          <div style={{ backgroundColor: "#f5ede0", borderRadius: "10px", padding: "20px 24px", marginBottom: "28px" }}>
            <p style={{ fontSize: "0.8rem", fontWeight: 700, color: "#3d2b1f", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "14px" }}>
              Yang bisa Anda lakukan:
            </p>
            {[
              ["📚", "Baca artikel edukasi TCM dari para ahli"],
              ["💬", "Ikut diskusi di 4 subforum komunitas"],
              ["🌿", "Simpan artikel favorit ke bookmark"],
              ["🔔", "Terima notifikasi balasan thread Anda"],
            ].map(([icon, text]) => (
              <div key={text} style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
                <span style={{ fontSize: "1.1rem" }}>{icon}</span>
                <span style={{ color: "#4a3728", fontSize: "0.9rem" }}>{text}</span>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div style={{ textAlign: "center", marginBottom: "32px" }}>
            <a
              href="https://tcm.my.id"
              style={{
                display: "inline-block",
                backgroundColor: "#4a6741",
                color: "#ffffff",
                padding: "14px 36px",
                borderRadius: "8px",
                fontWeight: 600,
                textDecoration: "none",
                fontSize: "0.95rem",
                letterSpacing: "0.02em",
              }}
            >
              Mulai Jelajahi →
            </a>
          </div>

          <hr style={{ borderColor: "#ddd0b8", borderWidth: "1px 0 0", marginBottom: "20px" }} />
          <p style={{ fontSize: "0.78rem", color: "#8b5e3c", lineHeight: 1.6 }}>
            Jika Anda tidak mendaftar di tcm.my.id, abaikan email ini. Akun hanya dapat diaktifkan
            melalui verifikasi email yang valid.
          </p>
        </div>

        {/* Footer */}
        <div style={{ backgroundColor: "#3d2b1f", padding: "20px 40px", textAlign: "center" }}>
          <p style={{ fontSize: "0.75rem", color: "#8b5e3c", marginBottom: "4px" }}>
            © 2026 tcm.my.id · Komunitas TCM Indonesia
          </p>
          <p style={{ fontSize: "0.72rem", color: "#5c3d2e" }}>
            Konten bersifat edukatif, bukan pengganti saran medis profesional.
          </p>
        </div>
      </div>
    </div>
  );
}
