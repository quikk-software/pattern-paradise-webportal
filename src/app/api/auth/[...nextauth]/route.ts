import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { jwtDecode } from 'jwt-decode';
import logger from '@/lib/core/logger';
import axios from 'axios';
import qs from 'qs';

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Keycloak Credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          throw new Error('Username or password missing');
        }

        try {
          const tokenResponse = await fetch(
            `${process.env.KEYCLOAK_BASE_URL}/protocol/openid-connect/token`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
              },
              body: new URLSearchParams({
                client_id: process.env.KEYCLOAK_CLIENT_ID!,
                client_secret: process.env.KEYCLOAK_CLIENT_SECRET!,
                grant_type: 'password',
                username: credentials.username!,
                password: credentials.password!,
                scope: 'openid profile email offline_access',
              }),
            },
          );

          const data = await tokenResponse.json();

          if (!tokenResponse.ok) {
            throw new Error(data.error_description || 'Authentication failed');
          }

          const decodedToken = jwtDecode(data.access_token);

          return {
            // @ts-ignore
            id: decodedToken?.refId,
            accessToken: data.access_token,
            refreshToken: data.refresh_token,
            expiresAt: Date.now() + data.expires_in * 1000,
            // @ts-ignore
            name: decodedToken?.name,
            // @ts-ignore
            email: decodedToken?.email,
            // @ts-ignore
            roles: decodedToken?.resource_access?.cbj?.roles || [],
          };
        } catch (error: any) {
          throw new Error(`Keycloak authentication failed: ${error?.message}`);
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        token.expiresAt = user.expiresAt;
        token.id = user.id;
        token.roles = user.roles;
      }

      if (!token?.expiresAt || Date.now() >= new Date(token.expiresAt as number).getTime()) {
        logger.info('Use refresh token to get fresh access token');
        return await refreshAccessToken(token);
      }

      return token;
    },

    async session({ session, token }) {
      session.user.accessToken = token.accessToken as string;
      session.user.refreshToken = token.refreshToken as string;
      session.user.expiresAt = token.expiresAt as number;
      session.user.id = token.id as string;
      session.user.roles = token.roles as string[];
      return session;
    },
  },
});

export { handler as GET, handler as POST };

async function refreshAccessToken(token: any) {
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

    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      refreshToken: refreshedTokens.refresh_token ?? token.refreshToken,
      expiresAt: Date.now() + refreshedTokens.expires_in * 1000,
    };
  } catch (error) {
    logger.error('Error refreshing access token:', error);
    return { ...token, error: 'RefreshAccessTokenError' };
  }
}
