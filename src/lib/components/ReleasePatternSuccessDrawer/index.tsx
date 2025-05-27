'use client';

import React from 'react';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

interface ReleasePatternSuccessDrawerProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  productId?: string;
}

export default function ReleasePatternSuccessDrawer({
  isOpen,
  setIsOpen,
  productId,
}: ReleasePatternSuccessDrawerProps) {
  const router = useRouter();

  if (!productId) {
    return null;
  }

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerContent className="p-4">
        <div className="flex flex-col gap-4">
          <DrawerHeader>
            <DrawerTitle>Pattern Released 🎉</DrawerTitle>
            <DrawerTitle className="text-sm font-medium">
              Congratulations! Your pattern has been released and will be prioritized in search
              results on Pattern Paradise.
            </DrawerTitle>
          </DrawerHeader>
          <Button
            onClick={() => {
              setIsOpen(false);
              if (typeof window !== 'undefined') {
                window.location.reload();
              }
            }}
            variant={'outline'}
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              setIsOpen(false);
              router.push(`/app/products/${productId}`);
            }}
            variant={'default'}
          >
            Visit listing
          </Button>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
