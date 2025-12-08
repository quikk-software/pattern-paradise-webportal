'use client';

import React, { useEffect } from 'react';
import { UpdateProductForm } from '@/lib/components/UpdateProductForm';
import NotFoundPage from '@/app/not-found';
import { LoadingSpinnerComponent } from '@/components/loading-spinner';
import { useGetProduct } from '@/lib/api';
import { useParams } from 'next/navigation';

export default function UpdateProductPage() {
  const { productId } = useParams();

  const { fetch, data: product, isLoading, isError } = useGetProduct();

  useEffect(() => {
    if (!productId) {
      return;
    }
    fetch(productId as string, false);
  }, [productId]);

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
