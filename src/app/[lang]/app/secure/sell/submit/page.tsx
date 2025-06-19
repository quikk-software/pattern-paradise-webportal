'use client';

import { ProductFormComponent } from '@/components/product-form';
import { useGetUser } from '@/lib/api';
import React, { useEffect } from 'react';
import NotFoundPage from '@/app/not-found';
import { LoadingSpinnerComponent } from '@/components/loading-spinner';
import Link from 'next/link';
import { InfoBoxComponent } from '@/components/info-box';
import { useSelector } from 'react-redux';
import { Store } from '@/lib/redux/store';

export default function SellSubmitPage() {
  const { userId } = useSelector((s: Store) => s.auth);

  const { fetch, data: user, isLoading, isError } = useGetUser();

  useEffect(() => {
    fetch(userId);
  }, [userId]);

  if (isError) {
    return <NotFoundPage />;
  }

  if (!user?.paypalMerchantIsActive && !user?.stripeAccountId) {
    return (
      <div className="space-y-8">
        <InfoBoxComponent
          message={
            <>
              In order to create and sell patterns, you must either{' '}
              <Link
                rel={'nofollow'}
                href="/app/secure/auth/me?action=scrollToPayPal"
                className="text-blue-500 underline"
              >
                connect PayPal
              </Link>{' '}
              or{' '}
              <Link
                rel={'nofollow'}
                href="/app/secure/auth/me?action=scrollToStripe"
                className="text-blue-500 underline"
              >
                connect Stripe
              </Link>{' '}
              to your Pattern Paradise account.
            </>
          }
        />
      </div>
    );
  }

  if (isLoading || !user) {
    return (
      <div className="flex justify-center items-center h-svh">
        <LoadingSpinnerComponent />
      </div>
    );
  }

  return <ProductFormComponent user={user} />;
}
