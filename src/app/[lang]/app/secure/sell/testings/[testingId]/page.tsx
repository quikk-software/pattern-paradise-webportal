'use client';

import React, { useEffect, useState } from 'react';
import { useGetTesting, useListTesterApplications } from '@/lib/api/testing';
import { TesterApplicantsPage } from '@/components/tester-applicants-page';
import { Button } from '@/components/ui/button';

export default function TestingPage({ params }: { params: { testingId: string } }) {
  const testingId = params.testingId;
  const [direction, setDirection] = useState<'asc' | 'desc'>('desc');
  const [sortKey, setSortKey] = useState<'updatedAt' | 'assignedAt'>('updatedAt');
  const [filter, setFilter] = useState<string[]>([]);

  const {
    fetch,
    data,
    setData,
    reset,
    totalCount,
    isLoading: fetchTesterApplicationsIsLoading,
    hasNextPage: fetchTesterApplicationsHasNextPage,
  } = useListTesterApplications({});
  const { fetch: fetchTesting, data: testing } = useGetTesting();

  useEffect(() => {
    fetch(testingId, {
      direction,
      sortKey,
      filter,
      status: ['Created'],
    });
  }, [testingId, direction, filter, sortKey]);

  useEffect(() => {
    fetchTesting(testingId);
  }, [testingId]);

  return (
    <div className="flex flex-col gap-4">
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
        fetchTesterApplicationsIsLoading={fetchTesterApplicationsIsLoading}
      />
      {!fetchTesterApplicationsIsLoading && fetchTesterApplicationsHasNextPage ? (
        <Button
          className="w-full"
          onClick={() =>
            fetch(testingId, {
              direction,
              sortKey,
              filter,
              status: ['Created'],
            })
          }
        >
          Load More
        </Button>
      ) : null}
    </div>
  );
}
