'use client';

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

interface GoogleLoginUnavailableDrawerProps {
  open: boolean;
  onClose: () => void;
  onLogin: () => void;
  onResetPassword: () => void;
}

export default function GoogleLoginUnavailableDrawer({
  open,
  onClose,
  onLogin,
  onResetPassword,
}: GoogleLoginUnavailableDrawerProps) {
  return (
    <Drawer open={open} onOpenChange={onClose}>
      <DrawerContent className="rounded-t-2xl p-6 shadow-lg space-y-6">
        <DrawerHeader className="text-center space-y-2">
          <div className="flex justify-center">
            <AlertTriangle className="w-10 h-10 text-yellow-500" />
          </div>
          <DrawerTitle className="text-xl font-semibold">Google Login Not Available</DrawerTitle>
          <DrawerDescription className="text-gray-600">
            We&apos;re currently unable to support Google login inside the app. You can still log in
            using your email and password.
            <br />
            <br />
            If you haven’t set a password yet, don’t worry - you can request a reset and set one
            now.
          </DrawerDescription>
        </DrawerHeader>

        <DrawerFooter className="flex flex-col gap-3">
          <Button size="lg" className="w-full" onClick={onLogin}>
            Log In with Password
          </Button>
          <Button variant="outline" size="lg" className="w-full" onClick={onResetPassword}>
            Request Password Reset
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
