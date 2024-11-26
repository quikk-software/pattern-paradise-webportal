'use client';

import { useForm, SubmitHandler } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PASSWORD_REGEX, PASSWORD_REGEX_MESSAGE } from '@/lib/constants';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Rabbit, ShieldCheck } from 'lucide-react';
import { useCreateUser } from '@/lib/api';
import RequestStatus from '@/lib/components/RequestStatus';

type FormValues = {
  email: string;
  password: string;
};

interface QuickSignUpProps {
  signupCallback: (isSuccess: boolean) => void;
}

export default function QuickSignUp({ signupCallback }: QuickSignUpProps) {
  const { mutate, isLoading, isSuccess, isError, errorDetail } = useCreateUser();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    await mutate({
      email: data.email,
      password: data.password,
      roles: ['Buyer'],
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
        <span className="flex gap-2 items-center">
          <Rabbit /> Quick Sign Up
        </span>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-2 w-full max-w-md">
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

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Signing up...' : 'Sign up'}
          </Button>
          <RequestStatus isSuccess={isSuccess} isError={isError} errorMessage={errorDetail} />
        </form>
      </CardContent>
    </Card>
  );
}
