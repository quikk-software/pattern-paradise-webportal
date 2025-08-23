import React from 'react';
import { cn } from '@/lib/utils';
import CurrencyInput from 'react-currency-input-field';
import { MAX_PRICE, MIN_PRICE } from '@/lib/constants';
import { Controller } from 'react-hook-form';

interface PriceInputProps {
  isFree: boolean;
  handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  control: any;
  name: string;
  getValues: () => any;
  currency?: string;
  overrideRequired?: boolean;
  placeholder?: string;
}

export default function PriceInput({
  handleKeyDown,
  isFree,
  control,
  name,
  getValues,
  currency,
  overrideRequired = true,
  placeholder = 'Enter price (e.g. 9,999.99)',
}: PriceInputProps) {
  return (
    <Controller
      name={name}
      control={control}
      rules={{
        required: !overrideRequired
          ? false
          : !isFree && overrideRequired
            ? 'Price is required'
            : false,
        validate: (value: any) => {
          if (isFree || !overrideRequired) {
            return true;
          }
          const normalizedValue = parseFloat(value?.replace(',', '.'));
          if (isNaN(normalizedValue)) {
            return 'Please enter a valid number';
          }
          if (normalizedValue < MIN_PRICE) {
            return `Price must be at least ${currency ?? ''}${MIN_PRICE.toFixed(2)}`;
          }
          if (normalizedValue > MAX_PRICE) {
            return `Price must be at most ${currency ?? ''}${MAX_PRICE.toFixed(2)}`;
          }

          if (name === 'salePrice') {
            const priceValue = parseFloat(getValues()?.price);
            if (!isNaN(priceValue) && normalizedValue >= priceValue) {
              return 'Sale price must be less than the regular price';
            }
          }

          return true;
        },
      }}
      render={({ field: { onChange, value, ...rest } }) => (
        <CurrencyInput
          {...rest}
          id="price"
          placeholder={placeholder}
          decimalsLimit={2}
          decimalScale={2}
          allowNegativeValue={false}
          allowDecimals={true}
          disabled={isFree}
          onValueChange={(val) => {
            onChange(val === 'NaN' ? '0' : val);
          }}
          className={cn(
            'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-md ring-offset-background file:border-0 file:bg-transparent file:text-md file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          )}
          onKeyDown={handleKeyDown}
        />
      )}
    />
  );
}
