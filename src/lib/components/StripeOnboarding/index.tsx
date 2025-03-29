import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useOnboardStripe } from '@/lib/api';
import { useSelector } from 'react-redux';
import { Store } from '@/lib/redux/store';
import { PlugZap } from 'lucide-react';
import { useRouter } from 'next/navigation';
import ConnectStripeDrawer from '@/lib/components/ConnectStripeDrawer';

export default function StripeOnboarding() {
  const [isOpen, setIsOpen] = useState(false);

  const { userId } = useSelector((s: Store) => s.auth);

  const { mutate, isLoading, isSuccess, isError, errorDetail } = useOnboardStripe();

  const router = useRouter();

  const handleOnboardStripeClick = (userId: string, shareDataToPayPalGranted: boolean) => {
    if (!shareDataToPayPalGranted) {
      return;
    }
    mutate(userId).then((result) => router.push(result.stripeRedirectUrl));
  };

  return (
    <div className="flex flex-col gap-2">
      <Button onClick={() => setIsOpen(true)} disabled={isLoading} variant={'outline'}>
        <PlugZap />
        Connect Stripe
      </Button>
      <ConnectStripeDrawer
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        callbackFn={(shareDataToPayPalGranted) => {
          handleOnboardStripeClick(userId, shareDataToPayPalGranted);
        }}
        isLoading={isLoading}
        isSuccess={isSuccess}
        isError={isError}
        errorDetail={errorDetail}
      />
    </div>
  );
}
