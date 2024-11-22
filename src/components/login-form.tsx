'use client';

import React, { useState } from 'react';
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
import Link from 'next/link';
import useAuth from '@/lib/auth/useAuth';
import RequestStatus from '@/lib/components/RequestStatus';
import { LoadingSpinnerComponent } from '@/components/loading-spinner';
import RequestPasswordDrawer from '@/lib/components/RequestPasswordDrawer';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRequestPasswordDrawerOpen, setIsRequestPasswordDrawerOpen] = useState(false);

  const { handleLogin, isLoading, isSuccess, isError } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await handleLogin(email.toLowerCase().trim(), password.trim());
  };

  const disabled = !email || !password;

  return (
    <Card className="w-full max-w-md mx-auto border-none">
      <CardHeader>
        <CardTitle>Login</CardTitle>
        <CardDescription>Enter your credentials to access your account.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <form onSubmit={handleSubmit}>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button className="w-full" onClick={handleSubmit} disabled={disabled}>
              {isLoading ? <LoadingSpinnerComponent size="sm" className="text-white" /> : null}
              Log in
            </Button>
            <RequestStatus
              isSuccess={isSuccess}
              isError={isError}
              errorMessage="Login failed. Please check your email and password."
            />
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col items-end gap-4">
        <p className="text-sm text-muted-foreground text-right">
          Don&apos;t have an account?{' '}
          <Link href="/auth/registration" className="text-primary hover:underline">
            Register here
          </Link>
        </p>
        <p className="text-sm text-muted-foreground text-right">
          Forgot your password?{' '}
          <span
            onClick={() => setIsRequestPasswordDrawerOpen(true)}
            className="text-primary hover:underline"
          >
            Reset here
          </span>
        </p>
      </CardFooter>
      {isRequestPasswordDrawerOpen ? (
        <RequestPasswordDrawer
          drawerIsOpen={isRequestPasswordDrawerOpen}
          setDrawerIsOpen={setIsRequestPasswordDrawerOpen}
        />
      ) : null}
    </Card>
  );
}
