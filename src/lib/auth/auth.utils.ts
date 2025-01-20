import axios from 'axios';
import logger from '@/lib/core/logger';
import { signOut } from 'next-auth/react';

const handleLogoutFlow = async (refreshToken: string) => {
  const response = await axios.post('/api/logout', { refreshToken });

  if (response.status !== 200) {
    console.error('Failed to revoke token');
    return;
  }

  await signOut({ redirect: false });
  logger.log('User logged out successfully');
};

export { handleLogoutFlow };
