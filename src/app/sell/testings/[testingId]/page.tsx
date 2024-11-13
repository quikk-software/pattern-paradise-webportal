'use client';

import React, { useEffect, useState } from 'react';
import { useGetTesting, useListTesterApplications } from '@/lib/api/testing';
import NotFoundPage from '@/app/not-found';
import { TesterApplicantsPage } from '@/components/tester-applicants-page';

export default function TestingPage({ params }: { params: { testingId: string } }) {
  const testingId = params.testingId;
  const [direction, setDirection] = useState<'asc' | 'desc'>('desc');
  const [sortKey, setSortKey] = useState<'updatedAt' | 'assignedAt'>('updatedAt');
  const [filter, setFilter] = useState<string[]>([]);

  const { fetch, data, isError, setData, reset, totalCount } = useListTesterApplications({});
  const { fetch: fetchTesting, data: testing, isError: fetchTestingIsError } = useGetTesting();

  useEffect(() => {
    fetch(testingId, direction, sortKey, filter);
  }, [testingId, direction, filter]);

  useEffect(() => {
    fetchTesting(testingId);
  }, [testingId]);

  if (!testing || isError || fetchTestingIsError) {
    return <NotFoundPage />;
  }

  return (
    <TesterApplicantsPage
      applications={data}
      directionFn={(overrideDirection: 'asc' | 'desc') => {
        if (overrideDirection !== direction) {
          setData([]);
          reset();
        }

        setDirection(overrideDirection);
      }}
      sortKeyFn={(overrideSortKey: 'updatedAt' | 'assignedAt') => {
        if (overrideSortKey !== sortKey) {
          reset();
        }
        setSortKey(overrideSortKey);
      }}
      filterFn={(overrideFilter: string[]) => {
        setData([]);
        reset();
        setFilter(overrideFilter);
      }}
      filter={filter}
      totalApplicantsCount={totalCount}
      testing={testing}
    />
  );
}
