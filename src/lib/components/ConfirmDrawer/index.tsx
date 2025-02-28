import React from 'react';

import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { LoadingSpinnerComponent } from '@/components/loading-spinner';

interface ConfirmDrawerProps {
  isOpen: boolean;
  setIsOpen: (state: boolean) => void;
  isLoading?: boolean;
  callbackFn?: () => void;
  description: string;
  errorDetail?: string;
}

export default function ConfirmDrawer({
  isOpen,
  setIsOpen,
  isLoading,
  callbackFn,
  description,
  errorDetail,
}: ConfirmDrawerProps) {
  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerContent className="p-4">
        <div className="flex flex-col gap-4">
          <DrawerHeader>
            <DrawerTitle>Are you sure?</DrawerTitle>
            <DrawerTitle className="text-sm font-medium">{description}</DrawerTitle>
          </DrawerHeader>
          <Button
            onClick={() => {
              setIsOpen(false);
            }}
            variant={'outline'}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button onClick={() => callbackFn?.()} variant={'destructive'} disabled={isLoading}>
            {isLoading ? <LoadingSpinnerComponent size="sm" /> : null}
            OK
          </Button>
          {errorDetail ? <p className="text-red-500">{errorDetail}</p> : null}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
