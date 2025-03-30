'use client';

import React, { useEffect, useState } from 'react';
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
import ReviewCTA from '@/lib/components/ReviewCTA';
import { Button } from '@/components/ui/button';
import { CreditCard, RefreshCw, X } from 'lucide-react';
import ConfirmDrawer from '@/lib/components/ConfirmDrawer';
import { useDeleteOrder } from '@/lib/api/order';
import { useRouter } from 'next/navigation';
import { PayPalOrderProvider } from '@/lib/contexts/PayPalOrderContext';

interface OrderDetailsProps {
  order: GetOrderResponse;
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
    deleteOrder(order.paypalOrderId).then(() => {
      router.push(`/app/products/${order.productId}`);
    });
  };

  if (fetchProductIsLoading) {
    return <LoadingSpinnerComponent />;
  }

  const isPayed =
    order.status === 'CAPTURED' || order.status === 'APPROVED' || order.status === 'COMPLETED';
  const isPending = order.status === 'PENDING';
  const isCreated = order.status === 'CREATED';
  const isSeller = order.seller.id === userId;

  return (
    <div className="grid gap-8">
      <ProductImageSlider
        imageUrls={order.productImageUrls}
        title={order?.productName ?? 'Pattern images'}
      />
      <div className="space-y-4">
        <div className="space-y-2">
          {!!order.productName ? <h1 className="text-3xl font-bold">{order.productName}</h1> : null}
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
            {isPending ? (
              <Button
                variant={'secondary'}
                onClick={() => {
                  window.location.reload();
                }}
              >
                <RefreshCw />
              </Button>
            ) : null}
          </div>

          {isPending && order.stripeCheckoutUrl ? (
            <Button
              onClick={() => {
                router.push(order.stripeCheckoutUrl!);
              }}
              style={{
                position: 'relative',
                background: 'linear-gradient(to right, #6772e5, #4d61fc)',
                color: 'white',
                fontWeight: '500',
                padding: '10px 16px',
                borderRadius: '6px',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.2)',
                transition: 'all 0.2s',
                border: 'none',
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = 'linear-gradient(to right, #5469d4, #4257e5)')
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = 'linear-gradient(to right, #6772e5, #4d61fc)')
              }
            >
              <CreditCard size="sm" className="text-white" />
              Continue Payment with Stripe
            </Button>
          ) : null}

          {isCreated && !isSeller ? (
            <div className="flex flex-col gap-4">
              <InfoBoxComponent
                severity="warning"
                title="One last step"
                message="Please complete your payment with PayPal by clicking on 'Buy Now' below. You'll get access to the pattern immediately after your payment was successful."
              />
              {!!product ? (
                <PayPalOrderProvider
                  productId={product.id}
                  userId={userId}
                  price={order.productPrice}
                >
                  <BuyNowButton product={product} />
                </PayPalOrderProvider>
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
              {order?.paypalOrderId ? (
                <Button variant={'destructive'} onClick={() => setIsCancelOrderDialogOpen(true)}>
                  <X />
                  Cancel Order
                </Button>
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
        {isPayed && !isSeller ? <ReviewCTA productId={order.productId} /> : null}
      </div>
      <GoBackButton />
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
