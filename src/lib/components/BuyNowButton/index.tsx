'use client';

import React, { useEffect, useMemo } from 'react';
import { useCaptureOrder, useCreateOrder } from '@/lib/api/order';
import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js';
import logger from '@/lib/core/logger';
import RequestStatus from '@/lib/components/RequestStatus';
import { useRouter } from 'next/navigation';

interface BuyNowButtonProps {
  price: number;
  productId: string;
  callback?: () => void;
}

export function BuyNowButton({ price, productId, callback }: BuyNowButtonProps) {
  const router = useRouter();
  const { mutate: createOrder, isError: createOrderIsError, data: orderData } = useCreateOrder();
  const {
    mutate: captureOrder,
    isSuccess: captureOrderIsSuccess,
    isError: captureOrderIsError,
  } = useCaptureOrder();

  const errorReason = useMemo(() => {
    if (captureOrderIsError) {
      return "We couldn't authorize your payment. Please try again and consider using another PayPal account.";
    } else if (createOrderIsError) {
      return 'Something went wrong while creating your order. Please try again and consider reloading the page.';
    }
  }, [createOrderIsError, captureOrderIsError]);

  useEffect(() => {
    if (!captureOrderIsSuccess || !orderData?.orderId) {
      return;
    }
    router.push(`/auth/me/orders/${orderData.orderId}`);
  }, [captureOrderIsSuccess, orderData]);

  return (
    <PayPalScriptProvider
      options={{ clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID ?? '', currency: 'EUR' }}
    >
      <div className="flex flex-col flex-start mb-6 gap-4">
        <span className="text-3xl font-bold">€{price.toFixed(2)}</span>
        <div className="flex flex-col gap-2">
          <PayPalButtons
            createOrder={async () => {
              try {
                const response = await createOrder({
                  productId,
                });
                return response.paypalOrderId;
              } catch (error) {
                logger.error('Error creating order:', error);
                return '';
              }
            }}
            onApprove={async (data: { orderID: string }) => {
              try {
                await captureOrder(data.orderID);
              } catch (error) {
                logger.error('Error capturing order:', error);
              }
              callback && callback();
            }}
            onError={(err: any) => {
              logger.error('PayPal Buttons Error:', err);
            }}
          />
        </div>
      </div>
      <RequestStatus
        isSuccess={captureOrderIsSuccess}
        isError={createOrderIsError || captureOrderIsError}
        errorMessage={errorReason}
      />
    </PayPalScriptProvider>
  );
}
