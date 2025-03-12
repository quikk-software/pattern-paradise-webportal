'use client';

import React from 'react';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { LoadingSpinnerComponent } from '@/components/loading-spinner';
import logger from '@/lib/core/logger';
import { usePayPalOrder } from '@/lib/hooks/usePayPalOrder';

interface PayPalButtonProps {
  price: number;
  disabled?: boolean;
}

export function PayPalButton({ price, disabled }: PayPalButtonProps) {
  const {
    priceError,
    handleCreateOrder,
    handleCaptureOrder,
    handleDeleteOrder,
    createOrderIsError,
    captureOrderIsError,
    captureOrderIsSuccess,
    listOrdersByProductIdIsLoading,
    order,
  } = usePayPalOrder();

  if (listOrdersByProductIdIsLoading) {
    return <LoadingSpinnerComponent />;
  }

  return (
    <PayPalScriptProvider
      options={{
        clientId: process.env.NEXT_PUBLIC_PAYPAL_PLATFORM_CLIENT_ID ?? '',
        currency: 'USD',
        disableFunding:
          'card,bancontact,blik,eps,giropay,ideal,mybank,p24,sepa,sofort,venmo,paylater',
      }}
    >
      <Card className="mx-auto">
        <CardHeader>
          <CardTitle>Complete Your Purchase</CardTitle>
          <CardDescription>Secure payment via PayPal</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <h3>{order?.productPrice ? order.productPrice.toFixed(2) : price.toFixed(2)}$</h3>
          <PayPalButtons
            disabled={disabled || !!priceError}
            createOrder={() => handleCreateOrder(order)}
            onApprove={(data) => handleCaptureOrder(data.orderID)}
            onError={(err: any) => {
              logger.error('PayPal Buttons Error:', err);
            }}
            onCancel={(data) => handleDeleteOrder(data.orderID as string)}
            className="w-full"
          />
        </CardContent>
      </Card>
      {(createOrderIsError || captureOrderIsError) && (
        <Alert variant="destructive" className="mt-4">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {createOrderIsError
              ? 'Failed to create order. Please try again.'
              : 'Failed to process payment. Please try again or use a different PayPal account.'}
          </AlertDescription>
        </Alert>
      )}
      {captureOrderIsSuccess && (
        <Alert className="mt-4">
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>Your order has been successfully processed!</AlertDescription>
        </Alert>
      )}
    </PayPalScriptProvider>
  );
}
