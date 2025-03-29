'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { InfoBoxComponent } from '@/components/info-box';
import Link from 'next/link';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { ShieldCheck, Lock, X, MonitorCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import QuickSignUp from '@/lib/components/QuickSignUp';
import useAction from '@/lib/core/useAction';
import { CheckoutButtons } from '../CheckoutButtons';
import { GetProductResponse } from '@/@types/api-types';
import { useSession } from 'next-auth/react';
import { Label } from '@/components/ui/label';
import CurrencyInput from 'react-currency-input-field';
import { cn, getAppType, isApp } from '@/lib/utils';
import { usePayPalOrder } from '@/lib/hooks/usePayPalOrder';

interface BuyNowButtonProps {
  product: GetProductResponse;
}

export function BuyNowButton({ product }: BuyNowButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  const router = useRouter();
  const { action } = useAction();
  const { status } = useSession();

  const { priceError, handleCustomPriceChange, customPrice } = usePayPalOrder();

  useEffect(() => {
    if (!action) {
      return;
    }
    if (action === 'toggleBuyNow') {
      setIsOpen(true);
    }
  }, [action]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  };

  const isLoggedIn = status === 'authenticated';

  const appType = getAppType(window);

  const restriction = useMemo(() => {
    switch (appType) {
      case 'IOS':
        return 'Apple App Store';
      case 'ANDROID':
        return 'Google Play Store';
      case 'STANDALONE':
        return 'Progressive Web App';
      default:
        return '';
    }
  }, [appType]);

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
                  rel={'nofollow'}
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

  if (!isLoggedIn) {
    return (
      <div className="flex flex-col gap-4">
        <QuickSignUp
          redirect={`${encodeURIComponent(`/app/products/${product.id}?action=toggleBuyNow`)}`}
          signupCallback={() =>
            router.push(
              `/auth/login?redirect=${encodeURIComponent(
                `/app/products/${product.id}?action=toggleBuyNow`,
              )}`,
            )
          }
        />
      </div>
    );
  }

  if (isApp(window)) {
    return (
      <div className="space-y-2">
        <InfoBoxComponent
          message={
            <span>
              Due to {restriction} restrictions, you cannot purchase patterns from within the app.
              Please <strong>long press</strong> the button below to navigate to your standard
              browser and make the purchase there.
            </span>
          }
        />
        <Button className="w-full" asChild>
          <a href={`${process.env.NEXT_PUBLIC_URL}/app/products/${product.id}`}>
            <MonitorCheck />
            Open Browser
          </a>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="space-y-1">
        <Label htmlFor="custom-price">
          <strong>Enter custom price</strong> (optional)
        </Label>
        <CurrencyInput
          id="price"
          type="text"
          required={false}
          placeholder={`$${product.price.toFixed(2)} or more`}
          decimalsLimit={2}
          decimalScale={2}
          allowNegativeValue={false}
          allowDecimals={true}
          onValueChange={(value) => {
            const updatedValue = Number(value?.replace(',', '.'));
            handleCustomPriceChange(
              !!value && !isNaN(updatedValue) ? updatedValue : product.price,
              product.price,
            );
          }}
          className={cn(
            'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-md ring-offset-background file:border-0 file:bg-transparent file:text-md file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          )}
          onKeyDown={handleKeyDown}
        />
        {priceError && <p className="text-sm text-red-500">{priceError}</p>}
      </div>
      <Button className="w-full" onClick={() => setIsOpen(true)} disabled={!!priceError}>
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
          <div className="flex flex-col gap-4 overflow-y-auto">
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
              <CheckoutButtons
                disabled={!isLoggedIn}
                price={customPrice ?? product.price}
                product={product}
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
