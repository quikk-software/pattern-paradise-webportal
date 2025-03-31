'use client';

import { CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import CopyClipboard from '@/lib/components/CopyClipboard';
import RequestStatus from '@/lib/components/RequestStatus';
import React, { useState } from 'react';
import { useGetStripeOnboardingLink, useRemoveStripeReferral } from '@/lib/api';
import { useRouter } from 'next/navigation';
import ConfirmDrawer from '@/lib/components/ConfirmDrawer';
import { useSelector } from 'react-redux';
import { Store } from '@/lib/redux/store';
import { LoadingSpinnerComponent } from '@/components/loading-spinner';

interface StripeConnectionStatusProps {
  stripeAccountId: string;
  stripeOnboardingCompleted: boolean;
}

export default function StripeManagement({
  stripeAccountId,
  stripeOnboardingCompleted,
}: StripeConnectionStatusProps) {
  const [isDisconnectStripeDrawerOpen, setIsDisconnectStripeDrawerOpen] = useState(false);

  const { userId } = useSelector((s: Store) => s.auth);

  const {
    mutate: removeStripeReferral,
    isLoading: removeStripeReferralIsLoading,
    isSuccess: removeStripeReferralIsSuccess,
    isError: removeStripeReferralIsError,
    errorDetail: removeStripeReferralErrorDetail,
  } = useRemoveStripeReferral();
  const {
    fetch: fetchStripeOnboardingLink,
    isLoading: fetchStripeOnboardingLinkIsLoading,
    isSuccess: fetchStripeOnboardingLinkIsSuccess,
    isError: fetchStripeOnboardingLinkIsError,
    errorDetail: fetchStripeOnboardingLinkErrorDetail,
  } = useGetStripeOnboardingLink();

  const router = useRouter();

  const handleDisconnectStripe = (userId: string) => {
    removeStripeReferral(userId).then(() => {
      setIsDisconnectStripeDrawerOpen(false);
      router.push('/app/secure/auth/confirm/stripe/referral-removed');
    });
  };

  const handleOnboardingClick = () => {
    fetchStripeOnboardingLink(userId).then((result) => {
      if (!result?.stripeOnboardingLink) {
        return;
      }
      router.push(result?.stripeOnboardingLink);
    });
  };

  return (
    <>
      <Card className="w-full">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Manage Stripe</CardTitle>
            {stripeAccountId && stripeOnboardingCompleted ? (
              <Badge
                variant="outline"
                className="bg-green-50 text-green-700 border-green-200 px-3 py-1"
              >
                <CheckCircle2 className="mr-1 h-4 w-4" />
                Active
              </Badge>
            ) : null}
          </div>
          <CardDescription>
            Your Stripe account is connected and ready to process payments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <CopyClipboard value={stripeAccountId} title="Stripe Account ID" />
            <div className="flex justify-end">
              <div className="space-y-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.preventDefault();
                    setIsDisconnectStripeDrawerOpen(true);
                  }}
                  className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                >
                  Disconnect Stripe Account
                </Button>
                <RequestStatus
                  isSuccess={removeStripeReferralIsSuccess}
                  isError={removeStripeReferralIsError}
                  errorMessage={removeStripeReferralErrorDetail}
                />
              </div>
            </div>
            {!stripeOnboardingCompleted ? (
              <div className="space-y-1">
                <Button variant="outline" className="w-full" onClick={handleOnboardingClick}>
                  {fetchStripeOnboardingLinkIsLoading ? (
                    <LoadingSpinnerComponent size={`sm`} />
                  ) : null}
                  Complete Onboarding
                </Button>
                <RequestStatus
                  isSuccess={fetchStripeOnboardingLinkIsSuccess}
                  isError={fetchStripeOnboardingLinkIsError}
                  errorMessage={fetchStripeOnboardingLinkErrorDetail}
                />
              </div>
            ) : null}
          </div>
        </CardContent>
      </Card>
      <ConfirmDrawer
        isOpen={isDisconnectStripeDrawerOpen}
        setIsOpen={setIsDisconnectStripeDrawerOpen}
        description="Disconnecting your Stripe account will prevent you from offering Stripe services and products on Pattern Paradise. Do you wish to continue?"
        callbackFn={() => handleDisconnectStripe(userId)}
        isLoading={removeStripeReferralIsLoading}
      />
    </>
  );
}
