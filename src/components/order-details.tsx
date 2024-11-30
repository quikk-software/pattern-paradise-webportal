'use client';

import React, { useEffect } from 'react';
import { ArrowLeft, Download } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { GetOrderResponse } from '@/@types/api-types';
import ProductImageSlider from '@/lib/components/ProductImageSlider';
import { useDownloadPatternsByProductId } from '@/lib/api/pattern';
import RequestStatus from '@/lib/components/RequestStatus';
import { LoadingSpinnerComponent } from '@/components/loading-spinner';
import Link from 'next/link';
import { BuyNowButton } from '@/lib/components/BuyNowButton';
import CreatedByRef from '@/lib/components/CreatedByRef';
import CountryFlag from '@/lib/components/CountryFlag';

interface OrderDetailsProps {
  order: GetOrderResponse;
}

export function OrderDetails({ order }: OrderDetailsProps) {
  const { fetch, isLoading, isSuccess, isError, data: file } = useDownloadPatternsByProductId();

  useEffect(() => {
    if (!file) {
      return;
    }
    const url = URL.createObjectURL(file);
    const link = document.createElement('a');
    link.href = url;
    link.target = '_self';
    link.download =
      file.name ?? `${order.productName.toLowerCase().replace(/\s/g, '')}_pattern.pdf`;
    document.body.appendChild(link);
    link.click();

    setTimeout(() => {
      URL.revokeObjectURL(url);
      document.body.removeChild(link);
    }, 1000);
  }, [file]);

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
          {order.orderPatternFiles.map((pdf) => (
            <Button
              key={pdf.id}
              className="w-full sm:w-auto"
              disabled={order.status !== 'CAPTURED'}
              onClick={() => {
                fetch(order.productId, pdf.language);
              }}
            >
              {isLoading ? (
                <LoadingSpinnerComponent size="sm" className="text-white" />
              ) : (
                <Download className="mr-2 h-4 w-4" />
              )}
              Download pattern <CountryFlag languageCode={pdf.language} />
            </Button>
          ))}
          <RequestStatus isSuccess={isSuccess} isError={isError} successMessage={''} />
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
