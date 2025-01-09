'use client';

import React, { useEffect } from 'react';
import { UpdateProductForm } from '@/lib/components/UpdateProductForm';
import NotFoundPage from '@/app/not-found';
import { LoadingSpinnerComponent } from '@/components/loading-spinner';
import { useGetProduct } from '@/lib/api';

export default function UpdateProductPage({ params }: { params: { productId: string } }) {
  const { fetch, data: product, isLoading, isError } = useGetProduct();

  useEffect(() => {
    fetch(params.productId, false);
  }, [params.productId]);

  if (isError) {
    return <NotFoundPage />;
  }

  if (isLoading || !product) {
    return (
      <div className="flex justify-center items-center h-full">
        <LoadingSpinnerComponent />
      </div>
    );
  }

  return <UpdateProductForm initialData={product} />;
}
