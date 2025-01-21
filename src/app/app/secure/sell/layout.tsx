'use client';

import { Store } from '@/lib/redux/store';
import { useSelector } from 'react-redux';
import InsufficientRoles from '@/components/insufficient-roles';
import { LoadingSpinnerComponent } from '@/components/loading-spinner';
import React from 'react';
import { useSession } from 'next-auth/react';

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { status } = useSession();
  const { roles } = useSelector((s: Store) => s.auth);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <LoadingSpinnerComponent />
      </div>
    );
  }

  if (!roles.includes('Seller')) {
    return <InsufficientRoles roleType={'Seller'} />;
  }

  return children;
}
