'use client';

import React, { useEffect } from 'react';
import UserAccountComponent from '@/components/user-account';
import { useGetUserById } from '@/lib/api';
import NotFoundPage from '@/app/not-found';
import { LoadingSpinnerComponent } from '@/components/loading-spinner';

export default function SellUserPage({ params }: { params: { userId: string } }) {
  const { fetch, data: user, isLoading, isError } = useGetUserById();

  useEffect(() => {
    fetch(params.userId);
  }, [params.userId]);

  if (isError) {
    return <NotFoundPage />;
  }

  if (isLoading || !user) {
    return (
      <div className="flex justify-center items-center h-full">
        <LoadingSpinnerComponent />
      </div>
    );
  }

  return <UserAccountComponent user={user} />;
}
