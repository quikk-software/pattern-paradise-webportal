import React, { useEffect, useState } from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { LoadingSpinnerComponent } from '@/components/loading-spinner';
import ConnectPayPalDrawer from '@/lib/components/ConnectPayPalDrawer';
import { useCreatePayPalReferral } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { Store } from '@/lib/redux/store';
import { Input } from '@/components/ui/input';
import { EMAIL_REGEX } from '@/lib/constants';
import { PlugZap } from 'lucide-react';

interface ConnectPayPalProps {
  buttonTheme?: string;
  inputTheme?: string;
}

export default function ConnectPayPal({ buttonTheme, inputTheme }: ConnectPayPalProps) {
  const [isConnectPayPalDrawerOpen, setIsConnectPayPalDrawerOpen] = useState(false);
  const [paypalEmail, setPaypalEmail] = useState<string | undefined>(undefined);

  const { userId, email } = useSelector((s: Store) => s.auth);

  const router = useRouter();

  const {
    mutate: createPayPalReferral,
    isLoading: createPayPalReferralIsLoading,
    isSuccess: createPayPalReferralIsSuccess,
    isError: createPayPalReferralIsError,
    errorDetail: createPayPalReferralErrorDetail,
    data: paypalReferralData,
  } = useCreatePayPalReferral();

  useEffect(() => {
    setPaypalEmail(email);
  }, [email]);

  useEffect(() => {
    if (!createPayPalReferralIsSuccess || !paypalReferralData) {
      return;
    }
    router.push(paypalReferralData.actionUrl);
  }, [createPayPalReferralIsSuccess, paypalReferralData, router]);

  const handleCreatePayPalReferralClick = (
    userId: string,
    shareDataToPayPalGranted: boolean,
    paypalEmail: string,
  ) => {
    createPayPalReferral(userId, {
      shareDataToPayPalGranted,
      paypalEmail,
    }).then((result) => router.push(result.actionUrl));
  };

  const invalidEmail = !EMAIL_REGEX.test(paypalEmail || '');

  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="flex flex-col gap-1">
        <Input
          placeholder={'Your PayPal email'}
          value={paypalEmail ?? ''}
          defaultValue={paypalEmail ?? ''}
          onChange={(e) => setPaypalEmail(e.target.value?.toLowerCase().trim())}
          className={inputTheme}
        />
        {invalidEmail ? <p className="text-orange-500">Please provide a valid email</p> : null}
      </div>
      <Button
        variant="outline"
        className={buttonTheme}
        onClick={() => setIsConnectPayPalDrawerOpen(true)}
        disabled={createPayPalReferralIsLoading || createPayPalReferralIsSuccess || invalidEmail}
      >
        {createPayPalReferralIsLoading ? (
          <LoadingSpinnerComponent size="sm" className="text-white" />
        ) : (
          <PlugZap />
        )}
        Connect PayPal
      </Button>
      <ConnectPayPalDrawer
        paypalEmail={paypalEmail}
        isOpen={isConnectPayPalDrawerOpen}
        setIsOpen={setIsConnectPayPalDrawerOpen}
        callbackFn={(shareDataToPayPalGranted, paypalEmail) => {
          handleCreatePayPalReferralClick(userId, shareDataToPayPalGranted, paypalEmail);
        }}
        isLoading={createPayPalReferralIsLoading}
        isSuccess={createPayPalReferralIsSuccess}
        isError={createPayPalReferralIsError}
        errorDetail={createPayPalReferralErrorDetail}
      />
    </div>
  );
}
