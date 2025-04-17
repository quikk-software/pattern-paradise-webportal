'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { CreditCard } from 'lucide-react';
import { useCreateIntentOrderStripe, useCreateSessionOrderStripe } from '@/lib/api/order';
import { LoadingSpinnerComponent } from '@/components/loading-spinner';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import StripeCheckoutForm from '@/lib/components/StripeCheckoutForm';
import { useRouter } from 'next/navigation';
import { isInStandaloneMode } from '@/lib/core/utils';

interface StripeButtonProps {
  disabled: boolean;
  productId: string;
  price: number;
  checkoutUrl?: string;
  stripeAccountId?: string;
  country?: string;
}

export default function StripeButton({
  disabled,
  productId,
  price,
  country,
  stripeAccountId,
  checkoutUrl,
}: StripeButtonProps) {
  const [isStandalone, setIsStandalone] = useState(false);

  const {
    mutate: mutateOrderIntent,
    isLoading: mutateOrderIntentIsLoading,
    data: orderIntentResult,
  } = useCreateIntentOrderStripe();
  const { mutate: mutateOrderSession, isLoading: mutateOrderSessionIsLoading } =
    useCreateSessionOrderStripe();

  const router = useRouter();

  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [stripePromise, setStripePromise] = useState<any>(null);

  useEffect(() => {
    setIsStandalone(isInStandaloneMode());
  }, []);

  const handleCheckoutIntentClick = async () => {
    const result = await mutateOrderIntent({
      productId,
      customPrice: price,
      selfSelectedCountry: country,
    });

    if (result?.clientSecret && stripeAccountId && process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY) {
      const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY, {
        stripeAccount: stripeAccountId,
      });

      setStripePromise(stripe);
      setClientSecret(result.clientSecret);
    }
  };

  const handleCheckoutSessionClick = () => {
    if (checkoutUrl) {
      router.push(checkoutUrl);
      return;
    }

    mutateOrderSession({
      productId,
      customPrice: price,
      selfSelectedCountry: country,
    }).then((result) => {
      if (!result?.stripeCheckoutUrl) {
        return;
      }
      router.push(result.stripeCheckoutUrl);
    });
  };

  const isLoading = mutateOrderSessionIsLoading || mutateOrderIntentIsLoading;

  return (
    <div className="space-y-2">
      {!isStandalone && !stripePromise && !clientSecret ? (
        <Button
          onClick={handleCheckoutSessionClick}
          disabled={isLoading || disabled}
          style={{
            position: 'relative',
            width: '100%',
            background: 'linear-gradient(to right, #6772e5, #4d61fc)',
            color: 'white',
            fontWeight: '500',
            padding: '10px 16px',
            borderRadius: '6px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.2)',
            transition: 'all 0.2s',
            border: 'none',
            cursor: isLoading || disabled ? 'not-allowed' : 'pointer',
            opacity: isLoading || disabled ? 0.7 : 1,
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.background = 'linear-gradient(to right, #5469d4, #4257e5)')
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.background = 'linear-gradient(to right, #6772e5, #4d61fc)')
          }
        >
          <span className="flex items-center justify-center gap-2">
            {isLoading ? (
              <LoadingSpinnerComponent size="sm" className="text-white" />
            ) : (
              <CreditCard size="sm" className="text-white" />
            )}
            Checkout with Stripe
          </span>
        </Button>
      ) : null}
      {!stripePromise && !clientSecret ? (
        <Button
          onClick={handleCheckoutIntentClick}
          disabled={isLoading || disabled}
          className="w-full"
        >
          <span className="flex items-center justify-center gap-2">
            {isLoading ? (
              <LoadingSpinnerComponent size="sm" className="text-white" />
            ) : (
              <CreditCard size="sm" className="text-white" />
            )}
            Pay with Credit Card
          </span>
        </Button>
      ) : null}

      {stripePromise && clientSecret && orderIntentResult?.orderId ? (
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <StripeCheckoutForm clientSecret={clientSecret} orderId={orderIntentResult.orderId} />
        </Elements>
      ) : null}
    </div>
  );
}
