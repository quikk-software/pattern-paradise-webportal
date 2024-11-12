'use client';

import React, { useEffect, useState } from 'react';
import { useListTesterApplications } from '@/lib/api/testing';
import NotFoundPage from '@/app/not-found';
import { LoadingSpinnerComponent } from '@/components/loading-spinner';
import { TesterApplicantsPage } from '@/components/tester-applicants-page';

export default function TestingPage({ params }: { params: { testingId: string } }) {
  const testingId = params.testingId;
  const [direction, setDirection] = useState<'asc' | 'desc'>('asc');

  const { fetch, data, isError, isLoading } = useListTesterApplications({});

  useEffect(() => {
    fetch(testingId, direction);
  }, [testingId, direction]);

  if (isError) {
    return <NotFoundPage />;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <LoadingSpinnerComponent />
      </div>
    );
  }

  return <TesterApplicantsPage applications={data} />;
}
