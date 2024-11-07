'use client';

import React, { useEffect } from 'react';
import { useGetTestingByProductId } from '@/lib/api/testing';
import NotFoundPage from '@/app/not-found';
import { LoadingSpinnerComponent } from '@/components/loading-spinner';
import { useGetProduct } from '@/lib/api';
import { TesterCallPage } from '@/components/tester-call-page';

export default function TestDetailsPage({ params }: { params: { productId: string } }) {
  const {
    fetch: fetchTesting,
    isLoading: fetchTestingIsLoading,
    isError: fetchTestingIsError,
    data: testing,
  } = useGetTestingByProductId();
  const {
    fetch: fetchProduct,
    isError: fetchProductIsError,
    isLoading: fetchProductIsLoading,
    data: product,
  } = useGetProduct();

  useEffect(() => {
    fetchProduct(params.productId);
    fetchTesting(params.productId);
  }, [params.productId]);

  if (fetchTestingIsError || fetchProductIsError) {
    return <NotFoundPage />;
  }

  if (fetchTestingIsLoading || fetchProductIsLoading || !testing || !product) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <LoadingSpinnerComponent />
      </div>
    );
  }

  return <TesterCallPage product={product} testing={testing} />;
}
