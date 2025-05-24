import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js';
import logger from '@/lib/core/logger';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useRouter } from 'next/navigation';
import { useCreateMysteryOrderPayPal, useDeleteOrder } from '@/lib/api/order';
import CountrySelect from '@/lib/components/CountrySelect';
import { useValidSession } from '@/hooks/useValidSession';
import QuickSignUp from '@/lib/components/QuickSignUp';
import { isIOSMode } from '@/lib/core/utils';
import { RedirectBrowserDrawer } from '@/lib/components/RedirectBrowserDrawer';

interface BuyMysteryButtonProps {
  category: string;
}

export default function BuyMysteryButton({ category }: BuyMysteryButtonProps) {
  const [country, setCountry] = useState<string | undefined>(undefined);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isRedirectOpen, setIsRedirectOpen] = useState(false);

  const countryRef = useRef<string | undefined>(undefined);

  useEffect(() => {
    countryRef.current = country;
  }, [country]);

  useEffect(() => {
    setIsStandalone(isIOSMode());
  }, []);

  useEffect(() => {
    setIsRedirectOpen(isStandalone);
  }, [isStandalone]);

  const {
    mutate: createMysteryOrder,
    isError: createMysteryOrderIsError,
    errorDetail,
  } = useCreateMysteryOrderPayPal();
  const { mutate: deleteOrder } = useDeleteOrder();

  const router = useRouter();
  const { status } = useValidSession();

  const handleCreateMysteryOrder = async () => {
    const response = await createMysteryOrder({
      category,
      selfSelectedCountry: countryRef.current,
    });

    return response?.paypalOrderId;
  };

  const handleCountryChange = (value: string) => {
    setCountry(value);
  };

  const handleRedirect = () => {
    window.location.href = '/app/products/mystery-patterns/pattern';
  };

  const isLoggedIn = status === 'authenticated';

  if (!isLoggedIn) {
    return (
      <div className="flex flex-col gap-4">
        <div className="space-y-2">
          <h3 className="text-xl font-semibold">Almost there!🎉</h3>
          <p>
            You&apos;re just one step away from getting your mystery pattern!
            <br />
            <br />
            Simply sign up to complete your purchase. Quick, easy, and totally worth it!
          </p>
        </div>
        <QuickSignUp redirect={`${encodeURIComponent(`/app/products/mystery-patterns/pattern`)}`} />
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {isStandalone ? (
        <RedirectBrowserDrawer
          isOpen={isRedirectOpen}
          onClose={() => setIsRedirectOpen(false)}
          onRedirect={handleRedirect}
          subtitle={"You'll be redirected to your browser."}
          description={
            'To order a mystery pattern, the payment process will be completed in your browser.'
          }
        />
      ) : (
        <>
          <div className="space-y-1">
            <CountrySelect country={country} handleCountryChange={handleCountryChange} fullWidth />
            <p className="text-xs text-muted-foreground">
              ⚠️ Note: Selecting your current country helps the seller calculate the correct taxes
              for your purchase.{' '}
              <strong>
                Please select the country where you are physically located when buying this pattern.
              </strong>
            </p>
            <p className="text-xs text-muted-foreground italic">
              This should be the country you&apos;re in at the moment of purchase - not necessarily
              your country of residence.
            </p>
          </div>
          <PayPalScriptProvider
            options={{
              clientId: process.env.NEXT_PUBLIC_PAYPAL_PLATFORM_CLIENT_ID ?? '',
              currency: 'USD',
              disableFunding:
                'bancontact,blik,eps,giropay,ideal,mybank,p24,sepa,sofort,venmo,paylater',
            }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Complete Your Purchase</CardTitle>
                <CardDescription>Secure payment</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <h3>3.00$</h3>
                <div className="space-y-2">
                  <PayPalButtons
                    createOrder={() => handleCreateMysteryOrder()}
                    onApprove={async (result) => {
                      router.push(
                        `/app/secure/auth/me/orders/confirmation/success?orderId=${result.orderID}`,
                      );
                    }}
                    onError={(err: any) => {
                      logger.error('PayPal Buttons Error:', err);
                    }}
                    onCancel={async (data) => {
                      await deleteOrder(data.orderID as string);
                      if (typeof window !== 'undefined') {
                        window.location.reload();
                      }
                    }}
                    className="w-full"
                  />
                </div>
              </CardContent>
            </Card>
            {createMysteryOrderIsError ? (
              <Alert variant="destructive" className="mt-4">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                  {errorDetail
                    ? `Failed to create order: ${errorDetail}`
                    : 'Failed to process payment. Please try again or use a different PayPal account.'}
                </AlertDescription>
              </Alert>
            ) : null}
          </PayPalScriptProvider>
        </>
      )}
    </div>
  );
}
