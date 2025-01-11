'use server';

import { PropsWithChildren } from 'react';
import { getCookies } from 'next-client-cookies/server';
import { getAccessTokenUsingRefreshToken, isTokenValid } from '@/lib/auth/auth.utils';

export default async function CookieWrapper({ children }: PropsWithChildren) {
  const cookieStore = await getCookies();
  const accessToken = cookieStore.get('accessToken');
  const refreshToken = cookieStore.get('refreshToken');

  if (!accessToken || !isTokenValid(accessToken)) {
    if (refreshToken && isTokenValid(refreshToken)) {
      await getAccessTokenUsingRefreshToken(refreshToken, cookieStore);
    }
  }

  return <>{children}</>;
}
