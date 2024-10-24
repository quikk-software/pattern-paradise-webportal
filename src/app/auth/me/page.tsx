'use client';

import React, { useEffect } from 'react';
import { ProfilePage } from '@/components/profile-page';
import { useGetUser } from '@/lib/api';
import NotFoundPage from '@/app/not-found';
import { LoadingSpinnerComponent } from '@/components/loading-spinner';

export default function MePage() {
  const { fetch, data: user, isLoading, isError } = useGetUser();

  useEffect(() => {
    fetch();
  }, []);

  if (isError) {
    return <NotFoundPage />;
  }

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <LoadingSpinnerComponent />
      </div>
    );
  }

  return <ProfilePage user={user} />;
}
