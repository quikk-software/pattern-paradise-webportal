import Link from 'next/link';
import { CheckCircle, CloudAlert } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function StripeOnboardingRetry() {
  return (
    <div className="flex items-center justify-center">
      <Card className="w-full shadow-lg border-0">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-orange-100">
            <CloudAlert className="h-10 w-10 text-orange-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">Onboarding Failed!</CardTitle>
          <CardDescription className="text-gray-600">
            Your Stripe account couldn&apos;t be connected to Pattern Paradise.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <div className="rounded-lg bg-orange-50 p-4">
            <p className="text-sm text-orange-800">Please go to your Profile and try again.</p>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <Button asChild className="w-full bg-orange-600 hover:bg-orange-700">
            <Link href="/app/secure/auth/me">Go to Profile</Link>
          </Button>
          <Button variant="outline" asChild className="w-full">
            <Link href="/help">Get Help</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
