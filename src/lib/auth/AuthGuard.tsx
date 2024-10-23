'use client';

import React, { PropsWithChildren, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Store } from '@/lib/redux/store';
import { getAccessTokenUsingRefreshToken, isTokenValid } from '@/lib/auth/auth.utils';
import { setAccessToken, setRefreshToken } from '@/lib/features/auth/authSlice';
import logger from '@/lib/core/logger';
import { usePathname, useRouter } from 'next/navigation';
import useRedirect from '@/lib/core/useRedirect';
import { hasPageBeenMounted } from '@/lib/core/utils';
import useAuth from '@/lib/auth/useAuth';
import pages from '@/lib/hooks/routes';
import { LoadingSpinnerComponent } from '@/components/loading-spinner';

const PUBLIC_URLS = [
  '/',
  '/auth/login',
  '/auth/reset-password',
  '/auth/registration',
  '/products',
  '/products/*',
];

function patternToRegex(pattern: string): RegExp {
  // Escape special characters and replace '*' with a regex that matches any characters after the base path
  const regexString = pattern.replace(/[-/\\^$+?.()|[\]{}]/g, '\\$&').replace(/\*/g, '.*');
  return new RegExp(`^${regexString}$`);
}

const isPublicUrl = (url: string) => {
  const isPublic = PUBLIC_URLS.some((pattern) => patternToRegex(pattern).test(url));
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

  const [showLoadingScreen, setShowLoadingScreen] = useState(!isLoggedIn);

  const isAccessibleWithoutAccount = isPublicUrl(pathname);

  const { accessToken, refreshToken } = useSelector((store: Store) => store.auth);

  const onTokenValid = () => {
    if (accessToken !== null) {
      setUserDataInReduxStore(accessToken);
      // redirect to redirect URL if not already on a valid page
      if (!pages.map(({ pathname }) => pathname).includes(pathname)) {
        router.push(redirectUrl);
      }
    }
  };

  const checkAuth = () => {
    if (isLoggedIn || isAccessibleWithoutAccount) {
      return;
    }

    logger.debug(`Checking Access for <${pathname}>.`);
    if (isTokenValid(accessToken)) {
      onTokenValid();
      return;
    }
    (async () => {
      if (refreshToken === null) {
        return;
      }
      const res = await getAccessTokenUsingRefreshToken(refreshToken);
      if (res?.data !== undefined && 'access_token' in res.data && 'refresh_token' in res.data) {
        const newAccessToken: string = (res.data.access_token as string) ?? '';
        const newRefreshToken: string = (res.data.refresh_token as string) ?? '';
        dispatch(setAccessToken(newAccessToken));
        dispatch(setRefreshToken(newRefreshToken));
        return;
      }
    })();
  };

  /**
   * Taken from https://jasonwatmore.com/post/2021/08/30/next-js-redirect-to-login-page-if-unauthenticated
   */
  useEffect(() => {
    checkAuth();

    if (!isLoggedIn && hasPageBeenMounted() && !isPublicUrl(pathname)) {
      router.push(`/auth/login?redirect=${pathname}`);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, isLoggedIn]);

  useEffect(() => {
    setShowLoadingScreen(true);
    if (isTokenValid(accessToken)) {
      onTokenValid();
    }
    setShowLoadingScreen(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, accessToken]);

  useEffect(() => {
    setTimeout(() => setShowLoadingScreen(false), 1000);
  });

  if (!showLoadingScreen || isAccessibleWithoutAccount) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen flex justify-center items-center">
      <LoadingSpinnerComponent />
    </div>
  );
};

export default AuthGuard;
