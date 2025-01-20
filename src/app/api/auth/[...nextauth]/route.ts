import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { jwtDecode } from 'jwt-decode';

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
            `${process.env.NEXT_PUBLIC_KEYCLOAK_BASE_URL}/protocol/openid-connect/token`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
              },
              body: new URLSearchParams({
                client_id: process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID!,
                client_secret: process.env.KEYCLOAK_CLIENT_SECRET!,
                grant_type: 'password',
                username: credentials.username!,
                password: credentials.password!,
                scope: 'openid profile email',
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

      if (Date.now() >= (token.expiresAt as number)) {
        return refreshAccessToken(token);
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

// Function to handle refreshing the access token
async function refreshAccessToken(token: any) {
  try {
    // Call Keycloak to refresh the access token using the refresh token
    const response = await fetch(`${process.env.KEYCLOAK_ISSUER}/protocol/openid-connect/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID!,
        grant_type: 'refresh_token',
        refresh_token: token.refreshToken,
      }),
    });

    const refreshedTokens = await response.json();

    if (!response.ok) {
      throw new Error('Failed to refresh access token');
    }

    // Return the refreshed token with new access token, refresh token, and expiry
    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      refreshToken: refreshedTokens.refresh_token ?? token.refreshToken,
      expiresAt: Date.now() + refreshedTokens.expires_in * 1000,
    };
  } catch (error) {
    console.error('Error refreshing access token:', error);
    return { ...token, error: 'RefreshAccessTokenError' };
  }
}
