import { useEffect, useRef } from 'react';
import { useSession, signOut } from 'next-auth/react';
import logger from '@/lib/core/logger';
import { usePathname } from 'next/navigation';
import useGetAllSearchParams from '@/lib/core/useGetAllSearchParams';
import { buildQueryString } from '@/lib/utils';

export const useValidSession = () => {
  const { data, status, update } = useSession();
  const hasTriedUpdate = useRef(false);

  const pathname = usePathname();
  const allSearchParams = useGetAllSearchParams();

  const query = allSearchParams ? buildQueryString(allSearchParams) : null;
  const redirect = query ? `${pathname}?${query}` : pathname;
  const encodedRedirect = encodeURIComponent(redirect);

  useEffect(() => {
    if (status === 'authenticated') {
      const expiresAt = data?.user?.expiresAt;

      if (expiresAt && Date.now() > expiresAt) {
        if (!hasTriedUpdate.current) {
          hasTriedUpdate.current = true;
          logger.warn('Access token expired. Attempting update...');

          update().catch(() => {
            logger.warn('Update failed. Signing out...');
            signOut({ callbackUrl: `/auth/login?redirect=${encodedRedirect}` });
          });
        }
      }
    }
  }, [data, status]);

  return { data, status, update };
};
