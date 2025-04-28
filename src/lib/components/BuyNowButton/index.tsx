'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { InfoBoxComponent } from '@/components/info-box';
import Link from 'next/link';
import { Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import QuickSignUp from '@/lib/components/QuickSignUp';
import useAction from '@/lib/core/useAction';
import { CheckoutButtons } from '../CheckoutButtons';
import { GetProductResponse } from '@/@types/api-types';
import { useValidSession } from '@/hooks/useValidSession';
import { Label } from '@/components/ui/label';
import CurrencyInput from 'react-currency-input-field';
import { cn } from '@/lib/utils';
import { usePayPalOrder } from '@/lib/hooks/usePayPalOrder';
import { useListOrdersByProductId } from '@/lib/api/order';
import { useSelector } from 'react-redux';
import { Store } from '@/lib/redux/store';
import CountrySelect from '@/lib/components/CountrySelect';
import { isInStandaloneMode } from '@/lib/core/utils';

interface BuyNowButtonProps {
  product: GetProductResponse;
  customPriceDisabled?: boolean;
}

export function BuyNowButton({ product, customPriceDisabled = false }: BuyNowButtonProps) {
  const [isStandalone, setIsStandalone] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const { userId } = useSelector((s: Store) => s.auth);

  const router = useRouter();
  const { action } = useAction();
  const { status } = useValidSession();

  const { priceError, handleCustomPriceChange, customPrice, country, setCountry } =
    usePayPalOrder();
  const { fetch: fetchOrdersByProductId } = useListOrdersByProductId();

  useEffect(() => {
    setIsStandalone(isInStandaloneMode());
  }, []);

  useEffect(() => {
    if (!action) {
      return;
    }
    if (action === 'toggleBuyNow') {
      setIsOpen(true);
    }
  }, [action]);

  const handleBuyNowClick = () => {
    if (isStandalone) {
      router.push(`/app/products/${product.id}`);
      return;
    }
    fetchOrdersByProductId(product.id)
      .then((result) => {
        const customerOrder = result?.find((order) => order.customer.id === userId);

        if (customerOrder?.status === 'COMPLETED' || customerOrder?.status === 'CAPTURED') {
          router.push(`/app/secure/auth/me/orders/${customerOrder.id}?action=toggleBuyNow`);
        }
      })
      .finally(() => {
        setIsOpen(true);
      });
  };

  const handleCountryChange = (value: string) => {
    setCountry(value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  };

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
                  rel={'nofollow'}
                  href={`/app/tester-calls/${product.id}`}
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
    <div className="flex flex-col gap-4">
      {!customPriceDisabled ? (
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
      ) : null}
      {isOpen ? (
        <>
          {isLoggedIn ? (
            <>
              <div className="space-y-1">
                <CountrySelect
                  country={country}
                  handleCountryChange={handleCountryChange}
                  fullWidth
                />
                <p className="text-xs text-muted-foreground">
                  ⚠️ Note: Selecting your current country helps the seller calculate the correct
                  taxes for your purchase.{' '}
                  <strong>
                    Please select the country where you are physically located when buying this
                    pattern.
                  </strong>
                </p>
                <p className="text-xs text-muted-foreground italic">
                  This should be the country you&apos;re in at the moment of purchase - not
                  necessarily your country of residence.
                </p>
              </div>
              <CheckoutButtons
                disabled={!isLoggedIn}
                price={customPrice ?? product.price}
                product={product}
                country={country}
              />
            </>
          ) : (
            <div className="flex flex-col gap-4">
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">Almost there!🎉</h3>
                <p>
                  You&apos;re just one step away from getting this stunning pattern!
                  <br />
                  <br />
                  Simply sign up to complete your purchase. Quick, easy, and totally worth it!
                </p>
              </div>
              <QuickSignUp
                redirect={`${encodeURIComponent(`/app/products/${product.id}?action=toggleBuyNow`)}`}
              />
            </div>
          )}
        </>
      ) : (
        <Button className="w-full" onClick={handleBuyNowClick} disabled={!!priceError}>
          <Lock />
          Buy Now
        </Button>
      )}
    </div>
  );
}
