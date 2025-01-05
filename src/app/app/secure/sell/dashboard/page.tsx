'use client';

import React, { useEffect } from 'react';
import { useGetOrderAnalytics } from '@/lib/api/order';
import { useSelector } from 'react-redux';
import { Store } from '@/lib/redux/store';
import NotFoundPage from '@/app/not-found';
import { LoadingSpinnerComponent } from '@/components/loading-spinner';
import AnalyticsDashboard from '@/lib/components/AnalyticsDashboard';

export default function DashboardPage() {
  const { userId } = useSelector((s: Store) => s.auth);

  const { fetch, data: analytics, isLoading, isError } = useGetOrderAnalytics();

  useEffect(() => {
    fetch(userId);
  }, [userId]);

  if (isError) {
    return <NotFoundPage />;
  }

  if (isLoading || !analytics) {
    return (
      <div className="flex justify-center items-center h-full">
        <LoadingSpinnerComponent />
      </div>
    );
  }

  return <AnalyticsDashboard analytics={analytics} />;
}
