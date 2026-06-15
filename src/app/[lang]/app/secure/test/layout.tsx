'use client';

import { Store } from '@/lib/redux/store';
import { useSelector } from 'react-redux';
import { redirect } from 'next/navigation';
import InsufficientRoles from '@/components/insufficient-roles';
import { TESTER_CALLS_ENABLED } from '@/lib/constants';

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Tester Calls feature is disabled — redirect the whole /app/secure/test/* area to the homepage.
  if (!TESTER_CALLS_ENABLED) {
    redirect('/');
  }

  const { roles } = useSelector((s: Store) => s.auth);

  if (!roles.includes('Tester')) {
    return <InsufficientRoles roleType={'Tester'} />;
  }

  return children;
}
