'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { LoadingSpinnerComponent } from '@/components/loading-spinner';
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
import { isTokenValid } from '@/lib/auth/auth.utils';
import QuickSignUp from '@/lib/components/QuickSignUp';
import useAction from '@/lib/core/useAction';
import { useGetProduct } from '@/lib/api';
import { PayPalButton } from '@/lib/components/PayPalButton';

interface BuyNowButtonProps {
  price: number;
  productId: string;
  productName: string;
  callback?: (orderId: string) => void;
}

export function BuyNowButton({ price, productId, productName, callback }: BuyNowButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  const router = useRouter();
  const { action } = useAction();

  const { accessToken, userId } = useSelector((s: Store) => s.auth);

  const { fetch: fetchProduct, data: product, isLoading: fetchProductIsLoading } = useGetProduct();

  useEffect(() => {
    fetchProduct(productId);
  }, [productId]);

  useEffect(() => {
    if (!action) {
      return;
    }
    if (action === 'toggleBuyNow') {
      setIsOpen(true);
    }
  }, [action]);

  const isLoggedIn = isTokenValid(accessToken);

  if (fetchProductIsLoading) {
    return <LoadingSpinnerComponent />;
  }

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
                  href={`/app/secure/test/products/${productId}`}
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
      <span className="text-3xl font-bold">${price.toFixed(2)}</span>
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
                <DrawerTitle>Complete Your Order</DrawerTitle>
                <DrawerTitle className="font-medium text-md">{productName}</DrawerTitle>
              </div>
              {!isLoggedIn ? (
                <div className="flex flex-col gap-4">
                  <InfoBoxComponent
                    severity="info"
                    message={
                      <span>
                        You&apos;re not logged in. You can{' '}
                        <Link
                          href={`/auth/login?redirect=/app/products/${productId}?action=toggleBuyNow`}
                          className="text-blue-500 underline"
                        >
                          log in
                        </Link>{' '}
                        or{' '}
                        <Link
                          href={`/auth/registration?preselectedRoles=Buyer&redirect=/app/products/${productId}?action=toggleBuyNow`}
                          className="text-blue-500 underline"
                        >
                          register
                        </Link>
                        . Otherwise you can use our{' '}
                        <Link
                          href="/faq?anchor=quickregistration"
                          className="text-blue-500 underline"
                          target="_blank"
                        >
                          Quick Sign Up
                        </Link>{' '}
                        below.
                      </span>
                    }
                  />
                  <QuickSignUp
                    signupCallback={() =>
                      router.push(
                        `/auth/login?redirect=${encodeURIComponent(
                          `/app/products/${productId}?action=toggleBuyNow`,
                        )}`,
                      )
                    }
                  />
                </div>
              ) : null}
              <PayPalButton
                disabled={!isLoggedIn}
                price={price}
                productId={productId}
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
