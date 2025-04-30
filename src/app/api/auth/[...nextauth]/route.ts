import NextAuth, { User } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { jwtDecode } from 'jwt-decode';
import logger from '@/lib/core/logger';
import { getUser } from '@/lib/api/static/user/getUser';
import { refreshAccessToken } from '@/app/api/auth/utils';
import { OAuthConfig } from 'next-auth/providers/oauth';

const KeycloakGoogleProvider: OAuthConfig<User> = {
  id: 'google',
  name: 'Google',
  type: 'oauth',
  version: '2.0',
  clientId: process.env.KEYCLOAK_CLIENT_ID!,
  clientSecret: process.env.KEYCLOAK_CLIENT_SECRET!,
  issuer: process.env.KEYCLOAK_BASE_URL,
  wellKnown:
    'https://fly-keycloak-broken-bird-3701.fly.dev/realms/cbj/.well-known/openid-configuration',
  authorization: {
    url: `${process.env.KEYCLOAK_BASE_URL}/protocol/openid-connect/auth`,
    params: {
      scope: 'openid profile email',
      kc_idp_hint: 'google',
    },
  },
  token: `${process.env.KEYCLOAK_BASE_URL}/protocol/openid-connect/token`,
  userinfo: `${process.env.KEYCLOAK_BASE_URL}/protocol/openid-connect/userinfo`,
  profile(profile) {
    return {
      id: profile.id,
      name: profile.name,
      email: profile.email,
    };
  },
};

const handler = NextAuth({
  session: {
    strategy: 'jwt',
    maxAge: 14 * 24 * 60 * 60,
    updateAge: 0,
  },
  providers: [
    KeycloakGoogleProvider,
    CredentialsProvider({
      name: 'Pattern Paradise Credentials',
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

          // @ts-ignore
          const id = decodedToken?.refId;

          const user = await getUser(id, data.access_token);

          return {
            id,
            accessToken: data.access_token,
            refreshToken: data.refresh_token,
            expiresAt: Date.now() + data.expires_in * 1000,
            // @ts-ignore
            name: decodedToken.given_name ?? decodedToken.preferred_username,
            // @ts-ignore
            email: decodedToken?.email,
            // @ts-ignore
            image: decodedToken?.image,
            // @ts-ignore
            roles: decodedToken?.resource_access?.[process.env.KEYCLOAK_CLIENT_ID]?.roles || [],
            // @ts-ignore
            subscriptionStatus: user.paypalSubscriptionStatus,
            error: null,
          };
        } catch (error: any) {
          throw new Error(`Keycloak authentication failed: ${error?.message}`);
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger }) {
      if (user) {
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        token.expiresAt = user.expiresAt;
        token.id = user.id;
        token.name = user.name;
        token.image = user.image;
        token.roles = user.roles;
        token.subscriptionStatus = user?.subscriptionStatus;
      }

      if (
        !token?.expiresAt ||
        Date.now() >= new Date(token.expiresAt as number).getTime() ||
        trigger === 'update'
      ) {
        logger.info('Use refresh token to get fresh access token');
        return await refreshAccessToken(token);
      }

      return token;
    },

    async session({ session, token }) {
      let sessionToken = token;
      if (!token?.expiresAt || Date.now() >= new Date(token.expiresAt as number).getTime()) {
        logger.info('Use refresh token to get fresh access token');
        sessionToken = await refreshAccessToken(token);
      }

      session.user.accessToken = sessionToken.accessToken as string;
      session.user.refreshToken = sessionToken.refreshToken as string;
      session.user.expiresAt = sessionToken.expiresAt as number;
      session.user.id = sessionToken.id as string;
      session.user.name = sessionToken.name;
      session.user.image = sessionToken.image as string;
      session.user.roles = sessionToken.roles as string[];
      session.user.subscriptionStatus = sessionToken.subscriptionStatus as string;
      return { ...session, error: sessionToken?.error };
    },
  },
});

export { handler as GET, handler as POST };
