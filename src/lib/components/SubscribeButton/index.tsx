'use client';

import React, { useState } from 'react';
import { useCreateSubscription } from '@/lib/api/subscription';
import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { reset } from '@/lib/features/auth/authSlice';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { PartyPopper } from 'lucide-react';
import { useValidSession } from '@/hooks/useValidSession';

export default function SubscribeButton() {
  const [isOpen, setIsOpen] = useState(false);

  const { status } = useValidSession();

  const { mutate } = useCreateSubscription();
  const router = useRouter();
  const dispatch = useDispatch();

  const isLoggedIn = status === 'authenticated';

  if (process.env.NEXT_PUBLIC_PATTERN_PARADISE_PRO_ACTIVE !== 'true') {
    return null;
  }

  if (!process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || !process.env.NEXT_PUBLIC_PAYPAL_PLAN_ID) {
    return null;
  }

  return (
    <>
      {isLoggedIn ? (
        <PayPalScriptProvider
          options={{
            clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID,
            components: 'buttons',
            intent: 'subscription',
            vault: true,
          }}
        >
          <PayPalButtons
            createSubscription={(_data, actions) => {
              return actions.subscription
                .create({
                  plan_id: process.env.NEXT_PUBLIC_PAYPAL_PLAN_ID!,
                })
                .then((orderId) => {
                  return orderId;
                });
            }}
            onApprove={(data: any, actions: any) => {
              return actions.subscription.get().then(async function () {
                await mutate({
                  paypalSubscriptionId: data.subscriptionID,
                });
                dispatch(reset());
                setIsOpen(true);
              });
            }}
            style={{
              label: 'subscribe',
            }}
          />
        </PayPalScriptProvider>
      ) : (
        <Link rel={'nofollow'} href="/auth/registration?redirect=/pro">
          <Button
            size="lg"
            className="font-bold py-4 px-8 rounded-full shadow-lg transform transition duration-300 hover:scale-105"
          >
            Subscribe Now
          </Button>
        </Link>
      )}

      <Drawer open={isOpen} onOpenChange={setIsOpen}>
        <DrawerContent className="p-4">
          <div className="flex flex-col gap-4">
            <DrawerHeader className="flex flex-col gap-8 items-center mt-4">
              <PartyPopper className="w-20 h-20" />
              <DrawerTitle>Congratulations, you are now a Pro!</DrawerTitle>
              <DrawerTitle className="text-sm font-medium">
                Your Pattern Paradise Pro subscription is now active! Please login again to get
                access to all features of Pattern Paradise.
              </DrawerTitle>
            </DrawerHeader>
            <Button
              onClick={() => {
                router.push('/auth/login');
              }}
            >
              Go to login
            </Button>
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
}
