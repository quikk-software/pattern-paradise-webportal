'use client';

import Link from 'next/link';
import { ArrowRight, CheckCircle, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import useRedirect from '@/lib/core/useRedirect';
import { useValidSession } from '@/hooks/useValidSession';

export default function RegistrationSuccess() {
  const [email, setEmail] = useState<string | undefined>(undefined);
  const [roles, setRoles] = useState<string[]>([]);

  const searchParams = useSearchParams();
  const router = useRouter();
  const { redirectUrl } = useRedirect();
  const { status } = useValidSession();

  useEffect(() => {
    setEmail(searchParams.get('email') || undefined);
    setRoles(searchParams.get('roles')?.split(',') ?? []);
  }, [searchParams]);

  const handleLoginClick = () => {
    if (roles.includes('Seller') && !redirectUrl) {
      router.push(
        `/auth/login?redirect=${encodeURIComponent('/app/secure/auth/me/connect-paypal')}`,
      );
    } else {
      router.push(`/auth/login?redirect=${redirectUrl}`);
    }
  };

  const isLoggedIn = status === 'authenticated';

  return (
    <div className="flex items-center justify-center p-4">
      <Card className="mx-auto w-full">
        <CardHeader className="flex flex-col items-center gap-2 pt-6">
          <div className="rounded-full bg-green-100 p-3 dark:bg-green-900/20">
            <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-500" />
          </div>
          <h1 className="text-center text-2xl font-bold tracking-tight mt-4">
            Registration Successful!
          </h1>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-muted-foreground">
            Thank you for registering. Your account has been created successfully.
          </p>

          <div className="rounded-lg bg-muted p-4 mt-4">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Mail className="h-5 w-5 text-muted-foreground" />
              <p className="font-medium">Confirmation Email Sent</p>
            </div>
            <p className="text-sm text-muted-foreground">
              We&apos;ve sent a confirmation email to{' '}
              {email ? <strong>{email}</strong> : 'your email'}. Please check your inbox to verify
              your account.
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              <strong>Note:</strong> If you don&apos;t see the email, please check your spam or junk
              folder.
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button variant="outline" asChild className="w-full">
            <Link href="/">Return to Homepage</Link>
          </Button>
          {isLoggedIn ? (
            redirectUrl ? (
              <Button className="w-full gap-2" asChild>
                <Link href={redirectUrl}>
                  Continue <ArrowRight />
                </Link>
              </Button>
            ) : null
          ) : (
            <Button className="w-full" onClick={handleLoginClick}>
              Go to Login
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
