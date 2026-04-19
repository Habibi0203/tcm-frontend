export default function BalasanThreadEmailPage() {
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
        <div style={{ backgroundColor: "#3d2b1f", padding: "28px 40px", textAlign: "center" }}>
          <div style={{ fontSize: "2.2rem", color: "#e8bc65", marginBottom: "4px" }}>道</div>
          <div style={{ fontSize: "1.2rem", fontWeight: 700, color: "#e8d5b7", letterSpacing: "0.05em" }}>
            tcm.my.id
          </div>
          <div style={{ fontSize: "0.7rem", color: "#c4874f", letterSpacing: "0.15em", textTransform: "uppercase", marginTop: "2px" }}>
            Notifikasi Forum
          </div>
        </div>
        <div style={{ height: "4px", background: "linear-gradient(90deg, #4a6741, #c9983a, #8b2020, #c9983a, #4a6741)" }} />

        {/* Body */}
        <div style={{ padding: "32px 40px 28px", backgroundColor: "#faf6ef" }}>
          {/* Notification type */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "6px",
            backgroundColor: "#d8e8cf", borderRadius: "999px",
            padding: "4px 12px", marginBottom: "16px",
          }}>
            <span style={{ fontSize: "0.9rem" }}>💬</span>
            <span style={{ fontSize: "0.72rem", color: "#3b5333", letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 600 }}>
              Balasan Baru
            </span>
          </div>

          <h1 style={{ fontSize: "1.4rem", color: "#1e1410", fontWeight: 700, marginBottom: "8px", lineHeight: 1.4 }}>
            Ada yang membalas thread Anda
          </h1>
          <p style={{ color: "#8b5e3c", fontSize: "0.88rem", marginBottom: "24px" }}>
            Halo <strong style={{ color: "#1e1410" }}>Budi</strong>, seseorang baru saja membalas thread yang Anda buat di forum <strong style={{ color: "#4a6741" }}>Diskusi Umum TCM</strong>.
          </p>

          {/* Original thread */}
          <div style={{
            borderLeft: "3px solid #ddd0b8", paddingLeft: "16px",
            marginBottom: "20px",
          }}>
            <p style={{ fontSize: "0.72rem", color: "#8b5e3c", marginBottom: "4px", textTransform: "uppercase", letterSpacing: "0.08em" }}>
              Thread Anda:
            </p>
            <p style={{ fontSize: "0.92rem", fontWeight: 600, color: "#3d2b1f", lineHeight: 1.4 }}>
              {`"Pengalaman konsumsi Bai Zhu untuk pencernaan — ada yang pernah coba?"`}
            </p>
          </div>

          {/* Reply card */}
          <div style={{
            backgroundColor: "#ffffff", border: "1px solid #ddd0b8",
            borderRadius: "10px", padding: "18px 20px", marginBottom: "24px",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
              <div style={{
                width: "36px", height: "36px", borderRadius: "50%",
                background: "linear-gradient(135deg, #8b5e3c, #4a6741)",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "white", fontWeight: 700, fontSize: "0.9rem",
              }}>
                RA
              </div>
              <div>
                <div style={{ fontSize: "0.88rem", fontWeight: 600, color: "#1e1410" }}>Rina Andriani</div>
                <div style={{ fontSize: "0.72rem", color: "#8b5e3c" }}>Praktisi TCM · 2 menit lalu</div>
              </div>
            </div>
            <p style={{ fontSize: "0.88rem", color: "#4a3728", lineHeight: 1.7, margin: 0 }}>
              Saya sudah menggunakannya selama 3 bulan untuk gangguan pencernaan kronis. Dosisnya
              penting banget disesuaikan — saya pakai 9g per hari dalam dekok bersama Fu Ling. Hasilnya
              lumayan signifikan setelah 6 minggu. Tapi sebaiknya tetap konsultasi dengan praktisi dulu
              karena kondisi setiap orang beda... 🌿
            </p>
          </div>

          {/* CTA */}
          <div style={{ textAlign: "center", marginBottom: "28px", display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
            <a
              href="https://tcm.my.id/forum/diskusi-umum/thr_001"
              style={{
                display: "inline-block", backgroundColor: "#4a6741",
                color: "#ffffff", padding: "12px 28px",
                borderRadius: "8px", fontWeight: 600,
                textDecoration: "none", fontSize: "0.9rem",
              }}
            >
              Lihat Balasan →
            </a>
            <a
              href="https://tcm.my.id/dashboard?tab=notifikasi"
              style={{
                display: "inline-block", backgroundColor: "transparent",
                color: "#4a6741", padding: "12px 28px",
                borderRadius: "8px", fontWeight: 500,
                textDecoration: "none", fontSize: "0.9rem",
                border: "1px solid #ddd0b8",
              }}
            >
              Semua Notifikasi
            </a>
          </div>

          <hr style={{ borderColor: "#ddd0b8", borderWidth: "1px 0 0", marginBottom: "16px" }} />
          <p style={{ fontSize: "0.75rem", color: "#8b5e3c", lineHeight: 1.6 }}>
            Anda menerima email ini karena mengaktifkan notifikasi untuk thread ini. {" "}
            <a href="https://tcm.my.id/dashboard?tab=notifikasi" style={{ color: "#4a6741" }}>
              Kelola preferensi notifikasi
            </a>
          </p>
        </div>

        {/* Footer */}
        <div style={{ backgroundColor: "#3d2b1f", padding: "18px 40px", textAlign: "center" }}>
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
