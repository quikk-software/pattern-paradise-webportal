'use client';

import { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DollarSign, Euro } from 'lucide-react';
import { useUpdateUser } from '@/lib/api';

interface CurrencySelectProps {
  userId: string;
  initialCurrency: string;
}

export default function CurrencySelect({ userId, initialCurrency }: CurrencySelectProps) {
  const [selectedCurrency, setSelectedCurrency] = useState<string>(initialCurrency);

  const { mutate: updateUser, isLoading } = useUpdateUser();

  const handleCurrencyChange = (value: string) => {
    if (!value) {
      return;
    }

    updateUser(userId, {
      currency: value,
    }).then(() => {
      setSelectedCurrency(value);
    });
  };

  const getCurrencyIcon = (currency: string) => {
    switch (currency) {
      case 'USD':
        return <DollarSign className="h-5 w-5 text-green-600" />;
      case 'EUR':
        return <Euro className="h-5 w-5 text-blue-600" />;
      default:
        return null;
    }
  };

  return (
    <>
      <div className="space-y-2">
        <Select value={selectedCurrency} onValueChange={handleCurrencyChange} disabled={isLoading}>
          <SelectTrigger
            id="currency-select"
            className="h-14 text-lg border-2 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 transition-colors duration-200 bg-white dark:bg-slate-800"
          >
            <SelectValue placeholder="Choose a currency" />
          </SelectTrigger>
          <SelectContent className="border-2 border-slate-200 dark:border-slate-700">
            <SelectItem
              value="USD"
              className="h-14 cursor-pointer hover:bg-green-50 dark:hover:bg-green-950/20"
            >
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30">
                  <DollarSign className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div className="flex flex-col items-start">
                  <span className="font-semibold text-slate-900 dark:text-slate-100">
                    US Dollar
                  </span>
                  <span className="text-sm text-slate-500 dark:text-slate-400">USD</span>
                </div>
              </div>
            </SelectItem>
            <SelectItem
              value="EUR"
              className="h-14 cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-950/20"
            >
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30">
                  <Euro className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold text-slate-900 dark:text-slate-100">Euro</span>
                  <span className="text-sm text-slate-500 dark:text-slate-400">EUR</span>
                </div>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {selectedCurrency && (
        <div className="flex items-center gap-3 p-4 rounded-lg bg-gradient-to-r from-slate-100 to-slate-50 dark:from-slate-800 dark:to-slate-700 border border-slate-200 dark:border-slate-600">
          {getCurrencyIcon(selectedCurrency)}
          <div>
            <p className="font-semibold text-slate-900 dark:text-slate-100">Selected Currency</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {selectedCurrency === 'USD' ? 'US Dollar (USD)' : 'Euro (EUR)'}
            </p>
          </div>
        </div>
      )}
    </>
  );
}
