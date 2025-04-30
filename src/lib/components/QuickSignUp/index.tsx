'use client';

import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { EMAIL_REGEX, PASSWORD_REGEX, PASSWORD_REGEX_MESSAGE } from '@/lib/constants';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Rabbit, ShieldCheck } from 'lucide-react';
import { useCreateUser } from '@/lib/api';
import RequestStatus from '@/lib/components/RequestStatus';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import React, { useState } from 'react';
import { PasswordValidationChecklist } from '@/lib/components/PasswordValidationChecklist';
import useAuth from '@/lib/auth/useAuth';
import { signIn } from 'next-auth/react';
import Image from 'next/image';
import GoogleLogo from '@/assets/logos/google-logo.svg';

type FormValues = {
  email: string;
  password: string;
  hasAcceptedTermsAndPrivacy: boolean;
};

interface QuickSignUpProps {
  redirect?: string;
}

export default function QuickSignUp({ redirect }: QuickSignUpProps) {
  const [isLoading, setIsLoading] = useState(false);

  const { mutate, isSuccess, isError, errorDetail } = useCreateUser();

  const {
    handleLogin,
    loginStates: { isSuccess: loginIsSuccess, isError: loginIsError },
  } = useAuth();

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<FormValues>();

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsLoading(true);
    try {
      const email = data.email?.toLowerCase().trim();
      const password = data.password?.trim();
      const affiliate = sessionStorage.getItem('affiliate') ?? undefined;

      await mutate({
        email,
        password,
        roles: ['Buyer', 'Tester'],
        hasAcceptedPrivacy: data.hasAcceptedTermsAndPrivacy,
        hasAcceptedTerms: data.hasAcceptedTermsAndPrivacy,
        affiliate: affiliate?.trim(),
      });

      await handleLogin(email, password);

      if (typeof window !== 'undefined') {
        if (redirect) {
          window.location.replace(decodeURIComponent(redirect));
        } else {
          window.location.reload();
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const password = watch('password');

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
              <Link
                rel={'nofollow'}
                href={`/auth/login?redirect=${redirect}`}
                className="text-blue-500 underline"
              >
                login
              </Link>
            </span>
          </span>
        </span>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
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
                    value: EMAIL_REGEX,
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
              {password ? <PasswordValidationChecklist password={password} /> : null}
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
                  rel={'nofollow'}
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

          <RequestStatus
            isSuccess={isSuccess}
            isError={isError}
            successMessage={'Registration successful'}
            errorMessage={errorDetail}
          />
          <RequestStatus
            isSuccess={loginIsSuccess}
            isError={loginIsError}
            successMessage={'Login successful'}
            errorMessage={
              <span>
                Login failed, but your registration was successful. Please try to{' '}
                <Link
                  rel={'nofollow'}
                  href={`/auth/login?redirect=${redirect}`}
                  className="text-blue-500 underline"
                >
                  Log In
                </Link>{' '}
                manually, or{' '}
                <Link href="/help" className="text-blue-500 underline">
                  Contact Us
                </Link>{' '}
                for further assistance.
              </span>
            }
          />
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Signing up...' : 'Sign up'}
          </Button>
        </form>
        <Button
          onClick={() => signIn('keycloak-google')}
          className="w-full flex items-center justify-center gap-2 bg-white shadow hover:shadow-md hover:bg-gray-50 transition duration-150"
        >
          <Image src={GoogleLogo} alt="Google Logo" className="w-5 h-5" width={50} height={50} />
          <span className="text-sm font-medium text-gray-700">Login with Google</span>
        </Button>
      </CardContent>
    </Card>
  );
}
