import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  console.log('=== Middleware headers ===');
  for (const [key, value] of req.headers.entries()) {
    console.log(`${key}: ${value}`);
  }

  // Optional: block or handle bots differently
  const ua = req.headers.get('user-agent') || '';
  const isBot = /bot|crawl|spider|chatgpt|openai/i.test(ua);
  if (isBot) {
    console.log('Bot detected:', ua);
    return NextResponse.next(); // or serve static response
  }

  return NextResponse.next();
}
