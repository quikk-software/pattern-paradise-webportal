import { AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function StripeRevoked() {
  return (
    <div className="flex flex-col items-center justify-center">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Stripe Merchant Status Revoked
          </CardTitle>
          <CardDescription className="text-center">
            We&apos;ve noticed a change in your Stripe account status
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Account Status Change</AlertTitle>
            <AlertDescription>
              Your Stripe merchant status has been revoked on our platform.
            </AlertDescription>
          </Alert>
          <p className="text-gray-600">
            This means that you can no longer receive payments through Stripe on our platform. If
            you want to reactivate your Stripe merchant status,{' '}
            <Link href="/app/secure/auth/me" className="text-blue-500 underline" rel={'nofollow'}>
              go to your profile
            </Link>
            .
          </p>
          <h3 className="font-semibold text-lg">What this means for you:</h3>
          <ul className="list-disc pl-5 space-y-2 text-gray-600">
            <li>You cannot receive new payments via Stripe</li>
            <li>Existing funds in your account are not affected</li>
          </ul>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" asChild>
            <Link href="/app/secure/auth/me">Go to Profile</Link>
          </Button>
          <Button asChild>
            <Link href="/help">Contact Support</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
