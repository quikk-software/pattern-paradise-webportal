import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const { access_token, refresh_token } = await request.json();

  if (!access_token || !refresh_token) {
    return NextResponse.json({ success: false, message: 'Missing tokens' }, { status: 400 });
  }

  const res = NextResponse.json({ success: true });

  res.cookies.set('accessToken', access_token, {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 60 * 15, // 15 minutes
  });

  res.cookies.set('refreshToken', refresh_token, {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 60 * 60 * 24 * 7 * 2, // 2 weeks
  });

  return res;
}
