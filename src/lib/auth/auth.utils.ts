import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import qs from 'qs';
import logger from '@/lib/core/logger';

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
const getAccessTokenUsingRefreshToken = async (refreshToken: string, callback?: () => void) => {
  if (refreshToken !== '') {
    try {
      return await axios.post(
        `${process.env.NEXT_PUBLIC_KEYCLOAK_BASE_URL}/realms/${process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID}/protocol/openid-connect/token`,
        qs.stringify({
          grant_type: 'refresh_token',
          client_id: process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID,
          refresh_token: refreshToken,
        }),
      );
    } catch (err) {
      logger.error({ err });
      !!callback && callback();
      return undefined;
    }
  }
  return undefined;
};

const isTokenValid = (accessToken: string | null) =>
  accessToken !== null && accessToken !== '' && !isTokenExpired(accessToken);

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

export {
  getUserIdFromAccessToken,
  getAccessTokenUsingRefreshToken,
  isTokenExpired,
  isTokenValid,
  saveTokensToCookies,
};
