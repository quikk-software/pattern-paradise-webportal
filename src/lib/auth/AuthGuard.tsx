'use client';

import React, { PropsWithChildren, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Store } from '@/lib/redux/store';
import {
  getAccessTokenUsingRefreshToken,
  isTokenValid,
  saveTokensToCookies,
  setUserDataInReduxStore,
} from '@/lib/auth/auth.utils';
import { setAccessToken, setRefreshToken } from '@/lib/features/auth/authSlice';
import logger from '@/lib/core/logger';
import { usePathname, useRouter } from 'next/navigation';
import useRedirect from '@/lib/core/useRedirect';
import { hasPageBeenMounted, isPathnameInPages } from '@/lib/core/utils';
import useAuth from '@/lib/auth/useAuth';
import pages from '@/lib/hooks/routes';
import { LoadingSpinnerComponent } from '@/components/loading-spinner';
import Cookie from 'js-cookie';
import { buildQueryString } from '@/lib/utils';
import useGetAllSearchParams from '@/lib/core/useGetAllSearchParams';

const AuthGuard: React.FunctionComponent<PropsWithChildren<Record<never, any>>> = ({
  children,
}) => {
  const dispatch = useDispatch();
  const pathname = usePathname();
  const router = useRouter();
  const { redirectUrl } = useRedirect();
  const allSearchParams = useGetAllSearchParams();
  const { isLoggedIn } = useAuth();

  const pageMounted = hasPageBeenMounted();

  const { accessToken: accessTokenFromStore, refreshToken: refreshTokenFromStore } = useSelector(
    (store: Store) => store.auth,
  );

  const onTokenValid = (accessToken: string | null) => {
    if (accessToken !== null) {
      // redirect to redirect URL if not already on a valid page
      if (
        !isPathnameInPages(
          pathname,
          pages.map((page) => page.pathname),
        )
      ) {
        router.push(redirectUrl);
      }
    }
  };

  const checkAuth = (accessToken: string | null, refreshToken: string | null) => {
    if (isLoggedIn) {
      return;
    }

    logger.debug(`Checking Access for <${pathname}>.`);
    const at = accessToken ? accessToken : Cookie.get('accessToken') ?? null;
    const rt = refreshToken ? refreshToken : Cookie.get('refreshToken') ?? null;
    if (isTokenValid(at)) {
      onTokenValid(at);
      dispatch(setAccessToken(at));
      dispatch(setRefreshToken(rt));
      return;
    }
    (async () => {
      if (rt === null) {
        return;
      }
      const res = await getAccessTokenUsingRefreshToken(rt);
      if (res?.data !== undefined && 'access_token' in res.data && 'refresh_token' in res.data) {
        const newAccessToken: string = (res.data.access_token as string) ?? '';
        const newRefreshToken: string = (res.data.refresh_token as string) ?? '';
        await saveTokensToCookies(newAccessToken, newRefreshToken);
        dispatch(setAccessToken(newAccessToken));
        dispatch(setRefreshToken(newRefreshToken));
        setUserDataInReduxStore(newAccessToken, dispatch);
        return;
      }
    })();
  };

  useEffect(() => {
    dispatch(setAccessToken(Cookie.get('accessToken') ?? null));
    dispatch(setRefreshToken(Cookie.get('refreshToken') ?? null));
  }, []);

  useEffect(() => {
    checkAuth(accessTokenFromStore, refreshTokenFromStore);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessTokenFromStore, refreshTokenFromStore]);

  useEffect(() => {
    if (isLoggedIn === false && pageMounted) {
      const query = allSearchParams ? buildQueryString(allSearchParams) : null;
      const encodedRedirect = query ? encodeURIComponent(`${pathname}?${query}`) : pathname;
      router.push(`/auth/login?redirect=${encodedRedirect}`);
    }
  }, [isLoggedIn, pageMounted, pathname, allSearchParams]);

  if (isLoggedIn) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen flex justify-center items-center">
      <LoadingSpinnerComponent />
    </div>
  );
};

export default AuthGuard;
