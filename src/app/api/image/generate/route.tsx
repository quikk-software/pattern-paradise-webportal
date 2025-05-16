import puppeteer from 'puppeteer';
import { NextRequest } from 'next/server';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  const { id, theme = 'neutral' } = await req.json();

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1080, height: 1920 });

  const baseUrl = process.env.NEXT_PUBLIC_URL || 'https://pattern-paradise.shop';
  const url = `${baseUrl}/app/tester-calls/preview/${id}?theme=${theme}&preview=true`;

  await page.goto(url, { waitUntil: 'networkidle0' });

  const buffer = await page.screenshot({ type: 'png' });

  await browser.close();

  return new Response(buffer, {
    headers: {
      'Content-Type': 'image/png',
      'Content-Disposition': 'attachment; filename="tester-call.png"',
    },
  });
}
