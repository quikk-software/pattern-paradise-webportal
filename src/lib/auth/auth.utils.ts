import axios from 'axios';
import logger from '@/lib/core/logger';
import { getSession, signOut } from 'next-auth/react';
import { Session } from 'next-auth';

const handleLogoutFlow = async (refreshToken: string) => {
  const response = await axios.post('/api/logout', { refreshToken });

  if (response.status !== 200) {
    console.error('Failed to revoke token');
    return;
  }

  await signOut({ redirect: false });
  logger.log('User logged out successfully');
};

async function getAccessToken(session: Session | null) {
  if (!session || !session.user.accessToken) {
    return;
  }

  logger.log('Check if session is expired: ', session.user.expiresAt);
  const isExpired =
    session.user.expiresAt && Date.now() > new Date(session.user.expiresAt).getTime();
  logger.log('Session is expired: ', isExpired);

  if (isExpired) {
    logger.log('Get session');

    const updatedSession = await getSession();

    logger.log('Got updated session data');

    if (!updatedSession || !updatedSession.user.accessToken) {
      return;
    }

    return updatedSession.user.accessToken;
  }

  return session.user.accessToken;
}

async function getAccessTokenFromKeycloak() {
  const response = await fetch(`${process.env.KEYCLOAK_BASE_URL}/protocol/openid-connect/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: process.env.KEYCLOAK_CLIENT_ID!,
      client_secret: process.env.KEYCLOAK_CLIENT_SECRET!,
      grant_type: 'password',
      username: process.env.KEYCLOAK_SERVICE_ACCOUNT_USERNAME!,
      password: process.env.KEYCLOAK_SERVICE_ACCOUNT_PASSWORD!,
      scope: 'openid profile email offline_access',
    }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(`Failed to get token: ${data.error_description || data.error}`);
  }

  return data.access_token as string;
}

export { handleLogoutFlow, getAccessToken, getAccessTokenFromKeycloak };
