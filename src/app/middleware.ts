import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const userAgent = request.headers.get('user-agent') || '';
  const isBot = /bot|chatgpt|googlebot|preview|crawler/i.test(userAgent);
  const isAuthRoute = request.nextUrl.pathname.startsWith('/api/auth');

  if (isBot && isAuthRoute) {
    return new NextResponse('Forbidden', { status: 403 });
  }

  return NextResponse.next();
}
