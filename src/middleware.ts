import { NextRequest, NextResponse } from 'next/server';
import { DEFAULT_LANGUAGE, LANGUAGES } from '@/i18n/i18n.constants';
import { Language } from '@/i18n/i18n.types';

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

  const pathnameParts = pathname.split('/');
  const firstPart = pathnameParts[1];
  const pathnameIsMissingLocale = !LANGUAGES.includes(firstPart as Language);

  if (pathnameIsMissingLocale) {
    const preferredLocale = request.headers.get('accept-language')?.split(',')[0].split('-')[0];
    const locale = LANGUAGES.includes(preferredLocale as Language)
      ? preferredLocale
      : DEFAULT_LANGUAGE;

    const url = request.nextUrl.clone();
    url.pathname = `/${locale}${pathname === '/' ? '' : pathname}`;

    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: ['/((?!_next|favicon.ico|api).*)'],
};
