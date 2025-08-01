'use client';

import React, { useState, useEffect, useRef, MutableRefObject } from 'react';
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
import { cn, getCurrencySymbol } from '@/lib/utils';
import { usePayPalOrder } from '@/lib/hooks/usePayPalOrder';
import { useListOrdersByProductId } from '@/lib/api/order';
import { useSelector } from 'react-redux';
import { Store } from '@/lib/redux/store';
import CountrySelect from '@/lib/components/CountrySelect';
import { isIOSMode } from '@/lib/core/utils';
import { RedirectBrowserDrawer } from '@/lib/components/RedirectBrowserDrawer';
import { PriceSaleBadge } from '@/lib/components/PriceSaleBadge';

interface BuyNowButtonProps {
  product: GetProductResponse;
  customPriceDisabled?: boolean;
}

export function BuyNowButton({ product, customPriceDisabled = false }: BuyNowButtonProps) {
  const [isStandalone, setIsStandalone] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [showRedirect, setShowRedirect] = useState(false);

  const { userId } = useSelector((s: Store) => s.auth);

  const router = useRouter();
  const { action } = useAction();
  const { status } = useValidSession();

  const { priceError, handleCustomPriceChange, customPrice, country, setCountry } =
    usePayPalOrder();
  const { fetch: fetchOrdersByProductId } = useListOrdersByProductId();

  const buyNowRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setIsStandalone(isIOSMode());
  }, []);

  useEffect(() => {
    if (!action) {
      return;
    }
    if (action === 'toggleBuyNow') {
      setIsOpen(true);
      executeScroll(buyNowRef);
    }
  }, [action]);

  const handleBuyNowClick = () => {
    if (isStandalone) {
      setShowRedirect(true);
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

  const handleRedirect = () => {
    window.location.href = `/app/products/${product.id}`;
  };

  const handleCountryChange = (value: string) => {
    setCountry(value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  };

  const executeScroll = (ref: MutableRefObject<HTMLDivElement | null>) => {
    ref.current?.scrollIntoView({
      behavior: 'smooth',
    });
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

  const isDueDateActive =
    product.salePrice !== undefined &&
    product.salePriceDueDate !== undefined &&
    new Date(product.salePriceDueDate) > new Date();
  const isSaleActive =
    !product.isFree &&
    ((product.salePrice !== undefined && product.salePriceDueDate === undefined) ||
      isDueDateActive);

  const productPrice = isSaleActive ? product.salePrice : product.price;

  if (product.hasExcludedCountry) {
    return (
      <InfoBoxComponent
        severity="warning"
        title={'Pattern Unavailable'}
        message={'This pattern is currently not available in your country.'}
      />
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {isDueDateActive ? (
        <PriceSaleBadge
          originalPrice={product.price}
          salePrice={product.salePrice}
          saleDueDate={product.salePriceDueDate}
          currency={getCurrencySymbol(product.sellerCurrency)}
        />
      ) : null}
      {!customPriceDisabled ? (
        <div className="space-y-1">
          <Label htmlFor="custom-price">
            <strong>Enter custom price</strong> (optional)
          </Label>
          <CurrencyInput
            id="price"
            type="text"
            required={false}
            placeholder={`${getCurrencySymbol(product.sellerCurrency)}${productPrice.toFixed(2)} or more`}
            decimalsLimit={2}
            decimalScale={2}
            allowNegativeValue={false}
            allowDecimals={true}
            onValueChange={(value) => {
              const updatedValue = Number(value?.replace(',', '.'));
              handleCustomPriceChange(
                !!value && !isNaN(updatedValue) ? updatedValue : productPrice,
                productPrice,
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
      <div ref={buyNowRef}>
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
                  price={
                    customPrice ? customPrice : isSaleActive ? product.salePrice : product.price
                  }
                  product={product}
                  country={country}
                  currency={product.sellerCurrency}
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
      <RedirectBrowserDrawer
        isOpen={showRedirect}
        onClose={() => setShowRedirect(false)}
        onRedirect={handleRedirect}
        subtitle={"You'll be redirected to your browser to complete the payment securely."}
        description={'For your security, the payment process will be completed in your browser.'}
      />
    </div>
  );
}
