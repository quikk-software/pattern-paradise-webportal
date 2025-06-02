'use client';

import React, { useEffect } from 'react';
import OrderSuccess from '@/lib/components/OrderSuccess';
import { useGetOrder } from '@/lib/api/order';
import useOrderId from '@/lib/core/useOrderId';
import NotFoundPage from '@/app/not-found';
import { LoadingSpinnerComponent } from '@/components/loading-spinner';
import dayjs, { ADVANCED_DATE_FORMAT } from '@/lib/core/dayjs';

export default function OrderSuccessPage() {
  const { fetch, data: order, isLoading, isError } = useGetOrder();
  const { orderId } = useOrderId();

  useEffect(() => {
    if (!orderId) {
      return;
    }
    fetch(orderId);
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

  return (
    <OrderSuccess
      orderId={order.id}
      orderNumber={order.paypalOrderId}
      date={dayjs(order.createdAt).format(ADVANCED_DATE_FORMAT)}
      pattern={{
        image: order.productImageUrls?.at(0) || '',
        name: order.productName,
        description: order.productDescription,
        price: order.productPrice.toFixed(2),
      }}
    />
  );
}
