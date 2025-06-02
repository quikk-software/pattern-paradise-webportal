'use client';

import React, { useState } from 'react';
import { Eye, EyeOff, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import useVerificationCode from '@/lib/core/useVerificationCode';
import { useResetPassword } from '@/lib/api';
import { LoadingSpinnerComponent } from '@/components/loading-spinner';
import { PASSWORD_REGEX, PASSWORD_REGEX_MESSAGE } from '@/lib/constants';
import RequestStatus from '@/lib/components/RequestStatus';
import Link from 'next/link';
import { PasswordValidationChecklist } from '@/lib/components/PasswordValidationChecklist';

export default function ResetPasswordComponent() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const { verificationCode } = useVerificationCode();
  const { mutate, isLoading, isSuccess, isError, errorDetail } = useResetPassword();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!verificationCode) {
      setError('No verification code found. Please make sure to open the link in your email.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (!PASSWORD_REGEX.test(password)) {
      setError(PASSWORD_REGEX_MESSAGE);
      return;
    }

    await mutate({
      verificationCode,
      newPassword: password,
    });

    setError('');
  };

  const disabled =
    isLoading || isSuccess || !password || !confirmPassword || password !== confirmPassword;

  return (
    <Card className="w-full">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">Reset Password</CardTitle>
        <CardDescription className="text-center">Enter your new password below</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="new-password">New Password</Label>
            <Input
              id="new-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pr-10"
              placeholder="Enter your new password"
            />
            <PasswordValidationChecklist password={password} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirm Password</Label>
            <Input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your new password"
            />
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
        </CardContent>
        <CardFooter className="flex flex-col gap-4 items-start">
          <Button className="w-full" type="submit" disabled={disabled} onClick={handleSubmit}>
            {isLoading ? (
              <LoadingSpinnerComponent size="sm" className="text-white mr-2" />
            ) : (
              <Lock className="w-4 h-4 mr-2" />
            )}
            Reset Password
          </Button>
          <RequestStatus
            isSuccess={isSuccess}
            isError={isError}
            successMessage={
              <span className="text-left">
                Your password has been updated successfully. You can now use it to{' '}
                <Link href="/%5Blang%5D/auth/login" className="text-blue-500 underline">
                  login to Pattern Paradise
                </Link>
                .
              </span>
            }
            errorMessage={
              <span>
                You might already used this link. You can request a new password mail on the{' '}
                <Link href="/%5Blang%5D/auth/login" className="text-blue-500 underline">
                  login page
                </Link>
                .
              </span>
            }
          />
        </CardFooter>
      </form>
    </Card>
  );
}
