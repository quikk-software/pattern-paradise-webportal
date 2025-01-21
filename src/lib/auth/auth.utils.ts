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

  const isExpired = session.expires && Date.now() > new Date(session.expires).getTime();

  if (isExpired) {
    await signIn('credentials', { redirect: false });

    const updatedSession = await getSession();

    if (!updatedSession || !updatedSession.user.accessToken) {
      throw new Error('Failed to refresh access token');
    }

    return updatedSession.user.accessToken;
  }

  return session.user.accessToken;
}

export { handleLogoutFlow, getAccessToken };
