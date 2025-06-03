import { NextRequest, NextResponse } from 'next/server';

import createIntlMiddleware from 'next-intl/middleware';
import { routing } from '@/i18n/routing';

const intlMiddleware = createIntlMiddleware(routing);

const PUBLIC_FILE = /\.(.*)$/;

export async function middleware(request: NextRequest) {
  let response = intlMiddleware(request);

  if ((await response).status !== 200) {
    return response;
  }

  response = await response;
  const { pathname } = request.nextUrl;

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
  matcher: '/((?!api|trpc|_next|favicon.ico|_vercel|.*\\..*).*)',
};
