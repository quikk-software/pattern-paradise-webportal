'use client';

import React, { useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { GetOrderResponse } from '@/@types/api-types';
import ProductImageSlider from '@/lib/components/ProductImageSlider';
import { BuyNowButton } from '@/lib/components/BuyNowButton';
import CreatedByRef from '@/lib/components/CreatedByRef';
import DownloadPatternZipButton from '@/lib/components/DownloadPatternZipButton';
import { InfoBoxComponent } from '@/components/info-box';
import GoBackButton from '@/lib/components/GoBackButton';
import { useSelector } from 'react-redux';
import { Store } from '@/lib/redux/store';
import ProductMetrics from '@/lib/components/ProductMetrics';
import { useGetProduct } from '@/lib/api';
import { LoadingSpinnerComponent } from '@/components/loading-spinner';
import Link from 'next/link';
import TestingMetrics from '@/lib/components/TestingMetrics';

interface OrderDetailsProps {
  order: GetOrderResponse;
}

export function OrderDetails({ order }: OrderDetailsProps) {
  const { userId } = useSelector((s: Store) => s.auth);

  const { fetch: fetchProduct, data: product, isLoading: fetchProductIsLoading } = useGetProduct();

  useEffect(() => {
    fetchProduct(order.productId, false);
  }, [order.productId]);

  if (fetchProductIsLoading) {
    return <LoadingSpinnerComponent />;
  }

  const isPayed =
    order.status === 'CAPTURED' || order.status === 'APPROVED' || order.status === 'COMPLETED';
  const isCreated = order.status === 'CREATED';
  const isSeller = order.seller.id === userId;

  return (
    <div className="container mx-auto max-w-lg px-4 py-8">
      <div className="grid gap-8">
        <ProductImageSlider
          imageUrls={order.productImageUrls}
          title={order?.productName ?? 'Pattern images'}
        />
        <div className="space-y-8">
          <div className="space-y-2">
            {!!order.productName ? (
              <h1 className="text-3xl font-bold">{order.productName}</h1>
            ) : null}
            {!!order.productDescription ? (
              <p className="text-gray-600">{order.productDescription}</p>
            ) : null}
          </div>
          <div className="space-y-2 w-full">
            <CreatedByRef creatorId={order.seller.id} />
            {isSeller ? (
              <InfoBoxComponent severity="info" message="You are the owner of this pattern" />
            ) : null}
          </div>
          <div className="space-y-2">
            <Badge
              variant="secondary"
              className={`text-lg${isPayed ? ' bg-green-400 text-white' : ''}`}
            >
              Order Status: {order.status}
            </Badge>

            {isCreated && !isSeller ? (
              <div className="flex flex-col gap-2">
                <InfoBoxComponent
                  severity="warning"
                  title="One last step"
                  message="Please complete your payment with PayPal by clicking on 'Buy Now' below. You'll get access to the pattern immediately after your payment was successful."
                />
                {!!product ? (
                  <BuyNowButton product={product} />
                ) : (
                  <p className="text-sm text-red-500 mb-2">
                    Couldn&apos;t load pattern details. Please reload or try again later. If this
                    error persists, please reach out to us{' '}
                    <Link href="/help" target="_blank" className="text-blue-500 underline">
                      here
                    </Link>
                    .
                  </p>
                )}
              </div>
            ) : null}
          </div>
          <div className="space-y-2">
            {!!order.productPrice ? (
              <p>
                <strong>Order price:</strong> {order.productPrice}$
              </p>
            ) : null}
            {!!order.paypalFee && isSeller ? (
              <p>
                <strong>PayPal fee:</strong> {order.paypalFee.toFixed(2)}$
              </p>
            ) : null}
            {!!order.platformFee && isSeller ? (
              <p>
                <strong>Platform fee:</strong> {order.platformFee.toFixed(2)}$
              </p>
            ) : null}
            <p>
              <strong>Last update on:</strong> {new Date(order.updatedAt).toDateString()}
            </p>
          </div>
          {isPayed || isSeller ? (
            <DownloadPatternZipButton
              files={order.files}
              productId={order.productId}
              productTitle={order.productName}
            />
          ) : null}
          <div className="flex flex-col gap-2">
            <ProductMetrics productId={order.productId} />
            <TestingMetrics productId={order.productId} />
          </div>
        </div>
        <GoBackButton />
      </div>
    </div>
  );
}
