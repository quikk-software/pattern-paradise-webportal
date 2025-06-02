'use client';

import React, { useEffect } from 'react';
import { ProfilePage } from '@/components/profile-page';
import { useGetUser } from '@/lib/api';
import NotFoundPage from '@/app/[lang]/not-found';
import { LoadingSpinnerComponent } from '@/components/loading-spinner';
import { useSelector } from 'react-redux';
import { Store } from '@/lib/redux/store';

export default function MePage() {
  const { userId } = useSelector((s: Store) => s.auth);

  const { fetch, data: user, isLoading, isError } = useGetUser();

  useEffect(() => {
    fetch(userId);
  }, [userId]);

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

  return <ProfilePage user={user} />;
}
