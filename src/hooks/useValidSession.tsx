import { useRef, useEffect } from 'react';
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

  const lastCheckedExpiresAt = useRef<number | null>(null);
  const hasSignedOut = useRef(false);

  useEffect(() => {
    if (status === 'authenticated') {
      const expiresAt = data?.user?.expiresAt;

      if (expiresAt && Date.now() > expiresAt) {
        if (lastCheckedExpiresAt.current !== expiresAt && !hasSignedOut.current) {
          lastCheckedExpiresAt.current = expiresAt;
          logger.warn('Access token expired. Attempting update...');

          update()
            .then((result) => {
              if (result?.error === 'RefreshAccessTokenError') {
                logger.warn('Refreshing access token failed. Signing out...');
                hasSignedOut.current = true;
                signOut({ callbackUrl: `/auth/login?redirect=${encodedRedirect}` }).then();
              }
            })
            .catch(() => {
              logger.warn('Update failed. Signing out...');
              hasSignedOut.current = true;
              signOut({ callbackUrl: `/auth/login?redirect=${encodedRedirect}` }).then();
            });
        }
      }
    }
  }, [data?.user?.expiresAt, status]);

  return { data, status, update };
};
