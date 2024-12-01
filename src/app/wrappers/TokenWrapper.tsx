'use client';

import { PropsWithChildren, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setAccessToken, setRefreshToken } from '@/lib/features/auth/authSlice';

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

    console.log({ accessToken, refreshToken });

    dispatch(setAccessToken(accessToken || null));
    dispatch(setRefreshToken(refreshToken || null));
  }, [dispatch]);

  return <>{children}</>;
}
