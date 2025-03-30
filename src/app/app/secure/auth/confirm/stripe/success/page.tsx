import Link from 'next/link';
import { CheckCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function StripeOnboardingSuccess() {
  return (
    <div className="flex items-center justify-center">
      <Card className="w-full shadow-lg border-0">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">Everything Fine!</CardTitle>
          <CardDescription className="text-gray-600">
            Stripe is connected to Pattern Paradise.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <div className="rounded-lg bg-green-50 p-4">
            <p className="text-sm text-green-800">
              If you have not yet completed the onboarding form, you can always continue the process{' '}
              <Link
                href={'/app/secure/auth/me?action=scrollToStripe'}
                className="text-blue-500 underline"
              >
                from your profile
              </Link>
              . Once you have successfully connected your account, you will be able to receive
              payments through our platform.
            </p>
          </div>
        </CardContent>
        <CardFooter>
          <Button asChild className="w-full bg-green-600 hover:bg-green-700">
            <Link href="/app/secure/auth/me">Go to Profile</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
