'use client';

import { Shield, Lock, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import PayPalLogo from '@/assets/logos/paypal-logo.png';
import Link from 'next/link';
import Image from 'next/image';
import React from 'react';
import ConnectPayPal from '@/lib/components/ConnectPayPal';

export default function ConnectPayPalPage() {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="w-full space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Connect your PayPal account</h1>
          <p className="text-slate-500">
            Securely link your PayPal account to accept payments on Pattern Paradise
          </p>
        </div>

        <Card className="border-slate-200 shadow-lg">
          <CardHeader className="space-y-1">
            <div className="flex justify-center mb-4">
              <Image
                alt="PayPal Logo"
                className="h-8 lg:h-12 w-auto"
                height="51"
                src={PayPalLogo}
                width="200"
              />
            </div>
            <CardTitle className="text-xl text-center">Link with PayPal</CardTitle>
            <CardDescription className="text-center">
              Connect your PayPal account to start receiving payments instantly
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg">
                <Shield className="h-5 w-5 text-slate-500" />
                <div className="text-sm">Your financial information is never shared with us</div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg">
                <Lock className="h-5 w-5 text-slate-500" />
                <div className="text-sm">Secure connection using industry-standard encryption</div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg">
                <CreditCard className="h-5 w-5 text-slate-500" />
                <div className="text-sm">Easily disconnect your account at any time</div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-3">
            <ConnectPayPal
              buttonTheme="bg-[#0070ba] hover:bg-[#005ea6]"
              inputTheme="focus-visible:ring-[#0070ba]"
            />
            <p className="text-xs text-center text-slate-500">
              By connecting your account, you agree to our{' '}
              <Link href="/terms-and-privacy" className="text-[#0070ba] hover:underline">
                Terms of Service and Privacy Policy
              </Link>
            </p>
          </CardFooter>
        </Card>

        <div className="text-center space-y-2">
          <p className="text-sm text-slate-500">
            Need help?{' '}
            <Link href="/help" className="text-[#0070ba] hover:underline">
              Contact support
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
