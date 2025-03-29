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
import StripeLogo from '@/assets/logos/stripe-logo.png';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

interface PayPalReminderProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export default function PaymentProviderReminder({ open, setOpen }: PayPalReminderProps) {
  const router = useRouter();

  const handlePayPalRedirect = () => {
    setOpen(false);
    router.push('/app/secure/auth/me?action=scrollToPayPal');
  };

  const handleStripeRedirect = () => {
    setOpen(false);
    router.push('/app/secure/auth/me?action=scrollToStripe');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center justify-center text-center gap-2 text-xl">
            Connect a Payment Provider
          </DialogTitle>
          <DialogDescription className="text-center">
            Securely link your PayPal or Stripe account to accept payments on Pattern Paradise
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col space-y-4">
          <div className="flex gap-8 justify-center items-center mb-4">
            <Image
              alt="PayPal Logo"
              className="h-8 lg:h-12 w-auto"
              height="51"
              src={PayPalLogo}
              width="200"
            />
            <Image
              alt="Stripe Logo"
              className="h-8 lg:h-12 w-auto"
              height="51"
              src={StripeLogo}
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
        <div className="flex flex-col gap-2">
          <div className="grid grid-cols-2 gap-2">
            <Button
              onClick={handlePayPalRedirect}
              className="gap-2"
              style={{
                position: 'relative',
                width: '100%',
                background: '#0070ba',
                color: 'white',
                fontWeight: '500',
                padding: '10px 16px',
                borderRadius: '6px',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.2)',
                transition: 'all 0.2s',
                border: 'none',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = '#005ea6')}
              onMouseLeave={(e) => (e.currentTarget.style.background = '#005ea6')}
            >
              Connect PayPal
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button
              onClick={handleStripeRedirect}
              className="gap-2"
              style={{
                position: 'relative',
                width: '100%',
                background: 'linear-gradient(to right, #6772e5, #4d61fc)',
                color: 'white',
                fontWeight: '500',
                padding: '10px 16px',
                borderRadius: '6px',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.2)',
                transition: 'all 0.2s',
                border: 'none',
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = 'linear-gradient(to right, #5469d4, #4257e5)')
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = 'linear-gradient(to right, #6772e5, #4d61fc)')
              }
            >
              Connect Stripe
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Later
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
