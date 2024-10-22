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

const roleOptions = [
  { id: 'buyer', label: 'Buyer', icon: ShoppingCart, description: 'Purchase patterns' },
  { id: 'seller', label: 'Seller', icon: User, description: 'List and sell your patterns' },
  {
    id: 'tester',
    label: 'Tester',
    icon: TestTube,
    description: 'Try out new patterns and provide feedback',
  },
];

export function RegistrationFormComponent() {
  const [roles, setRoles] = useState<string[]>([]);
  const [rolesError, setRolesError] = useState<string | undefined>(undefined);

  const { mutate } = useCreateUser();

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
      roles,
    });

    // TODO: Redirect to success page
  };

  const handleRoleChange = (role: string) => {
    setRoles((prev) => (prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]));
  };

  const hasErrors = errors.email || errors.password || rolesError;

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card className="w-full max-w-2xl mx-auto border-none">
        <CardHeader>
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
              placeholder="Create a password"
              required
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters',
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
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input id="firstName" placeholder="First name" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input id="lastName" placeholder="Last name" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input id="username" placeholder="Choose a username" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="instagram">Instagram</Label>
            <Input id="instagram" placeholder="Your Instagram handle" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tiktok">TikTok</Label>
            <Input id="tiktok" placeholder="Your TikTok handle" />
          </div>
          <Button className="w-full" type="submit">
            Register
          </Button>
          {!!hasErrors ? (
            <p className="text-sm text-red-500 mb-2">Please check all fields with a * mark.</p>
          ) : null}
        </CardContent>
        <CardFooter className="flex flex-col items-start">
          <p className="text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-primary hover:underline">
              Login here
            </Link>
          </p>
        </CardFooter>
      </Card>
    </form>
  );
}
