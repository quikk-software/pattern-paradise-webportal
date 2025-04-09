import axios from 'axios';
import qs from 'qs';
import logger from '@/lib/core/logger';
import { jwtDecode } from 'jwt-decode';
import { getUser } from '@/lib/api/static/user/getUser';

export async function refreshAccessToken(token: any) {
  try {
    const response = await axios.post(
      `${process.env.KEYCLOAK_BASE_URL}/protocol/openid-connect/token`,
      qs.stringify({
        grant_type: 'refresh_token',
        client_id: process.env.KEYCLOAK_CLIENT_ID,
        client_secret: process.env.KEYCLOAK_CLIENT_SECRET!,
        refresh_token: token.refreshToken,
      }),
    );

    const refreshedTokens = response.data;

    if (response.status !== 200) {
      logger.error("Couldn't get access token with refresh token");
      throw new Error('Failed to refresh access token');
    }

    logger.info('Got fresh access token');

    const decodedToken = jwtDecode(refreshedTokens.access_token) as any;

    // @ts-ignore
    const id = decodedToken?.refId;

    const user = await getUser(id, refreshedTokens.access_token);

    return {
      ...token,
      name: decodedToken?.given_name ?? decodedToken?.preferred_username,
      email: decodedToken?.email,
      image: user?.imageUrl,
      sub: decodedToken?.refId,
      roles: decodedToken?.resource_access?.[process.env.KEYCLOAK_CLIENT_ID || '']?.roles || [],
      subscriptionStatus: user?.paypalSubscriptionStatus,
      accessToken: refreshedTokens.access_token,
      refreshToken: refreshedTokens.refresh_token ?? token.refreshToken,
      expiresAt: decodedToken.exp! * 1000,
      error: null,
    };
  } catch (error) {
    logger.error('Error refreshing access token:', error);
    return { ...token, error: 'RefreshAccessTokenError' };
  }
}
