import { Api } from './api-types';
import { getAccessTokenUsingRefreshToken, isTokenValid } from '@/lib/auth/auth.utils';
import type { Dispatch, AnyAction } from 'redux';
import { logout } from '@/lib/features/auth/authSlice';
import { Cookies } from 'next-client-cookies';

const client = new Api({
  baseUrl: process.env.NEXT_PUBLIC_API_URL,
  baseApiParams: {
    mode: 'cors',
  },
});

const getApi = async (
  accessToken: string | null,
  refreshToken: string | null,
  dispatch: Dispatch<AnyAction>,
  cookieStore: Cookies,
  _navigation?: any,
) => {
  const headers: Record<any, any> = {
    headers: undefined,
  };

  const isAccessTokenValid = isTokenValid(accessToken);

  if (isAccessTokenValid) {
    headers.Authorization = `Bearer ${accessToken}`;
    return { headers };
  } else {
    const isRefreshTokenValid = isTokenValid(refreshToken);

    if (isRefreshTokenValid) {
      const newAccessToken = await getAccessTokenUsingRefreshToken(
        refreshToken,
        cookieStore,
        dispatch,
        () => {
          dispatch(logout());
        },
      );
      headers.Authorization = `Bearer ${newAccessToken}`;
      return { headers };
    }
  }
  return { headers };
};

export { client, getApi };
