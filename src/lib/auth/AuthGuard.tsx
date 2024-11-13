'use client';

import React, { PropsWithChildren, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Store } from '@/lib/redux/store';
import {
  getAccessTokenUsingRefreshToken,
  isTokenValid,
  saveTokensToCookies,
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

const PUBLIC_URLS = [
  '/',
  '/auth/login',
  '/auth/reset-password',
  '/auth/registration',
  '/products',
  '/test/products/[productId]',
];

const isPublicUrl = (url: string) => {
  const isPublic = isPathnameInPages(url, PUBLIC_URLS);
  logger.debug(`${isPublic}: ${url}`);
  return isPublic;
};

const AuthGuard: React.FunctionComponent<PropsWithChildren<Record<never, any>>> = ({
  children,
}) => {
  const dispatch = useDispatch();
  const pathname = usePathname();
  const router = useRouter();
  const { redirectUrl } = useRedirect();
  const { setUserDataInReduxStore, isLoggedIn } = useAuth();

  const isAccessibleWithoutAccount = isPublicUrl(pathname);
  const pageMounted = hasPageBeenMounted();

  const { accessToken: accessTokenFromStore, refreshToken: refreshTokenFromStore } = useSelector(
    (store: Store) => store.auth,
  );

  const onTokenValid = (accessToken: string | null) => {
    if (accessToken !== null) {
      setUserDataInReduxStore(accessToken);

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
    if (isLoggedIn || isAccessibleWithoutAccount) {
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
        return;
      }
    })();
  };

  useEffect(() => {
    checkAuth(accessTokenFromStore, refreshTokenFromStore);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessTokenFromStore, refreshTokenFromStore]);

  useEffect(() => {
    if (isLoggedIn === false && pageMounted && !isPublicUrl(pathname)) {
      router.push(`/auth/login?redirect=${pathname}`);
    }
  }, [isLoggedIn, pageMounted, pathname]);

  if (isLoggedIn || isAccessibleWithoutAccount) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen flex justify-center items-center">
      <LoadingSpinnerComponent />
    </div>
  );
};

export default AuthGuard;
