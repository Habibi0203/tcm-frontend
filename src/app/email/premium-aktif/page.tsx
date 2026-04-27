export default function PremiumAktifEmailPage() {
  const expiryDate = "19 April 2027";

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
        {/* Header — premium gold variant */}
        <div
          style={{
            background: "linear-gradient(135deg, #3d2b1f 0%, #5c3d2e 50%, #3d2b1f 100%)",
            padding: "36px 40px",
            textAlign: "center",
            position: "relative",
          }}
        >
          <div style={{ fontSize: "2.8rem", color: "#e8bc65", marginBottom: "4px" }}>道</div>
          <div style={{ fontSize: "1.3rem", fontWeight: 700, color: "#e8d5b7", letterSpacing: "0.05em" }}>
            tcm.my.id
          </div>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "6px",
            marginTop: "12px", backgroundColor: "rgba(201,152,58,0.2)",
            border: "1px solid rgba(201,152,58,0.4)",
            borderRadius: "999px", padding: "4px 14px",
          }}>
            <span style={{ fontSize: "0.9rem" }}>👑</span>
            <span style={{ fontSize: "0.72rem", color: "#e8bc65", letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 600 }}>
              Akses Akun
            </span>
          </div>
        </div>
        <div style={{ height: "4px", background: "linear-gradient(90deg, #c9983a, #e8bc65, #c9983a)" }} />

        {/* Body */}
        <div style={{ padding: "40px 40px 32px", backgroundColor: "#faf6ef" }}>
          <h1 style={{ fontSize: "1.6rem", color: "#1e1410", fontWeight: 700, marginBottom: "12px", lineHeight: 1.3 }}>
            Selamat! Akses Akun Anda Aktif 🎉
          </h1>
          <p style={{ color: "#4a3728", lineHeight: 1.7, marginBottom: "28px", fontSize: "0.95rem" }}>
            Halo <strong>Budi</strong>, terima kasih. Akses akun Anda di <strong>tcm.my.id</strong> kini sudah aktif.
            Kini Anda memiliki akses penuh ke konten dan fitur yang tersedia untuk akun Anda hingga{" "}
            <strong style={{ color: "#3d2b1f" }}>{expiryDate}</strong>.
          </p>

          {/* Benefits grid */}
          <div style={{ marginBottom: "28px" }}>
            <p style={{ fontSize: "0.78rem", fontWeight: 700, color: "#3d2b1f", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "14px" }}>
              Yang Anda dapatkan:
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
              {[
                ["📚", "Semua artikel akses khusus"],
                ["💬", "Subforum eksklusif"],
                ["🌐", "Terjemahan artikel (EN)"],
                ["🔔", "Update mingguan"],
                ["👨‍⚕️", "Tanya praktisi langsung"],
                ["⭐", "Priority support"],
              ].map(([icon, text]) => (
                <div
                  key={text}
                  style={{
                    display: "flex", alignItems: "center", gap: "8px",
                    backgroundColor: "#fff", border: "1px solid #ddd0b8",
                    borderRadius: "8px", padding: "10px 12px",
                  }}
                >
                  <span style={{ fontSize: "1rem" }}>{icon}</span>
                  <span style={{ fontSize: "0.82rem", color: "#4a3728" }}>{text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Membership info */}
          <div style={{
            backgroundColor: "rgba(201,152,58,0.08)", border: "1px solid rgba(201,152,58,0.25)",
            borderRadius: "10px", padding: "16px 20px", marginBottom: "28px",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
              <span style={{ fontSize: "0.82rem", color: "#8b5e3c" }}>Paket</span>
              <span style={{ fontSize: "0.82rem", fontWeight: 600, color: "#1e1410" }}>Akses Tahunan</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
              <span style={{ fontSize: "0.82rem", color: "#8b5e3c" }}>Aktif sejak</span>
              <span style={{ fontSize: "0.82rem", fontWeight: 600, color: "#1e1410" }}>19 April 2026</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontSize: "0.82rem", color: "#8b5e3c" }}>Berlaku hingga</span>
              <span style={{ fontSize: "0.82rem", fontWeight: 600, color: "#4a6741" }}>{expiryDate}</span>
            </div>
          </div>

          {/* CTA */}
          <div style={{ textAlign: "center", marginBottom: "28px" }}>
            <a
              href="https://tcm.my.id/artikel"
              style={{
                display: "inline-block", backgroundColor: "#c9983a",
                color: "#ffffff", padding: "14px 36px",
                borderRadius: "8px", fontWeight: 600,
                textDecoration: "none", fontSize: "0.95rem",
              }}
            >
              Jelajahi Konten →
            </a>
          </div>

          <hr style={{ borderColor: "#ddd0b8", borderWidth: "1px 0 0", marginBottom: "18px" }} />
          <p style={{ fontSize: "0.78rem", color: "#8b5e3c", lineHeight: 1.6 }}>
            Butuh bantuan? Hubungi kami di{" "}
            <a href="mailto:support@tcm.my.id" style={{ color: "#4a6741" }}>support@tcm.my.id</a>{" "}
            atau kunjungi <a href="https://tcm.my.id/dashboard" style={{ color: "#4a6741" }}>dashboard</a> Anda.
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
