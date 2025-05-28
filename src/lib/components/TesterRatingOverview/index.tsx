'use client';

import React, { useEffect } from 'react';
import TesterRatingCard from '@/lib/components/TesterRatingCard';
import { useGetTesting, useListTesterApplications } from '@/lib/api/testing';
import NotFoundPage from '@/app/not-found';
import { LoadingSpinnerComponent } from '@/components/loading-spinner';

interface TesterRatingOverviewProps {
  testingId: string;
}

export default function TesterRatingOverview({ testingId }: TesterRatingOverviewProps) {
  const { fetch, data: testing, isLoading, isError } = useGetTesting();
  const { fetch: fetchTesters, data: testers } = useListTesterApplications({});

  useEffect(() => {
    fetch(testingId);
    fetchTesters(testingId, {
      sortKey: 'assignedAt',
      direction: 'asc',
      filter: [],
    });
  }, [testingId]);

  if (isError) {
    return <NotFoundPage />;
  }

  if (isLoading || !testing) {
    return (
      <div className="flex justify-center items-center h-full">
        <LoadingSpinnerComponent />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Rate Your Testers</h1>
      {testers?.map((tester) => (
        <div className="flex flex-col gap-2" key={tester.user.id}>
          <TesterRatingCard
            testingId={testingId}
            tester={tester}
            alreadyRated={tester?.starRating !== undefined}
          />
        </div>
      ))}
    </div>
  );
}
