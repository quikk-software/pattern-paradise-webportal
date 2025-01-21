import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { refreshToken } = body;

    if (!refreshToken) {
      return NextResponse.json({ error: 'Refresh token is required' }, { status: 400 });
    }

    const response = await fetch(
      `${process.env.KEYCLOAK_BASE_URL}/protocol/openid-connect/revoke`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: process.env.KEYCLOAK_CLIENT_ID!,
          client_secret: process.env.KEYCLOAK_CLIENT_SECRET!,
          token: refreshToken,
        }),
      },
    );

    if (!response.ok) {
      const error = await response.text();
      return NextResponse.json(
        { error: `Failed to revoke token: ${error}` },
        { status: response.status },
      );
    }

    return NextResponse.json({ message: 'Logout successful' });
  } catch (error) {
    console.error('Error during token revocation:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
