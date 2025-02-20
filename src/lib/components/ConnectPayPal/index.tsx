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
import { Regex } from 'lucide-react';
import { EMAIL_REGEX } from '@/lib/constants';

interface ConnectPayPalProps {
  highlight: boolean;
}

export default function ConnectPayPal({ highlight }: ConnectPayPalProps) {
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

  const handleCreatePayPalReferralClick = async (
    userId: string,
    selectedType: 'business' | 'personal',
    shareDataToPayPalGranted: boolean,
    paypalEmail: string,
  ) => {
    const hasPayPalBusinessAccount = selectedType === 'business';
    const result = await createPayPalReferral(userId, {
      hasPayPalBusinessAccount,
      shareDataToPayPalGranted,
      paypalEmail,
    });

    router.push(result.actionUrl);
  };

  const invalidEmail = !EMAIL_REGEX.test(paypalEmail || '');

  return (
    <div className="flex flex-col gap-2">
      {!highlight ? <Label>Connect PayPal</Label> : null}
      <div className="flex flex-col gap-1">
        <Input
          placeholder={'Your PayPal email'}
          value={paypalEmail ?? ''}
          defaultValue={paypalEmail ?? ''}
          onChange={(e) => setPaypalEmail(e.target.value?.toLowerCase().trim())}
        />
        {invalidEmail ? <p className="text-orange-500">Please provide a valid email</p> : null}
      </div>
      <Button
        variant="default"
        onClick={() => setIsConnectPayPalDrawerOpen(true)}
        disabled={createPayPalReferralIsLoading || createPayPalReferralIsSuccess || invalidEmail}
      >
        {createPayPalReferralIsLoading ? (
          <LoadingSpinnerComponent size="sm" className="text-white" />
        ) : null}
        Connect PayPal account
      </Button>
      <p className="text-xs text-muted-foreground">
        ⚠️ Note: You can disconnect your PayPal from Pattern Paradise after connection anytime.
        Please be aware that all your released products will be set to{' '}
        <strong>&apos;Hidden&apos;</strong> status and will no longer be visible to Pattern Paradise
        users after disconnecting.
      </p>
      <ConnectPayPalDrawer
        paypalEmail={paypalEmail}
        isOpen={isConnectPayPalDrawerOpen}
        setIsOpen={setIsConnectPayPalDrawerOpen}
        callbackFn={(selectedType, shareDataToPayPalGranted, paypalEmail) => {
          handleCreatePayPalReferralClick(
            userId,
            selectedType,
            shareDataToPayPalGranted,
            paypalEmail,
          );
        }}
        isLoading={createPayPalReferralIsLoading}
        isSuccess={createPayPalReferralIsSuccess}
        isError={createPayPalReferralIsError}
        errorDetail={createPayPalReferralErrorDetail}
      />
    </div>
  );
}
