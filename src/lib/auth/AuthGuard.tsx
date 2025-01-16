'use client';

import React, { PropsWithChildren, useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Store } from '@/lib/redux/store';
import { isTokenValid, refreshAccessToken, setUserDataInReduxStore } from '@/lib/auth/auth.utils';
import { setAccessToken, setRefreshToken } from '@/lib/features/auth/authSlice';
import logger from '@/lib/core/logger';
import { useCookies } from 'next-client-cookies';
import { usePathname, useRouter } from 'next/navigation';
import { LoadingSpinnerComponent } from '@/components/loading-spinner';
import { buildQueryString } from '@/lib/utils';
import useGetAllSearchParams from '@/lib/core/useGetAllSearchParams';

const AuthGuard: React.FunctionComponent<PropsWithChildren<Record<never, any>>> = ({
  children,
}) => {
  const dispatch = useDispatch();
  const pathname = usePathname();
  const router = useRouter();
  const cookieStore = useCookies();
  const allSearchParams = useGetAllSearchParams();

  const [isLoading, setIsLoading] = useState(true);

  const { accessToken: accessTokenFromStore, refreshToken: refreshTokenFromStore } = useSelector(
    (store: Store) => store.auth,
  );

  const checkAuth = useCallback(async () => {
    try {
      logger.debug(`Token check not running`);

      logger.debug(`Checking Access for <${pathname}>.`);

      const accessTokenFromCookies = cookieStore.get('accessToken') ?? null;
      const refreshTokenFromCookies = cookieStore.get('refreshToken') ?? null;

      let accessToken = accessTokenFromStore || accessTokenFromCookies;
      let refreshToken = refreshTokenFromStore || refreshTokenFromCookies;

      const query = allSearchParams ? buildQueryString(allSearchParams) : null;
      const redirect = query ? `${pathname}?${query}` : pathname;
      const encodedRedirect = encodeURIComponent(redirect);

      if (isTokenValid(accessToken)) {
        logger.debug('Access token is valid.');
        dispatch(setAccessToken(accessToken));
        dispatch(setRefreshToken(refreshToken));
        setUserDataInReduxStore(accessToken!, dispatch);
        router.push(redirect);
      } else if (isTokenValid(refreshToken)) {
        logger.debug('Access token is invalid. Attempting to refresh.');
        await refreshAccessToken(refreshToken, dispatch, cookieStore);
      } else {
        logger.debug('Both tokens are invalid. Redirecting to login.');
        router.push(`/auth/login?redirect=${encodedRedirect}`);
      }
    } finally {
      setIsLoading(false);
    }
  }, [
    pathname,
    allSearchParams,
    dispatch,
    router,
    cookieStore,
    accessTokenFromStore,
    refreshTokenFromStore,
  ]);

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    const accessTokenFromCookies = cookieStore.get('accessToken') ?? null;
    const refreshTokenFromCookies = cookieStore.get('refreshToken') ?? null;

    if (
      isTokenValid(accessTokenFromStore) ||
      isTokenValid(refreshTokenFromStore) ||
      isTokenValid(accessTokenFromCookies) ||
      isTokenValid(refreshTokenFromCookies)
    ) {
      return;
    }

    const query = allSearchParams ? buildQueryString(allSearchParams) : null;
    const redirect = query ? `${pathname}?${query}` : pathname;
    const encodedRedirect = encodeURIComponent(redirect);

    router.push(`/auth/login?redirect=${encodedRedirect}`);
  }, [accessTokenFromStore, refreshTokenFromStore, cookieStore, allSearchParams, pathname]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <LoadingSpinnerComponent />
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthGuard;
