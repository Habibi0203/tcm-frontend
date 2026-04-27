/** Reusable HTML email templates — inline styles only (email-client safe) */

/** Prevent HTML/XSS injection when interpolating user input into email HTML */
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// ── Shared primitives ────────────────────────────────────────────────────────

const HEADER = `
<div style="background-color:#3d2b1f;padding:32px 40px;text-align:center;">
  <div style="font-size:2.4rem;color:#e8bc65;margin-bottom:6px;font-family:serif;">道</div>
  <div style="font-size:1.2rem;font-weight:700;color:#e8d5b7;letter-spacing:0.05em;font-family:Georgia,serif;">tcm.my.id</div>
  <div style="font-size:0.65rem;color:#c4874f;letter-spacing:0.15em;text-transform:uppercase;margin-top:2px;font-family:sans-serif;">Komunitas TCM Indonesia</div>
</div>
<div style="height:4px;background:linear-gradient(90deg,#4a6741,#c9983a,#8b2020,#c9983a,#4a6741);"></div>`;

const FOOTER = `
<div style="background-color:#3d2b1f;padding:20px 40px;text-align:center;">
  <p style="font-size:0.72rem;color:#8b5e3c;margin:0 0 4px;font-family:sans-serif;">© 2026 tcm.my.id · Komunitas TCM Indonesia</p>
  <p style="font-size:0.68rem;color:#5c3d2e;margin:0;font-family:sans-serif;">Konten bersifat edukatif, bukan pengganti saran medis profesional.</p>
</div>`;

function wrap(bodyHtml: string): string {
  return `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
</head>
<body style="margin:0;padding:0;background:#f0ede8;font-family:Georgia,'Noto Serif',serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0ede8;padding:32px 16px;">
    <tr><td align="center">
      <div style="max-width:600px;width:100%;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.08);">
        ${HEADER}
        <div style="padding:36px 40px 28px;background-color:#faf6ef;">
          ${bodyHtml}
        </div>
        ${FOOTER}
      </div>
    </td></tr>
  </table>
</body>
</html>`;
}

// ── 1. Selamat Datang ────────────────────────────────────────────────────────

export function welcomeEmail(opts: { name: string }): { subject: string; html: string } {
  const safeName = escapeHtml(opts.name);
  const html = wrap(`
    <p style="font-size:0.78rem;color:#8b5e3c;letter-spacing:0.1em;text-transform:uppercase;margin:0 0 8px;">Selamat Bergabung</p>
    <h1 style="font-size:1.5rem;color:#1e1410;font-weight:700;margin:0 0 16px;line-height:1.3;">
      Selamat datang di komunitas TCM Indonesia,
      <span style="color:#4a6741;">${safeName}</span>! 🌿
    </h1>
    <p style="color:#4a3728;line-height:1.7;margin:0 0 20px;font-size:0.92rem;">
      Akun Anda di <strong>tcm.my.id</strong> telah berhasil dibuat. Kini Anda dapat mulai menjelajahi
      ratusan artikel TCM, berdiskusi di forum komunitas, dan berbagi pengalaman dengan sesama
      praktisi dan pecinta Pengobatan Tradisional Tiongkok di Indonesia.
    </p>
    <div style="background:#f5ede0;border-radius:10px;padding:18px 22px;margin:0 0 28px;">
      <p style="font-size:0.75rem;font-weight:700;color:#3d2b1f;letter-spacing:0.08em;text-transform:uppercase;margin:0 0 12px;">Yang bisa Anda lakukan:</p>
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:9px;"><span style="font-size:1rem;">📚</span><span style="color:#4a3728;font-size:0.88rem;">Baca artikel edukasi TCM dari para ahli</span></div>
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:9px;"><span style="font-size:1rem;">💬</span><span style="color:#4a3728;font-size:0.88rem;">Ikut diskusi di 4 subforum komunitas</span></div>
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:9px;"><span style="font-size:1rem;">🌿</span><span style="color:#4a3728;font-size:0.88rem;">Simpan artikel favorit ke bookmark</span></div>
      <div style="display:flex;align-items:center;gap:10px;"><span style="font-size:1rem;">🔔</span><span style="color:#4a3728;font-size:0.88rem;">Terima notifikasi balasan thread Anda</span></div>
    </div>
    <div style="text-align:center;margin:0 0 28px;">
      <a href="https://tcm.my.id" style="display:inline-block;background:#4a6741;color:#fff;padding:13px 34px;border-radius:8px;font-weight:600;text-decoration:none;font-size:0.92rem;font-family:sans-serif;">
        Mulai Jelajahi →
      </a>
    </div>
    <hr style="border:none;border-top:1px solid #ddd0b8;margin:0 0 16px;" />
    <p style="font-size:0.75rem;color:#8b5e3c;line-height:1.6;margin:0;font-family:sans-serif;">
      Jika Anda tidak mendaftar di tcm.my.id, abaikan email ini.
    </p>`);

  return {
    subject: `Selamat datang di tcm.my.id, ${safeName}! 🌿`,
    html,
  };
}

// ── 2. Reset Password ────────────────────────────────────────────────────────

export function resetPasswordEmail(opts: { name: string; resetUrl: string }): { subject: string; html: string } {
  const safeName = escapeHtml(opts.name);
  const safeUrl  = escapeHtml(opts.resetUrl);
  const html = wrap(`
    <div style="text-align:center;margin:0 0 20px;">
      <div style="display:inline-flex;align-items:center;justify-content:center;width:52px;height:52px;border-radius:50%;background:#f5e4c0;font-size:1.5rem;line-height:1;">🔐</div>
    </div>
    <h1 style="font-size:1.4rem;color:#1e1410;font-weight:700;text-align:center;margin:0 0 12px;line-height:1.3;">Permintaan Reset Password</h1>
    <p style="color:#4a3728;line-height:1.7;text-align:center;margin:0 0 22px;font-size:0.92rem;">
      Halo <strong>${safeName}</strong>, kami menerima permintaan untuk mereset password akun tcm.my.id Anda.
      Klik tombol di bawah untuk membuat password baru.
    </p>
    <div style="text-align:center;margin:0 0 22px;">
      <a href="${safeUrl}" style="display:inline-block;background:#4a6741;color:#fff;padding:13px 34px;border-radius:8px;font-weight:600;text-decoration:none;font-size:0.92rem;font-family:sans-serif;">
        Reset Password Saya
      </a>
    </div>
    <div style="background:#f5ede0;border-radius:8px;padding:14px 18px;margin:0 0 20px;">
      <p style="font-size:0.75rem;color:#8b5e3c;margin:0 0 6px;font-weight:600;font-family:sans-serif;">Atau salin link ini ke browser:</p>
      <p style="font-family:monospace;font-size:0.72rem;color:#4a6741;word-break:break-all;line-height:1.5;margin:0;">${safeUrl}</p>
    </div>
    <div style="background:#fff8e6;border:1px solid #f5e4c0;border-radius:8px;padding:13px 16px;margin:0 0 22px;display:flex;gap:10px;">
      <span style="font-size:1rem;flex-shrink:0;">⚠️</span>
      <div>
        <p style="font-size:0.8rem;color:#5c3d2e;font-weight:600;margin:0 0 4px;font-family:sans-serif;">Perhatian keamanan</p>
        <p style="font-size:0.78rem;color:#8b5e3c;line-height:1.6;margin:0;font-family:sans-serif;">
          Link berlaku <strong>1 jam</strong> dan hanya bisa digunakan sekali. Jangan bagikan kepada siapapun.
        </p>
      </div>
    </div>
    <hr style="border:none;border-top:1px solid #ddd0b8;margin:0 0 16px;" />
    <p style="font-size:0.75rem;color:#8b5e3c;line-height:1.6;margin:0;font-family:sans-serif;">
      Jika Anda tidak meminta reset password, abaikan email ini. Akun Anda tetap aman.
      Hubungi <a href="mailto:support@tcm.my.id" style="color:#4a6741;">support@tcm.my.id</a> jika ada pertanyaan.
    </p>`);

  return {
    subject: "Reset Password tcm.my.id",
    html,
  };
}

// ── 3. Premium Aktif ─────────────────────────────────────────────────────────

export function premiumAktifEmail(opts: {
  name: string;
  plan: string;
  startDate: string;
  expiryDate: string;
}): { subject: string; html: string } {
  const safeName   = escapeHtml(opts.name);
  const safePlan   = escapeHtml(opts.plan);
  const safeStart  = escapeHtml(opts.startDate);
  const safeExpiry = escapeHtml(opts.expiryDate);
  const html = wrap(`
    <div style="text-align:center;margin:0 0 20px;">
      <div style="display:inline-flex;align-items:center;gap:6px;background:rgba(201,152,58,0.15);border:1px solid rgba(201,152,58,0.35);border-radius:999px;padding:5px 16px;">
        <span style="font-size:0.9rem;">👑</span>
        <span style="font-size:0.7rem;color:#c9983a;letter-spacing:0.12em;text-transform:uppercase;font-weight:600;font-family:sans-serif;">Akses Akun</span>
      </div>
    </div>
    <h1 style="font-size:1.5rem;color:#1e1410;font-weight:700;margin:0 0 12px;line-height:1.3;">Selamat! Akses Akun Anda Aktif 🎉</h1>
    <p style="color:#4a3728;line-height:1.7;margin:0 0 24px;font-size:0.92rem;">
      Halo <strong>${safeName}</strong>, terima kasih. Akses akun Anda di <strong>tcm.my.id</strong> kini sudah aktif.
      Kini Anda memiliki akses penuh ke seluruh konten eksklusif hingga <strong style="color:#3d2b1f;">${safeExpiry}</strong>.
    </p>
    <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 22px;">
      <tr>
        <td width="50%" style="padding:0 6px 0 0;">
          <div style="background:#fff;border:1px solid #ddd0b8;border-radius:8px;padding:10px 12px;display:flex;align-items:center;gap:8px;">
            <span style="font-size:1rem;">📚</span><span style="font-size:0.8rem;color:#4a3728;font-family:sans-serif;">Semua artikel akses khusus</span>
          </div>
        </td>
        <td width="50%" style="padding:0 0 0 6px;">
          <div style="background:#fff;border:1px solid #ddd0b8;border-radius:8px;padding:10px 12px;display:flex;align-items:center;gap:8px;">
            <span style="font-size:1rem;">💬</span><span style="font-size:0.8rem;color:#4a3728;font-family:sans-serif;">Subforum eksklusif</span>
          </div>
        </td>
      </tr>
      <tr><td colspan="2" style="height:8px;"></td></tr>
      <tr>
        <td width="50%" style="padding:0 6px 0 0;">
          <div style="background:#fff;border:1px solid #ddd0b8;border-radius:8px;padding:10px 12px;display:flex;align-items:center;gap:8px;">
            <span style="font-size:1rem;">🌐</span><span style="font-size:0.8rem;color:#4a3728;font-family:sans-serif;">Terjemahan artikel (EN)</span>
          </div>
        </td>
        <td width="50%" style="padding:0 0 0 6px;">
          <div style="background:#fff;border:1px solid #ddd0b8;border-radius:8px;padding:10px 12px;display:flex;align-items:center;gap:8px;">
            <span style="font-size:1rem;">👨‍⚕️</span><span style="font-size:0.8rem;color:#4a3728;font-family:sans-serif;">Tanya praktisi langsung</span>
          </div>
        </td>
      </tr>
    </table>
    <div style="background:rgba(201,152,58,0.08);border:1px solid rgba(201,152,58,0.25);border-radius:10px;padding:14px 18px;margin:0 0 24px;font-family:sans-serif;">
      <div style="display:flex;justify-content:space-between;margin-bottom:7px;"><span style="font-size:0.8rem;color:#8b5e3c;">Paket</span><span style="font-size:0.8rem;font-weight:600;color:#1e1410;">${safePlan}</span></div>
      <div style="display:flex;justify-content:space-between;margin-bottom:7px;"><span style="font-size:0.8rem;color:#8b5e3c;">Aktif sejak</span><span style="font-size:0.8rem;font-weight:600;color:#1e1410;">${safeStart}</span></div>
      <div style="display:flex;justify-content:space-between;"><span style="font-size:0.8rem;color:#8b5e3c;">Berlaku hingga</span><span style="font-size:0.8rem;font-weight:600;color:#4a6741;">${safeExpiry}</span></div>
    </div>
    <div style="text-align:center;margin:0 0 24px;">
      <a href="https://tcm.my.id/artikel" style="display:inline-block;background:#c9983a;color:#fff;padding:13px 34px;border-radius:8px;font-weight:600;text-decoration:none;font-size:0.92rem;font-family:sans-serif;">
        Jelajahi Konten →
      </a>
    </div>
    <hr style="border:none;border-top:1px solid #ddd0b8;margin:0 0 16px;" />
    <p style="font-size:0.75rem;color:#8b5e3c;line-height:1.6;margin:0;font-family:sans-serif;">
      Butuh bantuan? <a href="mailto:support@tcm.my.id" style="color:#4a6741;">support@tcm.my.id</a>
      atau kunjungi <a href="https://tcm.my.id/dashboard" style="color:#4a6741;">dashboard</a> Anda.
    </p>`);

  return {
    subject: `👑 Selamat, akses akun tcm.my.id Anda kini aktif!`,
    html,
  };
}

// ── 4. Notifikasi Balasan Thread ─────────────────────────────────────────────

export function balasanThreadEmail(opts: {
  recipientName: string;
  threadTitle: string;
  threadUrl: string;
  replierName: string;
  replierInitials: string;
  replierRole: string;
  replySnippet: string;
  subforumName: string;
}): { subject: string; html: string } {
  const safeRecipient  = escapeHtml(opts.recipientName);
  const safeTitle      = escapeHtml(opts.threadTitle);
  const safeUrl        = escapeHtml(opts.threadUrl);
  const safeReplier    = escapeHtml(opts.replierName);
  const safeInitials   = escapeHtml(opts.replierInitials);
  const safeRole       = escapeHtml(opts.replierRole);
  const safeSnippet    = escapeHtml(opts.replySnippet);
  const safeSubforum   = escapeHtml(opts.subforumName);
  const html = wrap(`
    <div style="margin:0 0 16px;">
      <div style="display:inline-flex;align-items:center;gap:6px;background:#d8e8cf;border-radius:999px;padding:4px 12px;">
        <span style="font-size:0.85rem;">💬</span>
        <span style="font-size:0.68rem;color:#3b5333;letter-spacing:0.08em;text-transform:uppercase;font-weight:600;font-family:sans-serif;">Balasan Baru</span>
      </div>
    </div>
    <h1 style="font-size:1.3rem;color:#1e1410;font-weight:700;margin:0 0 8px;line-height:1.4;">Ada yang membalas thread Anda</h1>
    <p style="color:#8b5e3c;font-size:0.86rem;margin:0 0 22px;font-family:sans-serif;">
      Halo <strong style="color:#1e1410;">${safeRecipient}</strong>, seseorang baru saja membalas di
      subforum <strong style="color:#4a6741;">${safeSubforum}</strong>.
    </p>
    <div style="border-left:3px solid #ddd0b8;padding-left:14px;margin:0 0 18px;">
      <p style="font-size:0.7rem;color:#8b5e3c;text-transform:uppercase;letter-spacing:0.08em;margin:0 0 4px;font-family:sans-serif;">Thread Anda:</p>
      <p style="font-size:0.9rem;font-weight:600;color:#3d2b1f;line-height:1.4;margin:0;">"${safeTitle}"</p>
    </div>
    <div style="background:#fff;border:1px solid #ddd0b8;border-radius:10px;padding:16px 18px;margin:0 0 22px;">
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px;">
        <div style="width:34px;height:34px;border-radius:50%;background:linear-gradient(135deg,#8b5e3c,#4a6741);display:flex;align-items:center;justify-content:center;color:#fff;font-weight:700;font-size:0.85rem;flex-shrink:0;font-family:sans-serif;">
          ${safeInitials}
        </div>
        <div>
          <div style="font-size:0.86rem;font-weight:600;color:#1e1410;font-family:sans-serif;">${safeReplier}</div>
          <div style="font-size:0.7rem;color:#8b5e3c;font-family:sans-serif;">${safeRole}</div>
        </div>
      </div>
      <p style="font-size:0.86rem;color:#4a3728;line-height:1.7;margin:0;">${safeSnippet}</p>
    </div>
    <div style="text-align:center;margin:0 0 24px;">
      <a href="${safeUrl}" style="display:inline-block;background:#4a6741;color:#fff;padding:12px 28px;border-radius:8px;font-weight:600;text-decoration:none;font-size:0.9rem;margin-right:10px;font-family:sans-serif;">
        Lihat Balasan →
      </a>
      <a href="https://tcm.my.id/dashboard?tab=notifikasi" style="display:inline-block;background:transparent;color:#4a6741;padding:12px 28px;border-radius:8px;font-weight:500;text-decoration:none;font-size:0.9rem;border:1px solid #ddd0b8;font-family:sans-serif;">
        Semua Notifikasi
      </a>
    </div>
    <hr style="border:none;border-top:1px solid #ddd0b8;margin:0 0 14px;" />
    <p style="font-size:0.73rem;color:#8b5e3c;line-height:1.6;margin:0;font-family:sans-serif;">
      Anda menerima email ini karena mengaktifkan notifikasi untuk thread ini.
      <a href="https://tcm.my.id/dashboard?tab=notifikasi" style="color:#4a6741;">Kelola preferensi notifikasi</a>
    </p>`);

  return {
    subject: `💬 ${safeReplier} membalas thread Anda di tcm.my.id`,
    html,
  };
}
