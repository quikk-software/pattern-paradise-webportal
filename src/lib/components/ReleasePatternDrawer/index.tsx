'use client';

import React from 'react';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { LoadingSpinnerComponent } from '@/components/loading-spinner';
import RequestStatus from '@/lib/components/RequestStatus';
import { useReleaseProduct } from '@/lib/api';

interface ReleasePatternDrawerProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  productId: string;
  testingStatus?: string;
}

export default function ReleasePatternDrawer({
  isOpen,
  setIsOpen,
  productId,
  testingStatus,
}: ReleasePatternDrawerProps) {
  const {
    mutate: releaseProduct,
    isLoading: releaseProductIsLoading,
    isSuccess: releaseProductIsSuccess,
    isError: releaseProductIsError,
    errorDetail: releaseProductErrorDetails,
  } = useReleaseProduct();

  const handleReleaseProductClick = async (productId: string) => {
    await releaseProduct(productId);
    setIsOpen(false);
    window.location.reload();
  };

  const isApproved = testingStatus === 'Approved';

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerContent className="p-4">
        <div className="mx-auto w-full max-w-sm flex flex-col gap-4">
          <DrawerHeader>
            <DrawerTitle>Release pattern</DrawerTitle>
            {!isApproved ? (
              <DrawerTitle className="text-sm font-medium">
                If you release your pattern yourself without testers approving it in a{' '}
                <Link href="/app/secure/sell/testings" className="text-blue-500 underline">
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
            disabled={releaseProductIsLoading}
            className={`${isApproved ? 'bg-green-500 hover:bg-green-600' : ''}`}
          >
            {releaseProductIsLoading ? <LoadingSpinnerComponent size="sm" /> : null}
            Release pattern
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
