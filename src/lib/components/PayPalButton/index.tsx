'use client';

import React from 'react';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { LoadingSpinnerComponent } from '@/components/loading-spinner';
import { usePayPalOrder } from '@/lib/hooks/usePayPalOrder';
import logger from '@/lib/core/logger';
import CurrencyInput from 'react-currency-input-field';
import { cn } from '@/lib/utils';

interface PayPalButtonProps {
  price: number;
  productId: string;
  hasPayPalBusinessAccount: boolean;
  userId: string;
  disabled?: boolean;
  callback?: (orderId: string) => void;
}

export function PayPalButton({
  price,
  hasPayPalBusinessAccount,
  productId,
  userId,
  disabled,
  callback,
}: PayPalButtonProps) {
  const {
    priceError,
    handleCustomPriceChange,
    handleCreateOrder,
    handleCaptureOrder,
    handleDeleteOrder,
    createOrderIsError,
    captureOrderIsError,
    captureOrderIsSuccess,
    listOrdersByProductIdIsLoading,
    order,
  } = usePayPalOrder(productId, userId, price, callback);

  if (listOrdersByProductIdIsLoading) {
    return <LoadingSpinnerComponent />;
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  };

  return (
    <PayPalScriptProvider
      options={{
        clientId: process.env.NEXT_PUBLIC_PAYPAL_PLATFORM_CLIENT_ID ?? '',
        currency: 'USD',
        disableFunding: hasPayPalBusinessAccount
          ? undefined // Show all available funding sources
          : 'card,bancontact,blik,eps,giropay,ideal,mybank,p24,sepa,sofort,venmo,paylater',
      }}
    >
      <Card className="mx-auto">
        <CardHeader>
          <CardTitle>Complete Your Purchase</CardTitle>
          <CardDescription>Secure payment via PayPal</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!order?.status ? (
            <div className="space-y-2">
              <Label htmlFor="custom-price">Enter custom price (optional)</Label>
              <CurrencyInput
                id="price"
                type="text"
                required={false}
                placeholder={`$${price.toFixed(2)} or more`}
                decimalsLimit={2}
                decimalScale={2}
                allowNegativeValue={false}
                allowDecimals={true}
                onValueChange={(value) => {
                  const updatedValue = Number(value?.replace(',', '.'));
                  handleCustomPriceChange(
                    !!value && !isNaN(updatedValue) ? updatedValue : price,
                    price,
                  );
                }}
                className={cn(
                  'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-md ring-offset-background file:border-0 file:bg-transparent file:text-md file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
                )}
                onKeyDown={handleKeyDown}
              />
              {priceError && <p className="text-sm text-red-500">{priceError}</p>}
            </div>
          ) : (
            <h3>{order?.productPrice ? order.productPrice.toFixed(2) : price.toFixed(2)}$</h3>
          )}
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
