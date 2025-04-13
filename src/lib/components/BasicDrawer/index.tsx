import React from 'react';

import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { LoadingSpinnerComponent } from '@/components/loading-spinner';

interface ConfirmDrawerProps {
  isOpen: boolean;
  setIsOpen: (state: boolean) => void;
  isLoading?: boolean;
  callbackFn?: () => void;
  title: string;
  description: string;
  errorDetail?: string;
}

export default function BasicDrawer({
  isOpen,
  setIsOpen,
  isLoading,
  callbackFn,
  title,
  description,
  errorDetail,
}: ConfirmDrawerProps) {
  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerContent className="p-4">
        <div className="flex flex-col gap-4">
          <DrawerHeader>
            <DrawerTitle>{title}</DrawerTitle>
            <DrawerTitle className="text-sm font-medium">{description}</DrawerTitle>
          </DrawerHeader>
          <Button
            onClick={() => {
              callbackFn?.();
              setIsOpen(false);
            }}
            variant={'default'}
            disabled={isLoading}
          >
            {isLoading ? <LoadingSpinnerComponent size="sm" /> : null}
            OK
          </Button>
          {errorDetail ? <p className="text-red-500">{errorDetail}</p> : null}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
