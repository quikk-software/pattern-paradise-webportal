'use client';

import { PropsWithChildren, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setAccessToken, setRefreshToken } from '@/lib/features/auth/authSlice';
import { setUserDataInReduxStore } from '@/lib/auth/auth.utils';
import { useCookies } from 'next-client-cookies';

export default function TokenWrapper({ children }: PropsWithChildren) {
  const dispatch = useDispatch();
  const cookieStore = useCookies();

  useEffect(() => {
    const accessToken = cookieStore.get('accessToken');
    const refreshToken = cookieStore.get('refreshToken');

    dispatch(setAccessToken(accessToken || null));
    dispatch(setRefreshToken(refreshToken || null));
    if (!!accessToken) {
      setUserDataInReduxStore(accessToken, dispatch);
    }
  }, []);

  return <>{children}</>;
}
