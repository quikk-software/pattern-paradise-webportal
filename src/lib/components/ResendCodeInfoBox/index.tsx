import React, { useState } from 'react';
import { InfoBoxComponent } from '@/components/info-box';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { LoadingSpinnerComponent } from '@/components/loading-spinner';
import RequestStatus from '@/lib/components/RequestStatus';
import { SUPPORT_EMAIL } from '@/lib/constants';
import { useResendCode } from '@/lib/api';

interface ResendCodeInfoBoxProps {
  email: string;
  mailType: string;
  type: string;
}

export default function ResendCodeInfoBox({ email, mailType, type }: ResendCodeInfoBoxProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const { mutate, isLoading, isSuccess, isError } = useResendCode();

  const handleResendCodeClick = async (mailType: string) => {
    if (!mailType) {
      return;
    }
    await mutate({ mailType });
    setIsDrawerOpen(false);
  };

  return (
    <>
      <InfoBoxComponent
        severity={'warning'}
        message={
          <span>
            Your {type} is still pending. Check your mail inbox, or{' '}
            <span
              className="text-blue-500 underline"
              onClick={() => {
                setIsDrawerOpen(true);
              }}
            >
              resend a confirmation mail here.
            </span>
          </span>
        }
      />
      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <DrawerContent className="p-4">
          <div className="flex flex-col gap-4">
            <DrawerHeader>
              <DrawerTitle>Resend {type}</DrawerTitle>
              <DrawerTitle className="text-sm font-medium">
                We will send you an email to <strong>{email}</strong>
              </DrawerTitle>
            </DrawerHeader>
            <Button
              onClick={() => {
                setIsDrawerOpen(false);
              }}
              variant={'outline'}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                handleResendCodeClick(mailType);
              }}
              disabled={isLoading || isSuccess}
              variant={'default'}
            >
              {isLoading ? <LoadingSpinnerComponent size="sm" /> : null}
              Resend {type}
            </Button>
            <RequestStatus
              isSuccess={isSuccess}
              isError={isError}
              errorMessage={
                <span>
                  Something went wrong while sending a new {type} mail. If this error persists,
                  please reach out to use: <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>
                </span>
              }
            />
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
}
