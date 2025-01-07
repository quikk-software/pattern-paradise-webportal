'use client';

import { PropsWithChildren, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setAccessToken, setRefreshToken } from '@/lib/features/auth/authSlice';
import { setUserDataInReduxStore } from '@/lib/auth/auth.utils';

export default function TokenWrapper({ children }: PropsWithChildren) {
  const dispatch = useDispatch();

  useEffect(() => {
    const accessToken = document.cookie
      .split('; ')
      .find((row) => row.startsWith('accessToken='))
      ?.split('=')[1];
    const refreshToken = document.cookie
      .split('; ')
      .find((row) => row.startsWith('refreshToken='))
      ?.split('=')[1];

    dispatch(setAccessToken(accessToken || null));
    dispatch(setRefreshToken(refreshToken || null));
    if (!!accessToken) {
      setUserDataInReduxStore(accessToken, dispatch);
    }
  }, []);

  return <>{children}</>;
}
