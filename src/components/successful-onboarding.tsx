'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { CheckCircle, ArrowRight } from 'lucide-react';
import Confetti from 'react-confetti';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export default function SuccessfulOnboarding() {
  const [showConfetti, setShowConfetti] = useState(true);

  const params = useSearchParams();

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  const accountStatus = params.get('accountStatus');
  const merchantId = params.get('merchantIdInPayPal') ?? 'not found';
  const accountType = accountStatus === 'BUSINESS_ACCOUNT' ? 'Business' : 'Regular';

  return (
    <div className="bg-gradient-to-b from-orange-100 to-white flex flex-col justify-between">
      <main className="flex-grow flex justify-center items-center p-4">
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-8 w-8 text-green-500" />
              <CardTitle className="text-2xl font-bold text-green-700">Welcome aboard!</CardTitle>
            </div>
            <CardDescription>
              Your PayPal merchant account has been successfully onboarded.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-lg">
              Congratulations! Your onboarding was successful. You&apos;ll receive an Email once
              you&apos;re set to receive Payments. You can also check your current PayPal Merchant
              status{' '}
              <Link href="/app/secure/auth/me" className="text-blue-500 underline">
                in your Profile
              </Link>
              .
            </p>

            <div className="bg-orange-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Your Account Information:</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>Merchant ID: {merchantId}</li>
                <li>Account Type: {accountType}</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Next Steps:</h3>
              <ol className="list-decimal list-inside space-y-2">
                <li>
                  Start by{' '}
                  <Link className="text-blue-500 underline" href="/app/secure/sell/submit">
                    Creating a new Pattern
                  </Link>
                </li>
                <li>
                  After Creating a Pattern, you can{' '}
                  <Link className="text-blue-500 underline" href="/app/secure/test/testings">
                    Individualize your Tester Call
                  </Link>
                </li>
                <li>Post your Tester Call on Social Media and gather Tester Applications</li>
                <li>
                  Choose your Testers and{' '}
                  <Link className="text-blue-500 underline" href="/app/secure/test/chats">
                    Chat with them
                  </Link>
                </li>
                <li>
                  After your Testers approved your Pattern, you can{' '}
                  <Link className="text-blue-500 underline" href="/app/secure/sell">
                    Release your Pattern
                  </Link>{' '}
                  to the public
                </li>
              </ol>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between items-center">
            <Link href="/app/secure/auth/me">
              <Button variant="outline">Go to Profile</Button>
            </Link>
            <Link href="/app/secure/sell/submit">
              <Button variant="default">
                Create a Pattern
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </main>
    </div>
  );
}
