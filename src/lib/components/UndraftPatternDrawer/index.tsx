'use client';

import React from 'react';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { LoadingSpinnerComponent } from '@/components/loading-spinner';
import RequestStatus from '@/lib/components/RequestStatus';
import { useUndraftProduct } from '@/lib/api';
import { useRouter } from 'next/navigation';

interface UndraftPatternDrawerProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  productId: string;
}

export default function UndraftPatternDrawer({
  isOpen,
  setIsOpen,
  productId,
}: UndraftPatternDrawerProps) {
  const {
    mutate: undraftProduct,
    isLoading: undraftProductIsLoading,
    isSuccess: undraftProductIsSuccess,
    isError: undraftProductIsError,
    errorDetail: undraftProductErrorDetails,
  } = useUndraftProduct();

  const router = useRouter();

  const handleUndraftProductClick = async (productId: string) => {
    await undraftProduct(productId);
    setIsOpen(false);
    router.push(`/app/tester-calls/${productId}`);
  };

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerContent className="p-4">
        <div className="flex flex-col gap-4">
          <DrawerHeader>
            <DrawerTitle>Start Tester Call</DrawerTitle>
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
              handleUndraftProductClick(productId);
            }}
            disabled={undraftProductIsLoading}
          >
            {undraftProductIsLoading ? <LoadingSpinnerComponent size="sm" /> : null}
            Start
          </Button>
          <RequestStatus
            isSuccess={undraftProductIsSuccess}
            isError={undraftProductIsError}
            errorMessage={undraftProductErrorDetails}
          />
        </div>
      </DrawerContent>
    </Drawer>
  );
}
