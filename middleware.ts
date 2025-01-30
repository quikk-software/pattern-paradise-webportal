import { NextRequest, NextResponse } from 'next/server';
import { COOKIE_CONSENT_NAME } from '@/lib/constants';

export function middleware(req: NextRequest) {
  const consentGiven = req.cookies.get(COOKIE_CONSENT_NAME)?.value;

  if (consentGiven !== 'true') {
    const requestHeaders = new Headers(req.headers);
    requestHeaders.set('x-vercel-no-analytics', '1');

    return NextResponse.next({
      headers: requestHeaders,
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/:path*',
};
