import React from 'react';
import { cn } from '@/lib/utils';
import CurrencyInput from 'react-currency-input-field';

interface PriceInputProps {
  isFree: boolean;
  handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  register: any;
  defaultValue?: number;
}

export default function PriceInput({
  handleKeyDown,
  register,
  isFree,
  defaultValue,
}: PriceInputProps) {
  return (
    <CurrencyInput
      id="price"
      type="text"
      placeholder="Enter price (e.g. 9,99)"
      decimalsLimit={2}
      decimalScale={2}
      decimalSeparator={','}
      groupSeparator={'.'}
      allowNegativeValue={false}
      allowDecimals={true}
      disabled={isFree}
      className={cn(
        'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-md ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
      )}
      defaultValue={defaultValue}
      onKeyDown={handleKeyDown}
      {...register('price', {
        required: !isFree ? 'Price is required' : undefined,
        validate: (value: any) => {
          const normalizedValue = parseFloat(value.replace(',', '.'));
          if (isNaN(normalizedValue)) {
            return 'Please enter a valid number';
          }
          if (normalizedValue < 3.0) {
            return 'Price has to be greater than or equal to 3.00$';
          }
          return true;
        },
      })}
      onValueChange={(value, name, values) => console.log(value, name, values)}
    />
  );
}
