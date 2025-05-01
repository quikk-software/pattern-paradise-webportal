'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import GoogleLoginButton from '@/lib/components/GoogleLoginButton';
import { useValidSession } from '@/hooks/useValidSession';

export default function WelcomeCard() {
  const { status } = useValidSession();

  if (status === 'authenticated') {
    return null;
  }

  return (
    <Card className="mb-6">
      <CardContent className="p-4 flex flex-col md:flex-row md:items-center gap-4">
        <div className="flex-1">
          <h3 className="text-lg font-medium">New to Pattern Paradise?</h3>
          <p className="text-muted-foreground text-sm mt-1">
            Buy, sell and test your patterns in one place!
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <Button size="sm" asChild>
            <Link href="/auth/registration" className="flex items-center gap-2">
              <ArrowRight />
              Register Now
            </Link>
          </Button>
          <GoogleLoginButton callbackUrl="/how-to" />
        </div>
      </CardContent>
    </Card>
  );
}
