'use client';

import React, { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { GetOrderResponse } from '@/@types/api-types';
import ProductImageSlider from '@/lib/components/ProductImageSlider';
import CreatedByRef from '@/lib/components/CreatedByRef';
import DownloadPatternZipButton from '@/lib/components/DownloadPatternZipButton';
import { InfoBoxComponent } from '@/components/info-box';
import GoBackButton from '@/lib/components/GoBackButton';
import { useSelector } from 'react-redux';
import { Store } from '@/lib/redux/store';
import ProductMetrics from '@/lib/components/ProductMetrics';
import { useGetProduct } from '@/lib/api';
import { LoadingSpinnerComponent } from '@/components/loading-spinner';
import TestingMetrics from '@/lib/components/TestingMetrics';
import ReviewCTA from '@/lib/components/ReviewCTA';
import { Button } from '@/components/ui/button';
import { RefreshCw, X } from 'lucide-react';
import ConfirmDrawer from '@/lib/components/ConfirmDrawer';
import { useDeleteOrder } from '@/lib/api/order';
import { useRouter } from 'next/navigation';
import dayjs from '@/lib/core/dayjs';
import DownloadPatternArea from '@/lib/components/DownloadPatternArea';

interface OrderDetailsProps {
  order: GetOrderResponse;
}

const CANCEL_WINDOW_MINUTES = 15;

function isMinutesAgo(timestamp: string | number | Date) {
  const tenMinutesAgo = dayjs().subtract(CANCEL_WINDOW_MINUTES, 'minute');
  return dayjs(timestamp).isBefore(tenMinutesAgo);
}

export function getCancelCountdownText(updatedAt: string | Date): string {
  const updatedTime = dayjs(updatedAt);
  const expirationTime = updatedTime.add(CANCEL_WINDOW_MINUTES, 'minute');
  const now = dayjs();

  const remainingMs = expirationTime.diff(now);

  if (remainingMs <= 0) {
    return 'This order can no longer be cancelled.';
  }

  const duration = dayjs.duration(remainingMs);
  const minutes = Math.floor(duration.asMinutes());
  const seconds = duration.seconds();

  const timeLeft =
    minutes > 0
      ? `${minutes} minute${minutes !== 1 ? 's' : ''}`
      : `${seconds} second${seconds !== 1 ? 's' : ''}`;

  return `This order can be cancelled in ${timeLeft}.`;
}

export function OrderDetails({ order }: OrderDetailsProps) {
  const [isCancelOrderDialogOpen, setIsCancelOrderDialogOpen] = useState(false);

  const { userId } = useSelector((s: Store) => s.auth);

  const router = useRouter();

  const { fetch: fetchProduct, data: product, isLoading: fetchProductIsLoading } = useGetProduct();
  const { mutate: deleteOrder, isLoading: deleteOrderIsLoading } = useDeleteOrder();

  useEffect(() => {
    fetchProduct(order.productId, false);
  }, [order.productId]);

  const handleDeleteOrder = () => {
    deleteOrder(order.id).then(() => {
      router.push(`/app/products/${order.productId}`);
    });
  };

  if (fetchProductIsLoading) {
    return <LoadingSpinnerComponent />;
  }

  const isPayed = order.status === 'CAPTURED' || order.status === 'COMPLETED';
  const isCreated = order.status === 'CREATED';
  const isPending = order.status === 'PENDING';
  const isSeller = order.seller.id === userId;
  const isCancelable = (isCreated || isPending) && isMinutesAgo(order?.updatedAt);

  return (
    <div className="grid gap-8">
      <GoBackButton />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ProductImageSlider
          imageUrls={order.productImageUrls}
          title={order?.productName ?? 'Pattern images'}
        />
        <div className="space-y-4">
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
            <div className="flex flex-row gap-2 justify-between items-center">
              <Badge
                variant="secondary"
                className={`text-lg${isPayed ? ' bg-green-400 text-white' : ''}`}
              >
                Order Status: {order.status}
              </Badge>
              {!isPayed ? (
                <Button
                  variant={'secondary'}
                  onClick={() => {
                    if (typeof window !== 'undefined') {
                      window.location.reload();
                    }
                  }}
                >
                  <RefreshCw />
                </Button>
              ) : null}
            </div>

            {!isPayed && !isSeller ? (
              <InfoBoxComponent
                severity="info"
                title="Payment Processing May Take a Moment"
                message="If you've already completed your payment, please hang tight - we're waiting for confirmation from our payment provider. You'll receive an email as soon as your payment is confirmed. You can also click the refresh button above to update this page."
              />
            ) : null}
            {isCreated || isPending ? (
              <div className="space-y-2">
                <Button
                  className="w-full"
                  variant={'destructive'}
                  disabled={!isCancelable}
                  onClick={() => setIsCancelOrderDialogOpen(true)}
                >
                  <X />
                  Cancel Order
                </Button>
                {!isCancelable ? (
                  <InfoBoxComponent message={getCancelCountdownText(order.updatedAt)} />
                ) : null}
              </div>
            ) : null}
          </div>
          <div className="space-y-2">
            {!!order.productPrice ? (
              <p>
                <strong>Order price:</strong> {order.productPrice.toFixed(2)}$
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
          {(isPayed || isSeller) && product ? <DownloadPatternArea product={product} /> : null}
          {isSeller ? (
            <div className="flex flex-col gap-2">
              <ProductMetrics productId={order.productId} />
              <TestingMetrics productId={order.productId} />
            </div>
          ) : null}
          {isPayed && !isSeller ? <ReviewCTA productId={order.productId} /> : null}
        </div>
      </div>
      <ConfirmDrawer
        isOpen={isCancelOrderDialogOpen}
        setIsOpen={setIsCancelOrderDialogOpen}
        description={'If you cancel this order, you can still create a new order later.'}
        callbackFn={handleDeleteOrder}
        isLoading={deleteOrderIsLoading}
      />
    </div>
  );
}
