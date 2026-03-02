import { useRef, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import logger from '@/lib/core/logger';
import { usePathname } from 'next/navigation';
import useGetAllSearchParams from '@/lib/core/useGetAllSearchParams';
import { buildQueryString } from '@/lib/utils';

const SESSION_ERRORS = ['RefreshAccessTokenError', 'InvalidSessionError', 'UserLookupFailed'];

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
    if (hasSignedOut.current) return;

    const sessionError = (data as any)?.error;

    if (status === 'authenticated' && sessionError && SESSION_ERRORS.includes(sessionError)) {
      logger.warn(`Session error detected: ${sessionError}. Signing out...`);
      hasSignedOut.current = true;
      signOut({ callbackUrl: `/auth/login?redirect=${encodedRedirect}` });
      return;
    }

    if (status === 'authenticated') {
      const expiresAt = data?.user?.expiresAt;

      if (expiresAt && Date.now() > expiresAt) {
        if (lastCheckedExpiresAt.current !== expiresAt) {
          lastCheckedExpiresAt.current = expiresAt;
          logger.warn('Access token expired. Attempting update...');

          update()
            .then((result) => {
              const error = (result as any)?.error;
              if (error && SESSION_ERRORS.includes(error)) {
                logger.warn(`Session update returned error: ${error}. Signing out...`);
                hasSignedOut.current = true;
                signOut({ callbackUrl: `/auth/login?redirect=${encodedRedirect}` });
              }
            })
            .catch(() => {
              logger.warn('Update failed. Signing out...');
              hasSignedOut.current = true;
              signOut({ callbackUrl: `/auth/login?redirect=${encodedRedirect}` });
            });
        }
      }
    }
  }, [data, status]);

  return { data, status, update };
};
