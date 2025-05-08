import NextAuth from 'next-auth';

declare module 'next-auth' {
  interface User {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    roles?: string[];
    subscriptionStatus?: string;
    theme?: string;
    accessToken?: string;
    refreshToken?: string;
    expiresAt?: number;
  }

  interface Session {
    error?: string;
    user: User;
  }

  interface JWT {
    accessToken?: string;
    refreshToken?: string;
    expiresAt?: number;
    error?: string;
  }
}
