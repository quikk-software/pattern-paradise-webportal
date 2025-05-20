import NextAuth, { Profile } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { jwtDecode } from 'jwt-decode';
import logger from '@/lib/core/logger';
import { getUser } from '@/lib/api/static/user/getUser';
import { refreshAccessToken } from '@/app/api/auth/utils';
import { OAuthConfig } from 'next-auth/providers/oauth';
import { getUserById } from '@/lib/api/static/user/getUserById';
import { createExternalUser } from '@/lib/api/static/user/createExternalUser';

const KeycloakGoogleProvider: OAuthConfig<Profile> = {
  id: 'google',
  name: 'Google',
  type: 'oauth',
  version: '2.0',
  clientId: process.env.KEYCLOAK_CLIENT_ID!,
  clientSecret: process.env.KEYCLOAK_CLIENT_SECRET!,
  issuer: process.env.KEYCLOAK_BASE_URL,
  wellKnown: `${process.env.KEYCLOAK_BASE_URL}/.well-known/openid-configuration`,
  authorization: {
    url: `${process.env.KEYCLOAK_BASE_URL}/protocol/openid-connect/auth`,
    params: {
      scope: 'openid profile email offline_access offline_access',
      kc_idp_hint: process.env.NODE_ENV === 'development' ? undefined : 'google',
    },
  },
  token: `${process.env.KEYCLOAK_BASE_URL}/protocol/openid-connect/token`,
  userinfo: `${process.env.KEYCLOAK_BASE_URL}/protocol/openid-connect/userinfo`,
  profile(profile) {
    logger.info('Got profile from Google:', profile);
    return {
      id: profile.sub!,
      name: (profile as any).preferred_username,
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
          const id = decodedToken?.refId ?? decodedToken?.sub;

          logger.info('Get user data with ID from token', id);

          const user = await getUser(id, data.access_token);

          if (!user) {
            throw new Error('User not found');
          }

          return {
            // @ts-ignore
            id: user?.id,
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
            // @ts-ignore
            hasAcceptedTerms: user.hasAcceptedTerms,
            // @ts-ignore
            hasAcceptedPrivacy: user.hasAcceptedPrivacy,
            // @ts-ignore
            acceptedTermsOn: new Date(user.acceptedTermsOn),
            // @ts-ignore
            acceptedPrivacyOn: new Date(user.acceptedPrivacyOn),
            // @ts-ignore
            theme: user.theme,
            error: null,
          };
        } catch (error: any) {
          throw new Error(`Keycloak authentication failed: ${error?.message}`);
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account, profile, trigger }) {
      const existingUser = profile?.sub ? await getUserById(profile.sub) : undefined;

      let userId = existingUser?.id;
      if (!existingUser && profile?.email && profile?.sub) {
        logger.info('Found user with external profile', profile);
        logger.info(`Create user for email ${profile.email}`);
        try {
          const response = await createExternalUser({
            email: profile.email,
            roles: ['Buyer', 'Tester'],
            firstName: (profile as any).given_name ?? undefined,
            lastName: (profile as any).family_name ?? undefined,
            hasAcceptedPrivacy: true,
            hasAcceptedTerms: true,
            keycloakUserId: profile.sub,
            registeredWith: 'GOOGLE',
          });
          if (response?.userId) {
            userId = response.userId;
          }
        } catch (e: any) {
          logger.error('Creating external user failed', e);
          throw e;
        }
      }

      logger.info('Current account', account);

      if (account) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.expiresAt = Date.now() + (account.expires_in as number) * 1000;
      }

      logger.info('Current user', user);

      if (user) {
        token.accessToken = token.accessToken ?? user.accessToken;
        token.refreshToken = token.refreshToken ?? user.refreshToken;
        token.expiresAt = token.expiresAt ?? user.expiresAt;
        token.id = userId;
        token.name = user.name;
        token.image = user.image;
        token.roles = user.roles;
        token.subscriptionStatus = user?.subscriptionStatus;
        token.hasAcceptedTerms = user?.hasAcceptedTerms;
        token.hasAcceptedPrivacy = user?.hasAcceptedPrivacy;
        token.acceptedTermsOn = user?.acceptedTermsOn ? new Date(user.acceptedTermsOn) : undefined;
        token.acceptedPrivacyOn = user?.acceptedPrivacyOn
          ? new Date(user.acceptedPrivacyOn)
          : undefined;
        token.theme = user?.theme;
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

    async session({ session, user, token }) {
      let sessionToken = token;

      if (!token?.accessToken) {
        logger.warn('No access token – likely anonymous or bot request');
        return session;
      }

      if (!token?.expiresAt || Date.now() >= new Date(token.expiresAt as number).getTime()) {
        logger.info('Access token expired – attempt to refresh');
        try {
          sessionToken = await refreshAccessToken(token);
        } catch (e) {
          logger.error('Failed to refresh access token', e);
          return { ...session, error: 'RefreshAccessTokenError' };
        }
      }

      let decodedSessionToken: any;
      try {
        decodedSessionToken = jwtDecode(sessionToken.accessToken as string);
      } catch (e) {
        logger.error('Failed to decode session token', e);
        return session;
      }

      const userId = decodedSessionToken?.sub ?? user?.id ?? sessionToken?.sub;

      if (!userId) {
        logger.warn('No user ID in decoded token – skipping user lookup');
        return session;
      }

      let existingUser;
      try {
        existingUser = await getUserById(userId as string);
      } catch (e) {
        logger.error('getUserById failed', e);
        return { ...session, error: 'UserLookupFailed' };
      }

      if (!existingUser) {
        logger.warn(`No user found for ID ${userId}`);
        return session;
      }

      session.user.accessToken = sessionToken.accessToken as string;
      session.user.refreshToken = sessionToken.refreshToken as string;
      session.user.expiresAt = sessionToken.expiresAt as number;
      session.user.id = existingUser.id;
      session.user.name = sessionToken.name;
      session.user.image = sessionToken.image as string;
      session.user.roles = sessionToken.roles as string[];
      session.user.subscriptionStatus = sessionToken.subscriptionStatus as string;
      session.user.hasAcceptedTerms = sessionToken.hasAcceptedTerms as boolean;
      session.user.hasAcceptedPrivacy = sessionToken.hasAcceptedPrivacy as boolean;
      session.user.acceptedTermsOn = sessionToken.acceptedTermsOn as Date;
      session.user.acceptedPrivacyOn = sessionToken.acceptedPrivacyOn as Date;
      session.user.theme = sessionToken.theme as string;

      return { ...session, error: sessionToken?.error };
    },
  },
});

export { handler as GET, handler as POST };
