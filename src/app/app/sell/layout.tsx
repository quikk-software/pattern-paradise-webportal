'use client';

import { Store } from '@/lib/redux/store';
import { useSelector } from 'react-redux';
import InsufficientRoles from '@/components/insufficient-roles';

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { roles } = useSelector((s: Store) => s.auth);

  if (!roles.includes('Seller')) {
    return <InsufficientRoles roleType={'Seller'} />;
  }

  return children;
}
