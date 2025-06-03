'use client';

import { SessionProvider } from 'next-auth/react';
import '@/i18n';

export default function AuthSessionProvider({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}
