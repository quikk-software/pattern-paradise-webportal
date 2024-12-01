'use client';

import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { GetOrderResponse } from '@/@types/api-types';
import ProductImageSlider from '@/lib/components/ProductImageSlider';
import Link from 'next/link';
import { BuyNowButton } from '@/lib/components/BuyNowButton';
import CreatedByRef from '@/lib/components/CreatedByRef';
import DownloadPatternZipButton from '@/lib/components/DownloadPatternZipButton';

interface OrderDetailsProps {
  order: GetOrderResponse;
}

export function OrderDetails({ order }: OrderDetailsProps) {
  const isPayed = order.status === 'CAPTURED' || order.status === 'COMPLETED';

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8">
        <ProductImageSlider
          imageUrls={order.productImageUrls}
          title={order?.productName ?? 'Pattern images'}
        />
        <div className="space-y-4">
          {!!order.productName ? <h1 className="text-3xl font-bold">{order.productName}</h1> : null}
          <CreatedByRef creatorId={order.seller.id} />
          <Badge
            variant="secondary"
            className={`text-lg${isPayed ? ' bg-green-400 text-white' : ''}`}
          >
            Order Status: {order.status}
          </Badge>
          {order.status === 'CREATED' ? (
            <div className="flex flex-col gap-2">
              <BuyNowButton
                price={order.productPrice}
                productId={order.productId}
                productName={order.productName}
                productStatus={'Released'}
              />
            </div>
          ) : null}
          {!!order.productDescription ? (
            <p className="text-gray-600">{order.productDescription}</p>
          ) : null}
          <div className="space-y-2">
            {!!order.productPrice ? (
              <p>
                <strong>Order price:</strong> {order.productPrice}$
              </p>
            ) : null}
            {!!order.paypalFee ? (
              <p>
                <strong>PayPal fee:</strong> {order.paypalFee.toFixed(2)}$
              </p>
            ) : null}
            {!!order.platformFee ? (
              <p>
                <strong>Platform fee:</strong> {order.platformFee.toFixed(2)}$
              </p>
            ) : null}
            <p>
              <strong>Last update on:</strong> {new Date(order.updatedAt).toDateString()}
            </p>
          </div>
          <DownloadPatternZipButton
            files={order.files}
            productId={order.productId}
            productTitle={order.productName}
          />
        </div>
        <Button asChild className="flex items-center space-x-2" variant="outline">
          <Link href="/app/secure/auth/me/orders">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go back
          </Link>
        </Button>
      </div>
    </div>
  );
}
