import axios from 'axios';
import logger from '@/lib/core/logger';
import { getSession, signIn, signOut } from 'next-auth/react';
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
    throw new Error('No session or access token available');
  }

  logger.log('Check if session is expired: ', session.user.expiresAt);
  const isExpired =
    session.user.expiresAt && Date.now() > new Date(session.user.expiresAt).getTime();
  logger.log('Session is expired: ', isExpired);

  if (isExpired) {
    logger.log('Try to sign in');
    await signIn('credentials', { redirect: false });

    const updatedSession = await getSession();

    logger.log('Got updated session data');

    if (!updatedSession || !updatedSession.user.accessToken) {
      throw new Error('Failed to refresh access token');
    }

    return updatedSession.user.accessToken;
  }

  return session.user.accessToken;
}

export { handleLogoutFlow, getAccessToken };
