'use client';

import { ProductFormComponent } from '@/components/product-form';
import { useGetUser } from '@/lib/api';
import React, { useEffect } from 'react';
import NotFoundPage from '@/app/not-found';
import { LoadingSpinnerComponent } from '@/components/loading-spinner';
import Link from 'next/link';
import { InfoBoxComponent } from '@/components/info-box';

export default function SellSubmitPage() {
  const { fetch, data: user, isLoading, isError } = useGetUser();

  useEffect(() => {
    fetch();
  }, []);

  if (isError) {
    return <NotFoundPage />;
  }

  if (!user?.paypalMerchantIsActive) {
    return (
      <div className="container mx-auto p-6 space-y-8">
        <InfoBoxComponent
          message={
            <>
              In order to create and sell patterns, you must{' '}
              <Link
                href="/app/secure/auth/me?action=scrollToPayPal"
                className="text-blue-500 underline"
              >
                connect PayPal
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
      <div className="flex justify-center items-center h-full">
        <LoadingSpinnerComponent />
      </div>
    );
  }

  return <ProductFormComponent />;
}
