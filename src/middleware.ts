import { NextRequest, NextResponse } from 'next/server';

const PUBLIC_FILE = /\.(.*)$/;

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const response = NextResponse.next();

  response.headers.set('x-current-path', pathname);

  const userAgent = request.headers.get('user-agent') || '';
  const isBot = /bot|chatgpt|googlebot|preview|crawler/i.test(userAgent);
  const isAuthRoute = pathname.startsWith('/api/auth');
  if (isBot && isAuthRoute) {
    return new NextResponse('Forbidden', { status: 403 });
  }

  if (pathname.startsWith('/api') || pathname.startsWith('/_next') || PUBLIC_FILE.test(pathname)) {
    return response;
  }

  return response;
}

export const config = {
  matcher: ['/((?!_next|favicon.ico|api).*)'],
};
