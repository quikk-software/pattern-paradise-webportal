'use client';

import React, { useEffect } from 'react';
import { useGetTestingByProductId } from '@/lib/api/testing';
import NotFoundPage from '@/app/not-found';
import { LoadingSpinnerComponent } from '@/components/loading-spinner';
import { useGetProduct } from '@/lib/api';
import { TesterCallPage } from '@/components/tester-call-page';
import { useParams } from 'next/navigation';

export default function TestDetailsPage() {
  const { productId } = useParams();

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
    if (!productId) {
      return;
    }
    fetchProduct(productId as string, false);
    fetchTesting(productId as string);
  }, [productId]);

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

  const theme = testing?.theme ?? 'neutral';

  return <TesterCallPage product={product} testing={testing} theme={theme} />;
}
