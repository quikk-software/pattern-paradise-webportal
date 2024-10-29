'use client';

import React, { useEffect } from 'react';
import { TestingPageComponent } from '@/components/testing-page';
import { useListTestingsByUserId } from '@/lib/api/testing';
import NotFoundPage from '@/app/not-found';
import { LoadingSpinnerComponent } from '@/components/loading-spinner';

export default function TestingsPage({ params }: { params: { productId: string } }) {
  const { fetch, data: testings, isLoading, isError } = useListTestingsByUserId({});

  useEffect(() => {
    fetch(params.productId);
  }, [params.productId]);

  if (isError) {
    return <NotFoundPage />;
  }

  if (isLoading || !testings) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <LoadingSpinnerComponent />
      </div>
    );
  }

  return <TestingPageComponent testings={testings} />;
}
