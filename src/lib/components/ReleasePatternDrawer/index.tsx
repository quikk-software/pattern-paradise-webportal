'use client';

import React, { useEffect, useState } from 'react';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { LoadingSpinnerComponent } from '@/components/loading-spinner';
import RequestStatus from '@/lib/components/RequestStatus';
import { useReleaseProduct } from '@/lib/api';
import { useGetTestingByProductId } from '@/lib/api/testing';

interface ReleasePatternDrawerProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  productId: string;
}

export default function ReleasePatternDrawer({
  isOpen,
  setIsOpen,
  productId,
}: ReleasePatternDrawerProps) {
  const [isTestingApproved, setIsTestingApproved] = useState(false);

  const { fetch: fetchTesting, isLoading: fetchTestingIsLoading } = useGetTestingByProductId();
  const {
    mutate: releaseProduct,
    isLoading: releaseProductIsLoading,
    isSuccess: releaseProductIsSuccess,
    isError: releaseProductIsError,
    errorDetail: releaseProductErrorDetails,
  } = useReleaseProduct();

  useEffect(() => {
    fetchTesting(productId).then((testing) => {
      if (testing?.status === 'Approved') {
        setIsTestingApproved(true);
      }
    });
  }, [productId]);

  const handleReleaseProductClick = async (productId: string) => {
    await releaseProduct(productId);
    setIsOpen(false);
    window.location.reload();
  };

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerContent className="p-4">
        <div className="flex flex-col gap-4">
          <DrawerHeader>
            <DrawerTitle>Release Pattern</DrawerTitle>
            {!isTestingApproved ? (
              <DrawerTitle className="text-sm font-medium">
                If you release your pattern yourself without testers approving it in a{' '}
                <Link
                  rel={'nofollow'}
                  href="/app/secure/sell/testings"
                  className="text-blue-500 underline"
                >
                  testing
                </Link>
                , your pattern will be <strong>ranked the lowest</strong> in search results on
                Pattern Paradise.
              </DrawerTitle>
            ) : (
              <DrawerTitle className="text-sm font-medium">
                Congratulations! Your pattern has been approved by your testers and is ready to be
                released.
              </DrawerTitle>
            )}
          </DrawerHeader>
          <Button
            onClick={() => {
              setIsOpen(false);
            }}
            variant={'outline'}
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              handleReleaseProductClick(productId);
            }}
            disabled={releaseProductIsLoading || fetchTestingIsLoading}
            className={`${isTestingApproved ? 'bg-green-500 hover:bg-green-600' : ''}`}
          >
            {releaseProductIsLoading || fetchTestingIsLoading ? (
              <LoadingSpinnerComponent size="sm" />
            ) : null}
            Release Pattern
          </Button>
          <RequestStatus
            isSuccess={releaseProductIsSuccess}
            isError={releaseProductIsError}
            errorMessage={releaseProductErrorDetails}
          />
        </div>
      </DrawerContent>
    </Drawer>
  );
}
