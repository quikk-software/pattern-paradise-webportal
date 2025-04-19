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
import { useRouter } from 'next/navigation';
import { EasterEgg } from '@/lib/components/EasterEgg';

interface CheckoutButtonProps {
  price: number;
  product: GetProductResponse;
  disabled?: boolean;
  country?: string;
}

export function CheckoutButtons({ price, product, disabled, country }: CheckoutButtonProps) {
  const {
    priceError,
    handleCreateOrder,
    handleDeleteOrder,
    createOrderIsError,
    listOrdersByProductIdIsLoading,
    order,
  } = usePayPalOrder();

  const { fetch, data: seller } = useGetUserById();

  const router = useRouter();

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
          <CardTitle>
            Complete Your Purchase{' '}
            <EasterEgg eventCampaignId={'00000000-0000-0000-0000-000000000001'} size={'xs'} />
          </CardTitle>
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
                onApprove={async (result) => {
                  router.push(
                    `/app/secure/auth/me/orders/confirmation/success?orderId=${result.orderID}`,
                  );
                }}
                onError={(err: any) => {
                  logger.error('PayPal Buttons Error:', err);
                }}
                onCancel={async (data) => {
                  await handleDeleteOrder(data.orderID as string);
                  if (typeof window !== 'undefined') {
                    window.location.reload();
                  }
                }}
                className="w-full"
              />
            ) : null}
            {seller?.paypalMerchantIsActive &&
            seller?.stripeMerchantIsActive &&
            seller?.stripeCardPaymentActive ? (
              <PaymentDivider />
            ) : null}
            {seller?.stripeMerchantIsActive &&
            seller?.stripeCardPaymentActive &&
            product?.stripeAccountId ? (
              <StripeButton
                disabled={disabled || !!priceError}
                productId={product.id}
                price={order?.productPrice ? order?.productPrice : price}
                country={country}
                stripeAccountId={product.stripeAccountId}
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
