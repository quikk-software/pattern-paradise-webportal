'use client';

import React, { PropsWithChildren, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Store } from '@/lib/redux/store';
import { isTokenValid, refreshAccessToken, setUserDataInReduxStore } from '@/lib/auth/auth.utils';
import {
  setAccessToken,
  setCheckAuthIsLoading,
  setRefreshToken,
} from '@/lib/features/auth/authSlice';
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

  const {
    accessToken: accessTokenFromStore,
    refreshToken: refreshTokenFromStore,
    checkAuthIsLoading,
  } = useSelector((store: Store) => store.auth);

  const checkAuth = async (
    accessTokenFromStore: string | null,
    refreshTokenFromStore: string | null,
    pathname: string,
  ) => {
    dispatch(setCheckAuthIsLoading(true));
    try {
      logger.debug(`Checking Access for <${pathname}>.`);

      const accessTokenFromCookies = cookieStore.get('accessToken') ?? null;
      const refreshTokenFromCookies = cookieStore.get('refreshToken') ?? null;

      let accessToken = null;
      let refreshToken = null;

      if (isTokenValid(accessTokenFromStore)) {
        accessToken = accessTokenFromStore;
      } else if (isTokenValid(accessTokenFromCookies)) {
        refreshToken = accessTokenFromCookies;
      }

      if (isTokenValid(refreshTokenFromStore)) {
        accessToken = refreshTokenFromStore;
      } else if (isTokenValid(refreshTokenFromCookies)) {
        refreshToken = refreshTokenFromCookies;
      }

      const query = allSearchParams ? buildQueryString(allSearchParams) : null;
      const redirect = query ? `${pathname}?${query}` : pathname;
      const encodedRedirect = query ? encodeURIComponent(`${pathname}?${query}`) : pathname;

      if (isTokenValid(accessToken)) {
        logger.debug(`Access token from store is valid.`);
        logger.debug(`Redirect user to <${pathname}>.`);

        dispatch(setAccessToken(accessToken));
        dispatch(setRefreshToken(refreshToken));

        setUserDataInReduxStore(accessToken!, dispatch);

        dispatch(setCheckAuthIsLoading(false));

        router.push(redirect);
      } else {
        logger.debug(`Access token from store is invalid. Get access token from refresh token.`);

        if (refreshToken === null || !isTokenValid(refreshToken)) {
          logger.debug(`Refresh token from store is invalid. User will be logged out...`);

          router.push(`/auth/login?redirect=${encodedRedirect}`);
        } else {
          await refreshAccessToken(refreshToken, dispatch, cookieStore);
        }
      }
    } finally {
      dispatch(setCheckAuthIsLoading(false));
    }
  };

  useEffect(() => {
    if (isTokenValid(accessTokenFromStore)) {
      setUserDataInReduxStore(accessTokenFromStore!, dispatch);
      return;
    }
    checkAuth(accessTokenFromStore, refreshTokenFromStore, pathname).finally(() =>
      dispatch(setCheckAuthIsLoading(false)),
    );
  }, [accessTokenFromStore, refreshTokenFromStore, pathname]);

  if (checkAuthIsLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <LoadingSpinnerComponent />
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthGuard;
