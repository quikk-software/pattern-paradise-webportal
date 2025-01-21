'use client';

import React from 'react';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import QuickSignUp from '@/lib/components/QuickSignUp';

interface QuickSignUpDrawerProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  reason: string;
  signupCallback: (success: boolean) => void;
}

export default function QuickSignUpDrawer({
  isOpen,
  setIsOpen,
  reason,
  signupCallback,
}: QuickSignUpDrawerProps) {
  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerContent className="p-4">
        <div className="mx-auto w-full max-w-sm flex flex-col gap-4">
          <DrawerHeader>
            <DrawerTitle>Quick Signup</DrawerTitle>
            <DrawerTitle className="text-sm font-medium">{reason}</DrawerTitle>
          </DrawerHeader>
          <QuickSignUp signupCallback={signupCallback} />
          <Button
            onClick={() => {
              setIsOpen(false);
            }}
            variant={'destructive'}
          >
            Cancel
          </Button>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
