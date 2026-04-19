import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/lib/brevo";
import {
  welcomeEmail,
  resetPasswordEmail,
  premiumAktifEmail,
  balasanThreadEmail,
} from "@/lib/email-templates";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body || !body.template || !body.to) {
    return NextResponse.json({ error: "Missing template or to" }, { status: 400 });
  }

  const { template, to, data = {} } = body as {
    template: string;
    to: { email: string; name?: string };
    data: Record<string, string>;
  };

  let subject: string;
  let html: string;

  switch (template) {
    case "selamat-datang": {
      const tpl = welcomeEmail({ name: data.name ?? to.name ?? "Member" });
      subject = tpl.subject;
      html    = tpl.html;
      break;
    }
    case "reset-password": {
      if (!data.resetUrl) return NextResponse.json({ error: "Missing data.resetUrl" }, { status: 400 });
      const tpl = resetPasswordEmail({ name: data.name ?? to.name ?? "Member", resetUrl: data.resetUrl });
      subject = tpl.subject;
      html    = tpl.html;
      break;
    }
    case "premium-aktif": {
      const tpl = premiumAktifEmail({
        name:       data.name       ?? to.name ?? "Member",
        plan:       data.plan       ?? "Premium Tahunan",
        startDate:  data.startDate  ?? new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }),
        expiryDate: data.expiryDate ?? "—",
      });
      subject = tpl.subject;
      html    = tpl.html;
      break;
    }
    case "balasan-thread": {
      const tpl = balasanThreadEmail({
        recipientName:  data.recipientName  ?? to.name ?? "Member",
        threadTitle:    data.threadTitle    ?? "Thread Anda",
        threadUrl:      data.threadUrl      ?? "https://tcm.my.id/forum",
        replierName:    data.replierName    ?? "Member TCM",
        replierInitials:data.replierInitials?? "M",
        replierRole:    data.replierRole    ?? "Member",
        replySnippet:   data.replySnippet   ?? "Ada balasan baru untuk thread Anda.",
        subforumName:   data.subforumName   ?? "Forum",
      });
      subject = tpl.subject;
      html    = tpl.html;
      break;
    }
    default:
      return NextResponse.json({ error: `Unknown template: ${template}` }, { status: 400 });
  }

  const result = await sendEmail({ to: [to], subject, htmlContent: html });

  if (!result.ok) {
    console.error("[brevo] send error:", result.error);
    return NextResponse.json({ error: result.error, status: result.status }, { status: 500 });
  }

  return NextResponse.json({ ok: true, messageId: result.messageId });
}
