'use client';

import { ShieldEllipsis, ShieldCheck, ShieldClose, XCircle, ShieldQuestion } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { useConfirmMail } from '@/lib/api';
import { LoadingSpinnerComponent } from '@/components/loading-spinner';
import { useEffect, useMemo } from 'react';

interface ConfirmCodeComponentProps {
  verificationType?: string;
  verificationCode?: string;
}

export default function ConfirmCodeComponent({
  verificationCode,
  verificationType,
}: ConfirmCodeComponentProps) {
  const {
    mutate: confirmMail,
    isLoading: confirmMailIsLoading,
    isSuccess: confirmMailsSuccess,
    isError: confirmMailsError,
    data: confirmMailData,
  } = useConfirmMail();

  useEffect(() => {
    if (!verificationCode) {
      return;
    }
    switch (verificationType) {
      case 'UserConfirmEmail':
        confirmMail({
          verificationCode,
        });
        break;
      default:
        break;
    }
  }, [verificationCode, verificationType]);

  const displayName = useMemo(() => {
    switch (verificationType) {
      case 'UserConfirmEmail':
        return 'email';
      default:
        return 'code';
    }
  }, [verificationType]);

  const isLoading = confirmMailIsLoading;
  const isSuccess = confirmMailsSuccess;
  const isError = confirmMailsError;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center">
        <Card>
          <CardHeader>
            <div className="flex justify-center mb-4">
              <ShieldEllipsis className="w-16 h-16 text-primary" aria-hidden="true" />
            </div>
            <CardTitle className="text-2xl font-bold text-center">
              Verification in progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <LoadingSpinnerComponent size={'lg'} />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!verificationType) {
    return (
      <div className="flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <ShieldQuestion className="w-16 h-16 text-primary" aria-hidden="true" />
            </div>
            <CardTitle className="text-2xl font-bold text-center">
              No verification type found
            </CardTitle>
            <CardDescription className="text-center">
              There is currently no verification type set. Verification types are used for e.g.
              confirming mails. Please make sure that you openend the link correctly.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Button asChild>
              <Link href={'/app/secure/auth/me'}>Go to profile</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex justify-center mb-4">
            {isSuccess ? (
              <ShieldCheck className="w-16 h-16 text-green-500" aria-hidden="true" />
            ) : null}
            {isError ? <XCircle className="w-16 h-16 text-red-500" aria-hidden="true" /> : null}
            {!verificationCode ? <ShieldClose className="w-16 h-16" aria-hidden="true" /> : null}
          </div>
          <CardTitle className="text-2xl font-bold text-center">
            {isSuccess ? 'Verification Successful' : null}
            {isError ? 'Verification Failed' : null}
            {!verificationCode ? 'Missing verification code' : null}
          </CardTitle>
          <CardDescription className="text-center">
            {!!confirmMailData ? confirmMailData.successMessage : null}
            {isError ? `We encountered an issue while verifying your ${displayName}.` : null}
            {!verificationCode
              ? 'There is currently no verification code available. Please try to reopen the confirmation link or resend the confirmation mail.'
              : null}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-600">
            {isSuccess
              ? `Thank you for confirming your ${displayName}. You can now proceed to use our services.`
              : null}
            {isError
              ? 'The verification link may have expired or is invalid. Please try the verification process again.'
              : null}
          </p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button asChild>
            <Link href={'/app/secure/auth/me'}>Go to profile</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
