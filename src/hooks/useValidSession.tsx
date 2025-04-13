import { useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import logger from '@/lib/core/logger';
import { usePathname } from 'next/navigation';
import useGetAllSearchParams from '@/lib/core/useGetAllSearchParams';
import { buildQueryString } from '@/lib/utils';

export const useValidSession = () => {
  const { data, status, update } = useSession();

  const pathname = usePathname();
  const allSearchParams = useGetAllSearchParams();

  const query = allSearchParams ? buildQueryString(allSearchParams) : null;
  const redirect = query ? `${pathname}?${query}` : pathname;
  const encodedRedirect = encodeURIComponent(redirect);

  useEffect(() => {
    if (status === 'authenticated') {
      const expiresAt = data?.user?.expiresAt;
      if (expiresAt && Date.now() > expiresAt) {
        logger.warn('Access token expired. Update...');
        update().catch(() => {
          logger.warn('Update failed. Sign out...');
          signOut({ callbackUrl: `/auth/login?redirect=${encodedRedirect}` }).then();
        });
      }
    }
  }, [data, status]);

  return { data, status, update };
};
