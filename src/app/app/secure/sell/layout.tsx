'use client';

import { Store } from '@/lib/redux/store';
import { useSelector } from 'react-redux';
import InsufficientRoles from '@/components/insufficient-roles';
import { LoadingSpinnerComponent } from '@/components/loading-spinner';
import React from 'react';

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { roles, checkAuthIsLoading } = useSelector((s: Store) => s.auth);

  if (checkAuthIsLoading) {
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
