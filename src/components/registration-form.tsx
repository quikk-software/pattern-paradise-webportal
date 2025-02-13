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
import { User, ShoppingCart } from 'lucide-react';
import { useCreateUser } from '@/lib/api';
import { Controller, useForm } from 'react-hook-form';
import Link from 'next/link';
import RequestStatus from '@/lib/components/RequestStatus';
import { LoadingSpinnerComponent } from '@/components/loading-spinner';
import useRedirect from '@/lib/core/useRedirect';
import TikTokIcon from '@/lib/icons/TikTokIcon';
import InstagramIcon from '@/lib/icons/InstagramIcon';
import { PASSWORD_REGEX, PASSWORD_REGEX_MESSAGE } from '@/lib/constants';
import PatternParadiseIcon from '@/lib/icons/PatternParadiseIcon';
import { Checkbox } from '@/components/ui/checkbox';

const ALLOWED_ROLES = ['Buyer', 'Seller', 'Tester'];

const roleOptions = [
  { id: 'Buyer', label: 'Buyer', icon: ShoppingCart, description: 'Purchase patterns' },
  { id: 'Seller', label: 'Seller', icon: User, description: 'List and sell your patterns' },
  {
    id: 'Tester',
    label: 'Tester',
    icon: PatternParadiseIcon,
    description: 'Try out new patterns and provide feedback',
  },
];

interface RegistrationFormComponent {
  preselectedRoles: string[];
}

export function RegistrationFormComponent({ preselectedRoles }: RegistrationFormComponent) {
  const [roles, setRoles] = useState<string[]>([]);
  const [rolesError, setRolesError] = useState<string | undefined>(undefined);

  const { redirectUrl } = useRedirect();

  const { mutate, isSuccess, isError, isLoading, errorDetail } = useCreateUser();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    setRoles(preselectedRoles.filter((role) => ALLOWED_ROLES.includes(role)));
  }, [preselectedRoles]);

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
      firstName: data.firstName?.trim(),
      lastName: data.lastName?.trim(),
      username: data.username?.trim(),
      instagramRef: data.instagram?.trim(),
      tiktokRef: data.tiktok?.trim(),
      hasAcceptedTerms: data.hasAcceptedTerms,
      hasAcceptedPrivacy: data.hasAcceptedPrivacy,
      roles,
    });
  };

  const handleRoleChange = (role: string) => {
    setRoles((prev) => (prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  };

  const hasErrors = errors.email || errors.password || rolesError;

  return (
    <form id="registrationForm" onSubmit={handleSubmit(onSubmit)}>
      <Card>
        <CardHeader>
          <Link
            rel={'nofollow'}
            href={`/auth/login?redirect=${redirectUrl}`}
            className="w-full mb-4"
          >
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
              onKeyDown={handleKeyDown}
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
                pattern: {
                  value: PASSWORD_REGEX,
                  message: PASSWORD_REGEX_MESSAGE,
                },
                onChange: (e) => {
                  e.target.value = e.target.value.trim();
                },
              })}
              onKeyDown={handleKeyDown}
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
              ⚠️ Note: Users with the role &apos;Seller&apos; are required to connect a valid PayPal
              account in their profile settings that is authorised to receive money.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                type="text"
                placeholder="First name"
                required={false}
                {...register('firstName', {
                  onChange: (e) => {
                    e.target.value = e.target.value.trim();
                  },
                })}
                onKeyDown={handleKeyDown}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                type="text"
                placeholder="Last name"
                required={false}
                {...register('lastName', {
                  onChange: (e) => {
                    e.target.value = e.target.value.trim();
                  },
                })}
                onKeyDown={handleKeyDown}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              placeholder="Choose a username"
              required={false}
              {...register('username', {
                onChange: (e) => {
                  e.target.value = e.target.value.toLowerCase().trim();
                },
              })}
              onKeyDown={handleKeyDown}
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
              required={false}
              {...register('instagram', {
                onChange: (e) => {
                  e.target.value = e.target.value.toLowerCase().trim();
                },
              })}
              onKeyDown={handleKeyDown}
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
              required={false}
              {...register('tiktok', {
                onChange: (e) => {
                  e.target.value = e.target.value.toLowerCase().trim();
                },
              })}
              onKeyDown={handleKeyDown}
            />
          </div>

          <div className="space-y-2">
            <div className="flex gap-4 items-center">
              <Controller
                name="hasAcceptedTerms"
                control={control}
                rules={{
                  required: 'You must accept the Terms and Conditions to proceed',
                }}
                render={({ field }) => (
                  <Checkbox
                    id="hasAcceptedTerms"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
              <Label htmlFor="hasAcceptedTerms" className="block text-sm">
                I confirm that I have read and agree to the{' '}
                <Link
                  rel={'nofollow'}
                  href="/terms-and-privacy?action=scrollToTermsAndConditions"
                  target="_blank"
                  className="text-blue-500 underline"
                >
                  Terms and Conditions
                </Link>
                .
              </Label>
            </div>
            {errors.hasAcceptedTerms ? (
              <p className="text-sm text-red-500 mb-2">
                {errors.hasAcceptedTerms.message as string}
              </p>
            ) : null}
          </div>

          <div className="space-y-2">
            <div className="flex gap-4 items-center">
              <Controller
                name="hasAcceptedPrivacy"
                control={control}
                rules={{
                  required: 'You must accept the Privacy Policy to proceed',
                }}
                render={({ field }) => (
                  <Checkbox
                    id="hasAcceptedPrivacy"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
              <Label htmlFor="hasAcceptedPrivacy" className="block text-sm">
                I confirm that I have read and agree to the{' '}
                <Link
                  rel={'nofollow'}
                  href="/terms-and-privacy?action=scrollToPrivacyPolicy"
                  target="_blank"
                  className="text-blue-500 underline"
                >
                  Privacy Policy
                </Link>
                .
              </Label>
            </div>
            {errors.hasAcceptedPrivacy ? (
              <p className="text-sm text-red-500 mb-2">
                {errors.hasAcceptedPrivacy.message as string}
              </p>
            ) : null}
          </div>

          <Button className="w-full" type="submit" disabled={isLoading || isSuccess}>
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
              rel={'nofollow'}
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
