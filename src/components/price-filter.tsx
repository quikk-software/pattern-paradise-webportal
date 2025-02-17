'use client';

import React, { useEffect, useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import CurrencyInput from 'react-currency-input-field';

interface PriceFilterProps {
  onFilterChange: (filter: { isFree: boolean; minPrice: number; maxPrice: number }) => void;
  isFree: boolean;
  overrideMinPrice?: number;
  overrideMaxPrice?: number;
}

export default function PriceFilter({
  onFilterChange,
  isFree,
  overrideMinPrice,
  overrideMaxPrice,
}: PriceFilterProps) {
  const [minPrice, setMinPrice] = useState(overrideMinPrice ?? 3.0);
  const [maxPrice, setMaxPrice] = useState(overrideMaxPrice ?? 100.0);
  const [error, setError] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (minPrice >= maxPrice) {
      setError('Minimum price must be smaller than maximum price');
      return;
    }
    setError(undefined);
    onFilterChange({ isFree, minPrice, maxPrice });
  }, [isFree, minPrice, maxPrice]);

  const handleMinPriceChange = (value: string | undefined) => {
    const newMinPrice = value ? parseFloat(value?.replace(',', '.')) : 3.0;
    if (isNaN(newMinPrice)) {
      return;
    }
    if (newMinPrice < 3.0) {
      setError('Minimum price must be greater than 3.00$');
      return;
    }
    setError(undefined);
    setMinPrice(newMinPrice);
  };

  const handleMaxPriceChange = (value: string | undefined) => {
    const newMaxPrice = value ? parseFloat(value?.replace(',', '.')) : 100.0;
    if (isNaN(newMaxPrice)) {
      return;
    }
    if (newMaxPrice > 100.0) {
      setError('Maximum price must be smaller than 100.00$');
      return;
    }
    setMaxPrice(newMaxPrice);
  };

  const handleFreeChange = (checked: boolean) => {
    onFilterChange({ isFree: checked, minPrice, maxPrice });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Price Filter</h2>
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex flex-row gap-2 items-center">
            <CurrencyInput
              id="min-price"
              name="min-price"
              placeholder="Min price"
              defaultValue={minPrice.toFixed(2)}
              decimalsLimit={2}
              onValueChange={(value) => handleMinPriceChange(value)}
              className={cn(
                'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
              )}
              onKeyDown={handleKeyDown}
            />
            <span>-</span>
            <CurrencyInput
              id="max-price"
              name="max-price"
              placeholder="Max price"
              defaultValue={maxPrice.toFixed(2)}
              decimalsLimit={2}
              onValueChange={(value) => handleMaxPriceChange(value)}
              className={cn(
                'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
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

        <div className="flex items-center space-x-2">
          <Checkbox id="free" checked={isFree} onCheckedChange={handleFreeChange} />
          <Label
            htmlFor="free"
            className="text-sm font-medium leading-none cursor-pointer select-none"
          >
            Show free patterns
          </Label>
        </div>
      </div>
    </div>
  );
}
