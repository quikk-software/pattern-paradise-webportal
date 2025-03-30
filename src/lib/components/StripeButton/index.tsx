'use client';

import { Button } from '@/components/ui/button';
import { CreditCard } from 'lucide-react';
import { useCreateOrderStripe } from '@/lib/api/order';
import { LoadingSpinnerComponent } from '@/components/loading-spinner';
import React from 'react';
import { useRouter } from 'next/navigation';

interface StripeButtonProps {
  disabled: boolean;
  productId: string;
  price: number;
  checkoutUrl?: string;
}

export default function StripeButton({
  disabled,
  productId,
  price,
  checkoutUrl,
}: StripeButtonProps) {
  const { mutate, isLoading } = useCreateOrderStripe();

  const router = useRouter();

  const handleCheckoutClick = () => {
    if (checkoutUrl) {
      router.push(checkoutUrl);
      return;
    }

    mutate({
      productId,
      customPrice: price,
    }).then((result) => {
      if (!result?.stripeCheckoutUrl) {
        return;
      }
      router.push(result.stripeCheckoutUrl);
    });
  };

  return (
    <Button
      onClick={handleCheckoutClick}
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
  );
}
