import React, { useState } from 'react';
import { InfoBoxComponent } from '@/components/info-box';
import Link from 'next/link';
import { GetUserResponse } from '@/@types/api-types';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { LoadingSpinnerComponent } from '@/components/loading-spinner';
import { useCancelSubscription } from '@/lib/api/subscription';
import dayjs, { ADVANCED_DATE_FORMAT } from '@/lib/core/dayjs';
import RequestStatus from '@/lib/components/RequestStatus';
import { SUPPORT_EMAIL } from '@/lib/constants';
import { useDispatch } from 'react-redux';
import { reset } from '@/lib/features/auth/authSlice';

interface ProInfoBoxProps {
  user: GetUserResponse;
}

export default function ProInfoBox({ user }: ProInfoBoxProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const dispatch = useDispatch();
  const { mutate, isLoading, isSuccess, isError } = useCancelSubscription();

  const handleCancelSubscriptionClick = async (paypalSubscriptionId?: string) => {
    if (!paypalSubscriptionId) {
      return;
    }
    mutate(paypalSubscriptionId).then(() => {
      dispatch(reset());
    });
  };

  const isCancelled = !!user.paypalSubscriptionValidUntil;

  return (
    <>
      {user.roles?.includes('Pro') ? (
        <InfoBoxComponent
          severity={isCancelled ? 'warning' : 'success'}
          message={
            <span>
              Your Pattern Paradise Pro subscription is active.{' '}
              {isCancelled ? (
                `The subscription will be canceled on ${dayjs(
                  user.paypalSubscriptionValidUntil,
                ).format(ADVANCED_DATE_FORMAT)}.`
              ) : (
                <span
                  className="text-blue-500 underline"
                  onClick={() => {
                    setIsDrawerOpen(true);
                  }}
                >
                  Cancel your subscription here.
                </span>
              )}
            </span>
          }
        />
      ) : (
        <InfoBoxComponent
          severity="info"
          message={
            <span>
              Get access to extended features with{' '}
              <Link href="/pro" className="text-blue-500 underline">
                Pattern Paradise Pro
              </Link>
            </span>
          }
        />
      )}
      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <DrawerContent className="p-4">
          <div className="mx-auto w-full max-w-sm flex flex-col gap-4">
            <DrawerHeader>
              <DrawerTitle>Cancel Pattern Paradise Pro</DrawerTitle>
              <DrawerTitle className="text-sm font-medium">
                You will lose all the premium features of Pattern Paradise Pro after the next
                billing cycle. Patterns and testings you have created with your Pattern Paradise Pro
                subscription will keep all translations, documents and media you have added so far.
              </DrawerTitle>
              <DrawerTitle className="text-sm font-semibold">
                You will automatically logged out and redirected to the login page after canceling
                your Pattern Paradise Pro subscription.
              </DrawerTitle>
            </DrawerHeader>
            <Button
              onClick={() => {
                setIsDrawerOpen(false);
              }}
              variant={'default'}
              disabled={isLoading || isSuccess}
            >
              Continue subscription
            </Button>
            <Button
              onClick={() => {
                handleCancelSubscriptionClick(user.paypalSubscriptionId);
              }}
              disabled={isLoading || isSuccess || !user.paypalSubscriptionId}
              variant={'destructive'}
            >
              {isLoading ? <LoadingSpinnerComponent size="sm" /> : null}
              Cancel subscription
            </Button>
            <RequestStatus
              isSuccess={isSuccess}
              isError={isError}
              successMessage={
                'Your Pattern Paradise Pro subscription has been canceled successfully.'
              }
              errorMessage={
                <span>
                  Something went wrong while canceling your Pattern Paradise Pro subscription. Try
                  to reload the page and check if the subscription is still marked as active in your
                  dashboard. If this error persists, please reach out to use:{' '}
                  <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>
                </span>
              }
            />
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
}
