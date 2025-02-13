'use client';

import React, { useEffect } from 'react';
import { useGetOrderAnalytics } from '@/lib/api/order';
import { useSelector } from 'react-redux';
import { Store } from '@/lib/redux/store';
import AnalyticsDashboard from '@/lib/components/AnalyticsDashboard';
import AnalyticsFilter from '@/lib/components/AnalyticsFilter';

export default function DashboardPage() {
  const { userId } = useSelector((s: Store) => s.auth);

  const { fetch, data: analytics, isLoading, isError, errorDetail } = useGetOrderAnalytics();

  useEffect(() => {
    fetch(userId);
  }, [userId]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-2xl font-bold">Dashboard</h2>
      </div>
      <AnalyticsFilter
        userId={userId}
        fetch={fetch}
        isLoading={isLoading}
        isError={isError}
        errorDetail={errorDetail}
      />
      {analytics ? <AnalyticsDashboard analytics={analytics} /> : null}
    </div>
  );
}
