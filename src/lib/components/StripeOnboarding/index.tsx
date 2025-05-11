import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useOnboardStripe } from '@/lib/api';
import { useSelector } from 'react-redux';
import { Store } from '@/lib/redux/store';
import { PlugZap } from 'lucide-react';
import { useRouter } from 'next/navigation';
import ConnectStripeDrawer from '@/lib/components/ConnectStripeDrawer';
import { isIOSMode } from '@/lib/core/utils';
import { RedirectBrowserDrawer } from '@/lib/components/RedirectBrowserDrawer';

export default function StripeOnboarding() {
  const [isOpen, setIsOpen] = useState(false);
  const [showRedirect, setShowRedirect] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  const { userId } = useSelector((s: Store) => s.auth);

  const { mutate, isLoading, isSuccess, isError, errorDetail } = useOnboardStripe();

  const router = useRouter();

  useEffect(() => {
    setIsStandalone(isIOSMode());
  }, []);

  const handleOnboardStripeClick = (userId: string, shareDataToPayPalGranted: boolean) => {
    if (isStandalone) {
      setIsOpen(false);
      setShowRedirect(true);
      return;
    }

    if (!shareDataToPayPalGranted) {
      return;
    }
    mutate(userId).then((result) => router.push(result.stripeRedirectUrl));
  };

  const handleRedirect = () => {
    window.location.href = `/app/secure/auth/me?action=scrollToStripe`;
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
      <RedirectBrowserDrawer
        isOpen={showRedirect}
        onClose={() => setShowRedirect(false)}
        onRedirect={handleRedirect}
        subtitle={"You'll be redirected to your browser to complete the Stripe onboarding process."}
        description={
          'In order to complete the Stripe onboarding, the process will be completed in your browser.'
        }
      />
    </div>
  );
}
