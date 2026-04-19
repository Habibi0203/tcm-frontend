export default function ResetPasswordEmailPage() {
  const resetUrl = "https://tcm.my.id/reset-password?token=abc123demo";

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
        <div style={{ height: "4px", background: "linear-gradient(90deg, #4a6741, #c9983a, #8b2020, #c9983a, #4a6741)" }} />

        {/* Body */}
        <div style={{ padding: "40px 40px 32px", backgroundColor: "#faf6ef" }}>
          {/* Icon */}
          <div style={{ textAlign: "center", marginBottom: "20px" }}>
            <div style={{
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              width: "56px", height: "56px", borderRadius: "50%",
              backgroundColor: "#f5e4c0", fontSize: "1.6rem",
            }}>🔐</div>
          </div>

          <h1 style={{ fontSize: "1.5rem", color: "#1e1410", fontWeight: 700, marginBottom: "12px", textAlign: "center", lineHeight: 1.3 }}>
            Permintaan Reset Password
          </h1>
          <p style={{ color: "#4a3728", lineHeight: 1.7, marginBottom: "20px", fontSize: "0.95rem", textAlign: "center" }}>
            Kami menerima permintaan untuk mereset password akun tcm.my.id yang terhubung dengan
            email ini. Klik tombol di bawah untuk membuat password baru.
          </p>

          {/* CTA */}
          <div style={{ textAlign: "center", marginBottom: "24px" }}>
            <a
              href={resetUrl}
              style={{
                display: "inline-block",
                backgroundColor: "#4a6741",
                color: "#ffffff",
                padding: "14px 36px",
                borderRadius: "8px",
                fontWeight: 600,
                textDecoration: "none",
                fontSize: "0.95rem",
              }}
            >
              Reset Password Saya
            </a>
          </div>

          {/* Fallback URL */}
          <div style={{ backgroundColor: "#f5ede0", borderRadius: "8px", padding: "16px 20px", marginBottom: "24px" }}>
            <p style={{ fontSize: "0.78rem", color: "#8b5e3c", marginBottom: "6px", fontWeight: 600 }}>
              Atau salin link ini ke browser:
            </p>
            <p style={{ fontFamily: "monospace", fontSize: "0.75rem", color: "#4a6741", wordBreak: "break-all", lineHeight: 1.5 }}>
              {resetUrl}
            </p>
          </div>

          {/* Warning box */}
          <div style={{
            display: "flex", gap: "12px", alignItems: "flex-start",
            backgroundColor: "#fff8e6", border: "1px solid #f5e4c0",
            borderRadius: "8px", padding: "14px 16px", marginBottom: "24px",
          }}>
            <span style={{ fontSize: "1.1rem", flexShrink: 0 }}>⚠️</span>
            <div>
              <p style={{ fontSize: "0.82rem", color: "#5c3d2e", fontWeight: 600, marginBottom: "4px" }}>Perhatian keamanan</p>
              <p style={{ fontSize: "0.8rem", color: "#8b5e3c", lineHeight: 1.6 }}>
                Link ini hanya berlaku selama <strong>1 jam</strong> dan hanya bisa digunakan sekali.
                Jangan bagikan link ini kepada siapapun. Tim tcm.my.id tidak pernah meminta password Anda.
              </p>
            </div>
          </div>

          <hr style={{ borderColor: "#ddd0b8", borderWidth: "1px 0 0", marginBottom: "18px" }} />
          <p style={{ fontSize: "0.78rem", color: "#8b5e3c", lineHeight: 1.6 }}>
            Jika Anda tidak meminta reset password, abaikan email ini. Akun Anda tetap aman.
            Hubungi <a href="mailto:support@tcm.my.id" style={{ color: "#4a6741" }}>support@tcm.my.id</a> jika ada pertanyaan.
          </p>
        </div>

        {/* Footer */}
        <div style={{ backgroundColor: "#3d2b1f", padding: "20px 40px", textAlign: "center" }}>
          <p style={{ fontSize: "0.75rem", color: "#8b5e3c", marginBottom: "4px" }}>
            © 2026 tcm.my.id · Komunitas TCM Indonesia
          </p>
          <p style={{ fontSize: "0.72rem", color: "#5c3d2e" }}>
            Email ini dikirim ke Anda karena ada permintaan reset password.
          </p>
        </div>
      </div>
    </div>
  );
}
