'use client';

import React from 'react';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { LoadingSpinnerComponent } from '@/components/loading-spinner';
import RequestStatus from '@/lib/components/RequestStatus';
import { useDraftProduct } from '@/lib/api';

interface DraftPatternDrawerProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  productId: string;
}

export default function DraftPatternDrawer({
  isOpen,
  setIsOpen,
  productId,
}: DraftPatternDrawerProps) {
  const {
    mutate: draftProduct,
    isLoading: draftProductIsLoading,
    isSuccess: draftProductIsSuccess,
    isError: draftProductIsError,
    errorDetail: draftProductErrorDetails,
  } = useDraftProduct();

  const handleDraftProductClick = async (productId: string) => {
    await draftProduct(productId);
    setIsOpen(false);
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerContent className="p-4">
        <div className="flex flex-col gap-4">
          <DrawerHeader>
            <DrawerTitle>Move Pattern to Draft</DrawerTitle>
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
              handleDraftProductClick(productId);
            }}
            disabled={draftProductIsLoading}
          >
            {draftProductIsLoading ? <LoadingSpinnerComponent size="sm" /> : null}
            Draft
          </Button>
          <RequestStatus
            isSuccess={draftProductIsSuccess}
            isError={draftProductIsError}
            errorMessage={draftProductErrorDetails}
          />
        </div>
      </DrawerContent>
    </Drawer>
  );
}
