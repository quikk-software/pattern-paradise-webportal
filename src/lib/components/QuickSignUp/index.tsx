'use client';

import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { EMAIL_REGEX, PASSWORD_REGEX, PASSWORD_REGEX_MESSAGE } from '@/lib/constants';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Check, Rabbit, ShieldCheck, X } from 'lucide-react';
import { useCheckEmail, useCreateUser } from '@/lib/api';
import RequestStatus from '@/lib/components/RequestStatus';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { PasswordValidationChecklist } from '@/lib/components/PasswordValidationChecklist';
import useAuth from '@/lib/auth/useAuth';
import GoogleLoginButton from '@/lib/components/GoogleLoginButton';
import { motion } from 'framer-motion';
import logger from '@/lib/core/logger';

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
  const [debouncedEmail, setDebouncedEmail] = useState('');

  const { mutate, isSuccess, isError, errorDetail } = useCreateUser();
  const {
    mutate: checkEmail,
    isSuccess: checkEmailIsSuccess,
    isError: checkEmailIsError,
    errorDetail: checkEmailErrorDetail,
  } = useCheckEmail();

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

  const email = watch('email');
  const password = watch('password');

  useEffect(() => {
    if (!debouncedEmail) {
      return;
    }
    checkEmail(debouncedEmail).then();
  }, [debouncedEmail]);

  useEffect(() => {
    const timerId = setTimeout(() => {
      if (email) {
        setDebouncedEmail(email.toLowerCase().trim());
      }
    }, 500);

    return () => clearTimeout(timerId);
  }, [email]);

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
        hasAgreedToNewsletter: false,
        affiliate: affiliate?.trim(),
      });

      await handleLogin(email, password, false);

      await sessionStorage.removeItem('affiliate');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!loginIsSuccess || !redirect) return;

    try {
      const decoded = decodeURIComponent(redirect);
      const url = `${process.env.NEXT_PUBLIC_URL ?? ''}${decoded}`;
      window.location.replace(url);
    } catch (err) {
      logger.error('Redirect decode error:', err);
    }
  }, [loginIsSuccess, redirect]);

  if (isSuccess) {
    return (
      <Card className="mb-4">
        <CardContent className="flex flex-col justify-center items-center gap-2 mt-6">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <ShieldCheck className="w-16 h-16 text-green-500" aria-hidden="true" />
          </motion.div>
          <p className="text-sm">You&apos;ll be logged in a second...</p>
          {redirect ? (
            <p className="text-sm text-gray-500 text-center mt-2">
              If you&apos;re not automatically redirected,{' '}
              <a
                href={`${process.env.NEXT_PUBLIC_URL ?? ''}${decodeURIComponent(redirect)}`}
                className="underline text-blue-500"
              >
                click here
              </a>
              .
            </p>
          ) : null}
        </CardContent>
      </Card>
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
              {debouncedEmail && checkEmailIsSuccess && !errors.email ? (
                <p className="text-green-500 text-sm flex gap-1 items-center">
                  <Check className="h-4 w-4" /> Email is available
                </p>
              ) : null}
              {debouncedEmail && checkEmailIsError ? (
                <p className="text-red-500 text-sm flex gap-1 items-center">
                  <X className="h-4 w-4" /> {checkEmailErrorDetail ?? 'Email is not available'}
                </p>
              ) : null}
            </div>

            {checkEmailIsSuccess && !errors.email ? (
              <div className="space-y-1 transition duration-300 ease-in">
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
                {!password && errors.password ? (
                  <p className="text-sm text-red-500 mb-2 text-left">
                    {errors.password.message as string}
                  </p>
                ) : null}
                {password ? <PasswordValidationChecklist password={password} /> : null}
              </div>
            ) : null}
          </div>

          {checkEmailIsSuccess && !errors.email ? (
            <div className="space-y-2 transition duration-300 ease-in">
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
                <Label
                  htmlFor="hasAcceptedTermsAndPrivacy"
                  className="block text-sm text-left cursor-pointer"
                >
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
          ) : null}

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
          <Button
            type="submit"
            className="w-full"
            disabled={
              isLoading ||
              checkEmailIsError ||
              !!errors.email ||
              !!errors.password ||
              !!errors.hasAcceptedTermsAndPrivacy
            }
          >
            {isLoading ? 'Signing up...' : 'Sign up'}
          </Button>
        </form>
        <GoogleLoginButton />
      </CardContent>
    </Card>
  );
}
