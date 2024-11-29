import { Api } from './api-types';
import {
  getAccessTokenUsingRefreshToken,
  isTokenExpired,
  saveTokensToCookies,
} from '@/lib/auth/auth.utils';
import type { Dispatch, AnyAction } from 'redux';
import { setAccessToken, setPassword, setRefreshToken } from '@/lib/features/auth/authSlice';
import Cookie from 'js-cookie';

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
  _navigation?: any,
) => {
  if (accessToken === null || refreshToken === null) {
    return {
      headers: undefined,
    };
  }
  const headers: Record<any, any> = {
    headers: undefined,
  };
  const at = accessToken ? accessToken : (Cookie.get('accessToken') ?? null);
  const rt = refreshToken ? refreshToken : (Cookie.get('refreshToken') ?? null);
  if (at !== '') {
    headers.Authorization = `Bearer ${at}`;
  }
  const params = { headers };
  if (at !== null && rt !== null && isTokenExpired(at)) {
    const res = await getAccessTokenUsingRefreshToken(rt, () => {
      dispatch(setPassword(''));
      dispatch(setAccessToken(null));
      dispatch(setRefreshToken(null));
    });
    if (res?.data !== undefined && 'access_token' in res.data && 'refresh_token' in res.data) {
      const newAccessToken: string = (res.data.access_token as string) ?? '';
      const newRefreshToken: string = (res.data.refresh_token as string) ?? '';
      params.headers.Authorization = `Bearer ${newAccessToken}`;
      dispatch(setAccessToken(newAccessToken));
      dispatch(setRefreshToken(newRefreshToken));
      await saveTokensToCookies(newAccessToken, newRefreshToken);
    }
  }
  return params;
};

export { client, getApi };
