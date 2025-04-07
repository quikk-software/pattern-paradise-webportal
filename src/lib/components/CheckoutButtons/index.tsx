'use client';

import React, { useEffect } from 'react';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { LoadingSpinnerComponent } from '@/components/loading-spinner';
import logger from '@/lib/core/logger';
import { usePayPalOrder } from '@/lib/hooks/usePayPalOrder';
import StripeButton from '@/lib/components/StripeButton';
import PaymentDivider from '@/lib/components/PaymentDivider';
import { GetProductResponse } from '@/@types/api-types';
import { useGetUserById } from '@/lib/api';
import { InfoBoxComponent } from '@/components/info-box';

interface CheckoutButtonProps {
  price: number;
  product: GetProductResponse;
  disabled?: boolean;
}

export function CheckoutButtons({ price, product, disabled }: CheckoutButtonProps) {
  const {
    priceError,
    handleCreateOrder,
    handleDeleteOrder,
    createOrderIsError,
    listOrdersByProductIdIsLoading,
    order,
  } = usePayPalOrder();

  const { fetch, data: seller } = useGetUserById();

  useEffect(() => {
    fetch(product.creatorId).then();
  }, [product.creatorId]);

  if (listOrdersByProductIdIsLoading) {
    return <LoadingSpinnerComponent />;
  }

  return (
    <PayPalScriptProvider
      options={{
        clientId: process.env.NEXT_PUBLIC_PAYPAL_PLATFORM_CLIENT_ID ?? '',
        currency: 'USD',
        disableFunding: 'bancontact,blik,eps,giropay,ideal,mybank,p24,sepa,sofort,venmo,paylater',
      }}
    >
      <Card>
        <CardHeader>
          <CardTitle>Complete Your Purchase</CardTitle>
          <CardDescription>Secure payment</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <h3>
            {price ? price.toFixed(2) : order?.productPrice ? order.productPrice.toFixed(2) : price}
            $
          </h3>
          <div className="space-y-2">
            {seller?.paypalMerchantIsActive ? (
              <PayPalButtons
                disabled={disabled || !!priceError}
                createOrder={() => handleCreateOrder(order)}
                onError={(err: any) => {
                  logger.error('PayPal Buttons Error:', err);
                }}
                onCancel={(data) => handleDeleteOrder(data.orderID as string)}
                className="w-full"
              />
            ) : null}
            {seller?.paypalMerchantIsActive &&
            seller?.stripeMerchantIsActive &&
            seller?.stripeCardPaymentActive ? (
              <PaymentDivider />
            ) : null}
            {seller?.stripeMerchantIsActive && seller?.stripeCardPaymentActive ? (
              <StripeButton
                disabled={disabled || !!priceError}
                productId={product.id}
                price={order?.productPrice ? order?.productPrice : price}
                checkoutUrl={order?.stripeCheckoutUrl}
              />
            ) : null}
            {!seller?.paypalMerchantIsActive && !seller?.stripeMerchantIsActive ? (
              <InfoBoxComponent
                message={"The seller didn't connect payment methods yet."}
                severity={'error'}
              />
            ) : null}
          </div>
        </CardContent>
      </Card>
      {createOrderIsError ? (
        <Alert variant="destructive" className="mt-4">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {createOrderIsError
              ? 'Failed to create order. Please try again.'
              : 'Failed to process payment. Please try again or use a different PayPal account.'}
          </AlertDescription>
        </Alert>
      ) : null}
    </PayPalScriptProvider>
  );
}
