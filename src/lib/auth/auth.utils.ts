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
      }),
    );
    if (res?.data !== undefined && 'access_token' in res.data && 'refresh_token' in res.data) {
      const newAccessToken: string = (res.data.access_token as string) ?? null;
      const newRefreshToken: string = (res.data.refresh_token as string) ?? null;
      dispatch?.(setAccessToken(newAccessToken));
      dispatch?.(setRefreshToken(newRefreshToken));
      await saveTokensToCookies(newAccessToken, newRefreshToken);

      return newAccessToken;
    }
  } catch (err) {
    logger.error({ err });
    !!callback && callback();
    return null;
  }
};

const isTokenValid = (token: string | null) =>
  token !== null && token !== '' && !isTokenExpired(token);

const saveTokensToCookies = async (access_token: string, refresh_token: string) => {
  const response = await fetch('/api/auth/callback', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      access_token,
      refresh_token,
    }),
  });

  const data = await response.json();
  if (data.success) {
    logger.info('Tokens saved in cookies');
  } else {
    logger.error('Failed to save tokens');
  }
};

const setUserDataInReduxStore = (accessToken: string, dispatch: Dispatch<AnyAction>) => {
  const decodedToken = jwtDecode(accessToken);
  const userId = getUserIdFromAccessToken(accessToken);

  dispatch(setUserId(userId));
  dispatch(
    setRoles(
      (decodedToken as any)?.resource_access?.[process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID ?? 'cbj']
        ?.roles ?? [],
    ),
  );
};

const refreshAccessToken = async (refreshToken: string | null, dispatch: Dispatch<AnyAction>) => {
  if (refreshToken === null) {
    logger.debug(`Refresh token is not set.`);
    return;
  }

  await getAccessTokenUsingRefreshToken(refreshToken, dispatch, () => {
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
