'use client';

import React, { useEffect } from 'react';
import { OrderDetails } from '@/components/order-details';
import NotFoundPage from '@/app/not-found';
import { LoadingSpinnerComponent } from '@/components/loading-spinner';
import { useGetOrder } from '@/lib/api/order';
import { useParams } from 'next/navigation';

export default function MyOrderDetailPage() {
  const { orderId } = useParams();

  const { fetch, data: order, isLoading, isError } = useGetOrder();

  useEffect(() => {
    if (!orderId) {
      return;
    }
    fetch(orderId as string);
  }, [orderId]);

  if (isError) {
    return <NotFoundPage />;
  }

  if (isLoading || !order) {
    return (
      <div className="flex justify-center items-center h-full">
        <LoadingSpinnerComponent />
      </div>
    );
  }

  return <OrderDetails order={order} />;
}
