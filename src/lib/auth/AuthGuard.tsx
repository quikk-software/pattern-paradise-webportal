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
  const allSearchParams = useGetAllSearchParams();

  const {
    accessToken: accessTokenFromStore,
    refreshToken: refreshTokenFromStore,
    checkAuthIsLoading,
  } = useSelector((store: Store) => store.auth);

  const checkAuth = async (
    accessToken: string | null,
    refreshToken: string | null,
    pathname: string,
  ) => {
    dispatch(setCheckAuthIsLoading(true));
    try {
      logger.debug(`Checking Access for <${pathname}>.`);

      if (isTokenValid(accessToken)) {
        logger.debug(`Access token from store is valid.`);
        logger.debug(`Redirect user to <${pathname}>.`);

        dispatch(setAccessToken(accessToken));
        dispatch(setRefreshToken(refreshToken));
        setUserDataInReduxStore(accessToken!, dispatch);
        router.push(pathname);
      } else {
        logger.debug(`Access token from store is invalid. Get access token from refresh token.`);

        if (refreshToken === null || !isTokenValid(refreshToken)) {
          logger.debug(`Refresh token from store is invalid. User will be logged out...`);

          const query = allSearchParams ? buildQueryString(allSearchParams) : null;
          const encodedRedirect = query ? encodeURIComponent(`${pathname}?${query}`) : pathname;
          router.push(`/auth/login?redirect=${encodedRedirect}`);
        } else {
          await refreshAccessToken(refreshToken, dispatch);
        }
      }
    } finally {
      dispatch(setCheckAuthIsLoading(false));
    }
  };

  useEffect(() => {
    checkAuth(accessTokenFromStore, refreshTokenFromStore, pathname);
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
