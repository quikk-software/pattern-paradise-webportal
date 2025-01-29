'use client';

import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PASSWORD_REGEX, PASSWORD_REGEX_MESSAGE } from '@/lib/constants';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Rabbit, ShieldCheck } from 'lucide-react';
import { useCreateUser } from '@/lib/api';
import RequestStatus from '@/lib/components/RequestStatus';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import React from 'react';

type FormValues = {
  email: string;
  password: string;
  hasAcceptedTermsAndPrivacy: boolean;
};

interface QuickSignUpProps {
  signupCallback: (isSuccess: boolean) => void;
  redirect?: string;
}

export default function QuickSignUp({ signupCallback, redirect }: QuickSignUpProps) {
  const { mutate, isLoading, isSuccess, isError, errorDetail } = useCreateUser();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormValues>();

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    await mutate({
      email: data.email?.trim(),
      password: data.password?.trim(),
      roles: ['Buyer'],
      hasAcceptedPrivacy: data.hasAcceptedTermsAndPrivacy,
      hasAcceptedTerms: data.hasAcceptedTermsAndPrivacy,
    });

    signupCallback(true);
  };

  if (isSuccess) {
    return (
      <div className="flex justify-center mb-4">
        <ShieldCheck className="w-16 h-16 text-green-500" aria-hidden="true" />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <span className="flex gap-2 items-start text-left">
          <Rabbit />{' '}
          <span className="text-md">
            Quick Sign Up
            <br />
            <span className="text-sm">
              or{' '}
              <Link href={`/auth/login?redirect=${redirect}`} className="text-blue-500 underline">
                login
              </Link>
            </span>
          </span>
        </span>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-full">
          <div className="space-y-2">
            <div className="space-y-1">
              <Input
                id="email"
                type="email"
                placeholder="Enter an email"
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/i,
                    message: 'Invalid email address',
                  },
                  onChange: (e) => {
                    e.target.value = e.target.value.toLowerCase().trim();
                  },
                })}
              />
              {errors.email && (
                <p className="text-sm text-left text-red-500">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <Input
                id="password"
                type="password"
                placeholder="Enter a password"
                {...register('password', {
                  required: 'Password is required',
                  pattern: {
                    value: PASSWORD_REGEX,
                    message: PASSWORD_REGEX_MESSAGE,
                  },
                  onChange: (e) => {
                    e.target.value = e.target.value.trim();
                  },
                })}
              />
              {errors.password && (
                <p className="text-sm text-left text-red-500 mt-1">{errors.password.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex gap-4 items-center">
              <Controller
                name="hasAcceptedTermsAndPrivacy"
                control={control}
                rules={{
                  required:
                    'You must accept the Privacy Policy and Terms and Conditions to proceed',
                }}
                render={({ field }) => (
                  <Checkbox
                    id="hasAcceptedTermsAndPrivacy"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
              <Label htmlFor="hasAcceptedTermsAndPrivacy" className="block text-sm text-left">
                I confirm that I have read and agree to the{' '}
                <Link
                  href="/terms-and-privacy?action=scrollToPrivacyPolicy"
                  target="_blank"
                  className="text-blue-500 underline"
                >
                  Privacy Policy
                </Link>{' '}
                and{' '}
                <Link
                  href="/terms-and-privacy?action=scrollToTermsAndConditions"
                  target="_blank"
                  className="text-blue-500 underline"
                >
                  Terms and Conditions
                </Link>
                .
              </Label>
            </div>
            {errors.hasAcceptedTermsAndPrivacy ? (
              <p className="text-sm text-red-500 mb-2 text-left">
                {errors.hasAcceptedTermsAndPrivacy.message as string}
              </p>
            ) : null}
          </div>

          <RequestStatus isSuccess={isSuccess} isError={isError} errorMessage={errorDetail} />
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Signing up...' : 'Sign up'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
