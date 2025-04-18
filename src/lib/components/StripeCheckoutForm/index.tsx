'use client';

import React, { useState } from 'react';
import {
  useStripe,
  useElements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
} from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { LoadingSpinnerComponent } from '@/components/loading-spinner';
import { CreditCard } from 'lucide-react';

const stripeStyle = {
  base: {
    fontSize: '1.25rem',
    fontFamily: 'var(--font-sans)',
    color: 'hsl(var(--foreground))',
    '::placeholder': {
      color: '#a0aec0',
    },
  },
  invalid: {
    color: 'hsl(var(--destructive))',
    iconColor: 'hsl(var(--destructive))',
  },
};

interface StripeCheckoutFormProps {
  clientSecret: string;
  orderId: string;
}

export default function StripeCheckoutForm({ clientSecret, orderId }: StripeCheckoutFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const router = useRouter();
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cardNumberElement = elements?.getElement(CardNumberElement);
    const cardExpiryElement = elements?.getElement(CardExpiryElement);
    const cardCvcElement = elements?.getElement(CardCvcElement);

    if (!stripe || !elements || !cardNumberElement || !cardExpiryElement || !cardCvcElement) {
      setError('Payment form is not ready yet. Please try again.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardNumberElement,
      },
    });

    if (result.error) {
      setError(result.error.message || 'Payment failed.');
    } else if (result.paymentIntent?.status === 'succeeded') {
      setSuccess(true);
      router.push(`/app/secure/auth/me/orders/${orderId}`);
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <div>
          <label className="block text-sm font-medium mb-1">Card Number</label>
          <div className="border border-input bg-background rounded-md px-3 py-2 focus-within:ring-2 focus-within:ring-ring">
            <CardNumberElement options={{ style: stripeStyle }} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Expiration</label>
            <div className="border border-input bg-background rounded-md px-3 py-2 focus-within:ring-2 focus-within:ring-ring">
              <CardExpiryElement options={{ style: stripeStyle }} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">CVC</label>
            <div className="border border-input bg-background rounded-md px-3 py-2 focus-within:ring-2 focus-within:ring-ring">
              <CardCvcElement options={{ style: stripeStyle }} />
            </div>
          </div>
        </div>
      </div>
      <Button
        type="submit"
        disabled={!stripe || loading || success}
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
          cursor: loading ? 'not-allowed' : 'pointer',
          opacity: loading ? 0.7 : 1,
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.background = 'linear-gradient(to right, #5469d4, #4257e5)')
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.background = 'linear-gradient(to right, #6772e5, #4d61fc)')
        }
      >
        <span className="flex items-center justify-center gap-2">
          {loading ? (
            <LoadingSpinnerComponent size="sm" className="text-white" />
          ) : (
            <CreditCard size="sm" className="text-white" />
          )}
          Pay Now
        </span>
      </Button>
      {error ? <p className="text-red-500 text-sm">{error}</p> : null}
    </form>
  );
}
