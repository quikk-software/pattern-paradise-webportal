'use client';

import React, { useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { GetOrderResponse } from '@/@types/api-types';
import ProductImageSlider from '@/lib/components/ProductImageSlider';
import { BuyNowButton } from '@/lib/components/BuyNowButton';
import CreatedByRef from '@/lib/components/CreatedByRef';
import DownloadPatternZipButton from '@/lib/components/DownloadPatternZipButton';
import { InfoBoxComponent } from '@/components/info-box';
import UserDetailsCard from '@/lib/components/UserDetailsCard';
import GoBackButton from '@/lib/components/GoBackButton';
import { useSelector } from 'react-redux';
import { Store } from '@/lib/redux/store';

interface OrderDetailsProps {
  order: GetOrderResponse;
}

export function OrderDetails({ order }: OrderDetailsProps) {
  const { userId } = useSelector((s: Store) => s.auth);

  const isPayed = order.status === 'CAPTURED' || order.status === 'COMPLETED';
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
                <BuyNowButton
                  price={order.productPrice}
                  productId={order.productId}
                  productName={order.productName}
                />
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
          {isSeller ? (
            <div className="space-y-2">
              <h5 className="font-semibold">Bought by</h5>
              <UserDetailsCard user={order.customer} />
            </div>
          ) : null}
          {isPayed || isSeller ? (
            <DownloadPatternZipButton
              files={order.files}
              productId={order.productId}
              productTitle={order.productName}
            />
          ) : null}
        </div>
        <GoBackButton />
      </div>
    </div>
  );
}
