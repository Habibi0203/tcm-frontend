import { NextRequest, NextResponse } from 'next/server';

const SHORT_LINKS: Record<string, string> = {
  diskusi_tcm: 'https://t.me/diskusi_tcm',
  ilmu_akupuntur: 'https://t.me/ilmuakupuntur/803',
  wa_channel: 'https://whatsapp.com/channel/0029VaQNL9C05MUjpTqT9G0D',
};

type RouteContext = {
  params: Promise<{ slug: string }>;
};

export async function GET(_request: NextRequest, context: RouteContext) {
  const { slug } = await context.params;
  const target = SHORT_LINKS[slug];

  if (!target) {
    return NextResponse.json({ error: 'Short link not found' }, { status: 404 });
  }

  return NextResponse.redirect(target, { status: 302 });
}
