'use client';

import { ArrowRight, CreditCard, Lock, Shield } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import React from 'react';
import Image from 'next/image';
import PayPalLogo from '@/assets/logos/paypal-logo.png';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

interface PayPalReminderProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export default function PayPalReminder({ open, setOpen }: PayPalReminderProps) {
  const router = useRouter();

  const handleRedirect = () => {
    setOpen(false);
    router.push('/app/secure/auth/me?action=scrollToPayPal');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center justify-center text-center gap-2 text-xl">
            Connect your PayPal account
          </DialogTitle>
          <DialogDescription className="text-center">
            Securely link your PayPal account to accept payments on Pattern Paradise
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col space-y-4">
          <div className="flex justify-center mb-4">
            <Image
              alt="PayPal Logo"
              className="h-8 lg:h-12 w-auto"
              height="51"
              src={PayPalLogo}
              width="200"
            />
          </div>
          <div className="space-y-4">
            <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg">
              <Shield className="h-5 w-5 text-slate-500" />
              <div className="text-sm">Your financial information is never shared with us</div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg">
              <Lock className="h-5 w-5 text-slate-500" />
              <div className="text-sm">Secure connection using industry-standard encryption</div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg">
              <CreditCard className="h-5 w-5 text-slate-500" />
              <div className="text-sm">Easily disconnect your account at any time</div>
            </div>
          </div>
        </div>
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Later
          </Button>
          <Button onClick={handleRedirect} className="gap-2">
            Connect PayPal
            <ArrowRight className="h-4 w-4" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
