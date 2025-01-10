import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import qs from 'qs';
import logger from '@/lib/core/logger';
import {
  setAccessToken,
  setPassword,
  setRefreshToken,
  setRoles,
  setUserId,
} from '@/lib/features/auth/authSlice';
import { Cookies } from 'next-client-cookies';
import { AnyAction, Dispatch } from 'redux';

/**
 * Function returns the user ID inside of an access token.
 * @param accessToken
 */
const getUserIdFromAccessToken = (accessToken: string) => {
  const decoded: any = jwtDecode(accessToken);
  return decoded.refId ?? '';
};

/**
 * Function checks, if a token is expired
 * @param token
 */
const isTokenExpired = (token: string) => {
  const decoded: any = jwtDecode(token);

  if (decoded.exp < Date.now() / 1000) {
    return true;
  } else {
    return false;
  }
};

/**
 * Function returns an access token based on a given refresh token.
 @param refreshToken
 @param callback
 **/
const getAccessTokenUsingRefreshToken = async (
  refreshToken: string | null,
  cookieStore: Cookies,
  dispatch?: Dispatch<any>,
  callback?: () => void,
) => {
  if (refreshToken === '' || refreshToken === null) {
    return undefined;
  }
  try {
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_KEYCLOAK_BASE_URL}/realms/${process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID}/protocol/openid-connect/token`,
      qs.stringify({
        grant_type: 'refresh_token',
        client_id: process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID,
        refresh_token: refreshToken,
        scope: 'openid profile',
      }),
    );
    if (res?.data !== undefined && 'access_token' in res.data && 'refresh_token' in res.data) {
      const newAccessToken: string | null = res.data.access_token ?? null;
      const newRefreshToken: string | null = res.data.refresh_token ?? null;
      dispatch?.(setAccessToken(newAccessToken));
      dispatch?.(setRefreshToken(newRefreshToken));
      if (newAccessToken && dispatch) {
        setUserDataInReduxStore(newAccessToken!, dispatch);
      }

      await saveTokensToCookies(newAccessToken, newRefreshToken, cookieStore);

      return newAccessToken;
    }
  } catch (err) {
    logger.error('Error while refreshing access token', err);
    callback?.();
    return null;
  }
};

const isTokenValid = (token: string | null) =>
  token !== null && token !== '' && !isTokenExpired(token);

const saveTokensToCookies = async (
  accessToken: string | null,
  refreshToken: string | null,
  cookieStore: Cookies,
) => {
  try {
    if (!!accessToken) {
      cookieStore.set('accessToken', accessToken);
    } else {
      cookieStore.remove('accessToken');
    }
    if (!!refreshToken) {
      cookieStore.set('refreshToken', refreshToken);
    } else {
      cookieStore.remove('refreshToken');
    }
  } catch (error) {
    logger.error('Caught error while saving token', error);
  }
};

const setUserDataInReduxStore = (accessToken: string, dispatch: Dispatch<AnyAction>) => {
  const decodedToken = jwtDecode(accessToken);
  const userId = getUserIdFromAccessToken(accessToken);
  const roles =
    (decodedToken as any)?.resource_access?.[process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID ?? 'cbj']
      ?.roles ?? [];

  if (!!userId && roles?.length > 0) {
    dispatch(setUserId(userId));
    dispatch(setRoles(roles));
  }
};

const refreshAccessToken = async (
  refreshToken: string | null,
  dispatch: Dispatch<AnyAction>,
  cookieStore: Cookies,
) => {
  if (refreshToken === null) {
    logger.debug(`Refresh token is not set.`);
    return;
  }

  await getAccessTokenUsingRefreshToken(refreshToken, cookieStore, dispatch, () => {
    logger.debug(`Couldn't refresh access token. Log out...`);

    dispatch(setPassword(''));
    dispatch(setAccessToken(null));
    dispatch(setRefreshToken(null));
  });
};

export {
  setUserDataInReduxStore,
  refreshAccessToken,
  getUserIdFromAccessToken,
  getAccessTokenUsingRefreshToken,
  isTokenExpired,
  isTokenValid,
  saveTokensToCookies,
};
