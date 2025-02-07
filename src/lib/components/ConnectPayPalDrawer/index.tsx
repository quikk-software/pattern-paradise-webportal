import React, { useState } from 'react';

import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { LoadingSpinnerComponent } from '@/components/loading-spinner';
import PayPalAccountSelector from '../../../../paypal-account-selector';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import RequestStatus from '@/lib/components/RequestStatus';

interface ConfirmDrawerProps {
  isOpen: boolean;
  setIsOpen: (state: boolean) => void;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  callbackFn?: (selectedType: 'business' | 'personal', shareDataToPayPalGranted: boolean) => void;
}

export default function ConnectPayPalDrawer({
  isOpen,
  setIsOpen,
  isLoading,
  isSuccess,
  isError,
  callbackFn,
}: ConfirmDrawerProps) {
  const [selectedType, setSelectedType] = useState<'business' | 'personal' | null>(null);
  const [shareDataToPayPalGranted, setShareDataToPayPalGranted] = useState(false);

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerContent className="p-4">
        <div className="flex flex-col gap-4">
          <DrawerHeader>
            <DrawerTitle>Connect PayPal</DrawerTitle>
            <DrawerTitle className="text-sm font-medium">
              You&apos;re almost ready to receive payments via Pattern Paradise with our payment
              service provider PayPal and take your Pattern business to the next level.
            </DrawerTitle>
          </DrawerHeader>
          <PayPalAccountSelector selectedType={selectedType} setSelectedType={setSelectedType} />
          <div className="flex gap-2">
            <Checkbox
              id="share-data-to-paypal-checkbox"
              checked={shareDataToPayPalGranted}
              onCheckedChange={() =>
                setShareDataToPayPalGranted((shareDataToPayPalGranted) => !shareDataToPayPalGranted)
              }
            />
            <Label htmlFor="share-data-to-paypal-checkbox" className="block text-sm">
              I authorize Pattern Paradise to share my personal data with{' '}
              <Link href="https://paypal.com" target="_blank" className="text-blue-500 underline">
                PayPal
              </Link>
              .
            </Label>
          </div>
          <Button
            onClick={() => {
              setIsOpen(false);
            }}
            variant={'outline'}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              if (!selectedType || !shareDataToPayPalGranted) {
                return;
              }
              callbackFn?.(selectedType, shareDataToPayPalGranted);
            }}
            variant={'default'}
            disabled={isLoading || !selectedType || !shareDataToPayPalGranted}
          >
            {isLoading ? <LoadingSpinnerComponent size="sm" /> : null}
            Connect PayPal
          </Button>
          <RequestStatus
            isSuccess={isSuccess}
            isError={isError}
            errorMessage={
              <span>
                Connecting your PayPal account failed. If this error persists,{' '}
                <Link href="/help" className="text-blue-500 underline">
                  please contact us
                </Link>
                .
              </span>
            }
          />
        </div>
      </DrawerContent>
    </Drawer>
  );
}
