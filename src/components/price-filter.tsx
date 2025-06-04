'use client';

import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import CurrencyInput from 'react-currency-input-field';
import { MAX_PRICE, MIN_PRICE } from '@/lib/constants';
import { useTranslations } from 'use-intl';

interface PriceFilterProps {
  onFilterChange: (filter: { minPrice: number; maxPrice: number }) => void;
  overrideMinPrice?: number;
  overrideMaxPrice?: number;
}

export default function PriceFilter({
  onFilterChange,
  overrideMinPrice,
  overrideMaxPrice,
}: PriceFilterProps) {
  const [minPrice, setMinPrice] = useState(overrideMinPrice ?? MIN_PRICE);
  const [maxPrice, setMaxPrice] = useState(overrideMaxPrice ?? MAX_PRICE);
  const [error, setError] = useState<string | undefined>(undefined);

  const t = useTranslations();

  useEffect(() => {
    if (minPrice >= maxPrice) {
      setError(t('common.price.maxError'));
      return;
    }
    setError(undefined);
    onFilterChange({ minPrice, maxPrice });
  }, [minPrice, maxPrice]);

  const handleMinPriceChange = (value: string | undefined) => {
    const newMinPrice = value ? parseFloat(value?.replace(',', '.')) : MIN_PRICE;
    if (isNaN(newMinPrice)) {
      return;
    }
    if (newMinPrice < MIN_PRICE) {
      setError(
        t('common.price.minError', {
          minPrice: MIN_PRICE.toFixed(2),
        }),
      );
      return;
    }
    setError(undefined);
    setMinPrice(newMinPrice);
  };

  const handleMaxPriceChange = (value: string | undefined) => {
    const newMaxPrice = value ? parseFloat(value?.replace(',', '.')) : MAX_PRICE;
    if (isNaN(newMaxPrice)) {
      return;
    }
    if (newMaxPrice > MAX_PRICE) {
      setError(
        t('common.price.maxError2', {
          maxPrice: MAX_PRICE.toFixed(2),
        }),
      );
      return;
    }
    setMaxPrice(newMaxPrice);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">{t('common.price.title')}</h2>
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex flex-row gap-2 items-center">
            <CurrencyInput
              id="min-price"
              name="min-price"
              placeholder={t('common.price.minPlaceholder')}
              defaultValue={minPrice.toFixed(2)}
              decimalsLimit={2}
              onValueChange={(value) => handleMinPriceChange(value)}
              className={cn(
                'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-md ring-offset-background file:border-0 file:bg-transparent file:text-md file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
              )}
              onKeyDown={handleKeyDown}
            />
            <span>-</span>
            <CurrencyInput
              id="max-price"
              name="max-price"
              placeholder={t('common.price.maxPlaceholder')}
              defaultValue={maxPrice.toFixed(2)}
              decimalsLimit={2}
              onValueChange={(value) => handleMaxPriceChange(value)}
              className={cn(
                'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-md ring-offset-background file:border-0 file:bg-transparent file:text-md file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
              )}
              onKeyDown={handleKeyDown}
            />
          </div>

          {error ? (
            <div>
              <span className="text-orange-500 text-sm">{error}</span>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
