'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useGetTesting, useListTesterApplications } from '@/lib/api/testing';
import { TesterApplicantsPage } from '@/components/tester-applicants-page';

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
  } = useListTesterApplications({
    pageNumber: 1,
    pageSize: 3,
  });
  const { fetch: fetchTesting, data: testing } = useGetTesting();

  const observer = useRef<IntersectionObserver | null>(null);

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

  const infinityScrollRef = (node: HTMLElement | null) => {
    if (fetchTesterApplicationsIsLoading) return;
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && fetchTesterApplicationsHasNextPage) {
        fetch(testingId, {
          direction,
          sortKey,
          filter,
          status: ['Created'],
        });
      }
    });

    if (node) observer.current.observe(node);
  };

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
      <div ref={infinityScrollRef} className="h-10" />
    </div>
  );
}
