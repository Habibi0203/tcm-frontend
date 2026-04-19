/**
 * Brevo (ex-Sendinblue) transactional email client
 * Docs: https://developers.brevo.com/reference/sendtransacemail
 */

const BREVO_API_URL = "https://api.brevo.com/v3/smtp/email";

export interface SendEmailOptions {
  to: { email: string; name?: string }[];
  subject: string;
  htmlContent: string;
  replyTo?: { email: string; name?: string };
}

export interface BrevoResponse {
  ok: boolean;
  messageId?: string;
  error?: string;
  status?: number;
}

export async function sendEmail(opts: SendEmailOptions): Promise<BrevoResponse> {
  const apiKey  = process.env.BREVO_API_KEY;
  const senderEmail = process.env.BREVO_SENDER_EMAIL;
  const senderName  = process.env.BREVO_SENDER_NAME;

  if (!apiKey || !senderEmail) {
    return { ok: false, error: "BREVO_API_KEY or BREVO_SENDER_EMAIL not set" };
  }

  const body = {
    sender: { email: senderEmail, name: senderName ?? "tcm.my.id" },
    to: opts.to,
    subject: opts.subject,
    htmlContent: opts.htmlContent,
    ...(opts.replyTo ? { replyTo: opts.replyTo } : {}),
  };

  try {
    const res = await fetch(BREVO_API_URL, {
      method: "POST",
      headers: {
        "api-key": apiKey,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      const data = await res.json();
      return { ok: true, messageId: data.messageId };
    }

    const err = await res.text();
    return { ok: false, status: res.status, error: err };
  } catch (e) {
    return { ok: false, error: String(e) };
  }
}
