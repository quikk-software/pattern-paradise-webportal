'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { InfoBoxComponent } from '@/components/info-box';
import { useSelector } from 'react-redux';
import { Store } from '@/lib/redux/store';
import Link from 'next/link';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { ShieldCheck, Lock, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import QuickSignUp from '@/lib/components/QuickSignUp';
import useAction from '@/lib/core/useAction';
import { PayPalButton } from '@/lib/components/PayPalButton';
import { GetProductResponse } from '@/@types/api-types';
import { useSession } from 'next-auth/react';

interface BuyNowButtonProps {
  product: GetProductResponse;
  callback?: (orderId: string) => void;
}

export function BuyNowButton({ product, callback }: BuyNowButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  const router = useRouter();
  const { action } = useAction();

  const { status } = useSession();
  const { userId } = useSelector((s: Store) => s.auth);

  useEffect(() => {
    if (!action) {
      return;
    }
    if (action === 'toggleBuyNow') {
      setIsOpen(true);
    }
  }, [action]);

  const isLoggedIn = status === 'authenticated';

  if (product?.status !== 'Released') {
    return (
      <InfoBoxComponent
        message={
          <span>
            This pattern is currently not for sale.
            {product?.status === 'Created' ? (
              <span>
                {' '}
                <Link
                  href={`/app/secure/test/products/${product.id}`}
                  className="text-blue-500 underline"
                >
                  Apply as a Tester here!
                </Link>
              </span>
            ) : (
              ''
            )}
          </span>
        }
        severity="info"
      />
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <span className="text-3xl font-bold">${product.price.toFixed(2)}</span>
      <Button className="w-full" onClick={() => setIsOpen(true)}>
        <Lock />
        Buy Now
      </Button>
      <Drawer open={isOpen} onOpenChange={setIsOpen} dismissible={!isLoggedIn}>
        <DrawerContent
          className="p-4"
          style={{
            maxHeight: '90vh',
          }}
        >
          <div className="mx-auto w-full max-w-sm flex flex-col gap-4 overflow-y-auto">
            <DrawerClose className="flex justify-end" onClick={() => setIsOpen(false)}>
              <X className="text-muted-foreground p-2 w-10 h-10" />
            </DrawerClose>
            <DrawerHeader className="flex flex-col gap-8 items-center mt-4">
              <ShieldCheck className="w-20 h-20 text-green-500" />
              <div className="flex flex-col gap-2">
                <DrawerTitle className="text-center">Your Order</DrawerTitle>
                <DrawerTitle className="font-medium text-md text-center">
                  {product.title}
                </DrawerTitle>
              </div>
              {!isLoggedIn ? (
                <div className="flex flex-col gap-4">
                  <QuickSignUp
                    redirect={`${encodeURIComponent(
                      `/app/products/${product.id}?action=toggleBuyNow`,
                    )}`}
                    signupCallback={() =>
                      router.push(
                        `/auth/login?redirect=${encodeURIComponent(
                          `/app/products/${product.id}?action=toggleBuyNow`,
                        )}`,
                      )
                    }
                  />
                </div>
              ) : null}
              <PayPalButton
                disabled={!isLoggedIn}
                price={product.price}
                productId={product.id}
                userId={userId}
                callback={callback}
              />
            </DrawerHeader>
            <Button variant="destructive" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
