import { useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import logger from '@/lib/core/logger';

export const useValidSession = () => {
  const { data, status, update } = useSession();

  useEffect(() => {
    if (status === 'authenticated') {
      const expiresAt = data?.user?.expiresAt;
      if (expiresAt && Date.now() > expiresAt) {
        logger.warn('Access token expired. Signing out...');
        signOut({ callbackUrl: '/auth/login' });
      }
    }
  }, [data, status]);

  return { data, status, update };
};
