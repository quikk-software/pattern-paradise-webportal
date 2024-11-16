'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { User, ShoppingCart, TestTube } from 'lucide-react';
import { useCreateUser } from '@/lib/api';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import RequestStatus from '@/lib/components/RequestStatus';
import { LoadingSpinnerComponent } from '@/components/loading-spinner';
import useRedirect from '@/lib/core/useRedirect';
import TikTokIcon from '@/lib/icons/TikTokIcon';
import InstagramIcon from '@/lib/icons/InstagramIcon';

const roleOptions = [
  { id: 'Buyer', label: 'Buyer', icon: ShoppingCart, description: 'Purchase patterns' },
  { id: 'Seller', label: 'Seller', icon: User, description: 'List and sell your patterns' },
  {
    id: 'Tester',
    label: 'Tester',
    icon: TestTube,
    description: 'Try out new patterns and provide feedback',
  },
];

export function RegistrationFormComponent() {
  const [roles, setRoles] = useState<string[]>([]);
  const [rolesError, setRolesError] = useState<string | undefined>(undefined);

  const { redirectUrl } = useRedirect();

  const { mutate, isSuccess, isError, isLoading, errorDetail } = useCreateUser();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (roles.length > 0) {
      setRolesError(undefined);
    }
  }, [roles]);

  const onSubmit = async (data: any) => {
    if (roles.length === 0) {
      setRolesError('Select one or more roles');
      return;
    }

    await mutate({
      email: data.email,
      password: data.password,
      firstName: data.firstName,
      lastName: data.lastName,
      username: data.username,
      instagramRef: data.instagram,
      tiktokRef: data.tiktok,
      paypalEmail: data.paypalEmail,
      roles,
    });
  };

  const handleRoleChange = (role: string) => {
    setRoles((prev) => (prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]));
  };

  const hasErrors = errors.email || errors.password || rolesError;

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card className="w-full max-w-2xl mx-auto border-none">
        <CardHeader>
          <Link href={`/auth/login?redirect=${redirectUrl}`} className="w-full mb-4">
            <Button variant="secondary" className="w-full">
              Go to login
            </Button>
          </Link>
          <CardTitle>Register</CardTitle>
          <CardDescription>Create your account to get started.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email">
              Email <span className="text-red-500">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              required
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
            {errors.email ? (
              <p className="text-sm text-red-500 mb-2">{errors.email.message as string}</p>
            ) : null}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">
              Password <span className="text-red-500">*</span>
            </Label>
            <Input
              id="password"
              type="password"
              autoComplete="new-password"
              placeholder="Create a password"
              required
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters',
                },
                onChange: (e) => {
                  e.target.value = e.target.value.trim();
                },
              })}
            />
            {errors.password ? (
              <p className="text-sm text-red-500 mb-2">{errors.password.message as string}</p>
            ) : null}
          </div>
          <div className="space-y-2">
            <Label>
              Roles <span className="text-red-500">*</span>
            </Label>
            <p className="text-sm text-muted-foreground mb-2">
              Select one or more roles that apply to you:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {roleOptions.map((role) => (
                <Card
                  key={role.id}
                  className={`cursor-pointer transition-all ${
                    roles.includes(role.id) ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => handleRoleChange(role.id)}
                >
                  <CardContent className="flex flex-col items-center text-center p-4">
                    <role.icon className="w-12 h-12 mb-2 text-primary" />
                    <h3 className="font-semibold">{role.label}</h3>
                    <p className="text-sm text-muted-foreground">{role.description}</p>
                  </CardContent>
                </Card>
              ))}
              {!!rolesError ? <p className="text-sm text-red-500 mb-2">{rolesError}</p> : null}
            </div>
            <p className="text-xs text-muted-foreground">
              Note: Users with the role &apos;Tester&apos; or &apos;Seller&apos; are required to add
              a valid PayPal email which is eligible of receiving money.{' '}
              <a href="https://paypal.com" target="_blank" className="text-blue-500">
                Create a PayPal account for free here!
              </a>
            </p>
          </div>
          <div className="space-y-2">
            {roles.includes('Seller') || roles.includes('Tester') ? (
              <div className="space-y-2">
                <Label htmlFor="paypalEmail">
                  PayPal Email <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="paypalEmail"
                  type="text"
                  placeholder="Add a valid PayPal email"
                  required
                  {...register('paypalEmail', {
                    required: 'PayPal email is required',
                    pattern: {
                      value: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/i,
                      message: 'Invalid PayPal email address',
                    },
                    onChange: (e) => {
                      e.target.value = e.target.value.toLowerCase().trim();
                    },
                  })}
                />
                {errors.paypalEmail ? (
                  <p className="text-sm text-red-500 mb-2">
                    {errors.paypalEmail.message as string}
                  </p>
                ) : null}
              </div>
            ) : null}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input id="firstName" placeholder="First name" {...register('firstName')} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input id="lastName" placeholder="Last name" {...register('lastName')} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              placeholder="Choose a username"
              {...(register('username'),
              {
                onChange: (e) => {
                  e.target.value = e.target.value.toLowerCase().trim();
                },
              })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="instagram" className="flex items-center gap-1">
              <InstagramIcon className="w-4 h-4 inline" />
              Instagram
            </Label>
            <Input
              id="instagram"
              placeholder="Your Instagram handle"
              {...(register('instagram'),
              {
                onChange: (e) => {
                  e.target.value = e.target.value.toLowerCase().trim();
                },
              })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tiktok" className="flex items-center gap-1">
              <TikTokIcon className="w-4 h-4 inline" />
              <span>TikTok</span>
            </Label>
            <Input
              id="tiktok"
              placeholder="Your TikTok handle"
              {...(register('tiktok'),
              {
                onChange: (e) => {
                  e.target.value = e.target.value.toLowerCase().trim();
                },
              })}
            />
          </div>
          <Button className="w-full" type="submit">
            {isLoading ? <LoadingSpinnerComponent size="sm" className="text-white" /> : null}
            Register
          </Button>
          {!!hasErrors ? (
            <p className="text-sm text-red-500 mb-2">Please check all fields with a * mark.</p>
          ) : null}
          <RequestStatus
            isSuccess={isSuccess}
            isError={isError}
            successMessage="Your account has been created. You can login to your account now."
            errorMessage={`Registration failed: ${errorDetail}`}
          />
        </CardContent>
        <CardFooter className="flex flex-col items-start">
          <p className="text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link
              href={`/auth/login?redirect=${redirectUrl}`}
              className="text-primary hover:underline"
            >
              Login here
            </Link>
          </p>
        </CardFooter>
      </Card>
    </form>
  );
}
