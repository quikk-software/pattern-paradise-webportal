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
            className="h-14 text-lg border-2 border-slate-200 hover:border-slate-300 transition-colors duration-200 bg-white"
          >
            <SelectValue placeholder="Choose a currency" />
          </SelectTrigger>
          <SelectContent className="border-2 border-slate-200">
            <SelectItem value="USD" className="h-14 cursor-pointer hover:bg-green-50">
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-100">
                  <DollarSign className="h-5 w-5 text-green-600" />
                </div>
                <div className="flex flex-col items-start">
                  <span className="font-semibold text-slate-900">US Dollar</span>
                  <span className="text-sm text-slate-500">USD</span>
                </div>
              </div>
            </SelectItem>
            <SelectItem value="EUR" className="h-14 cursor-pointer hover:bg-blue-50">
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100">
                  <Euro className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold text-slate-900">Euro</span>
                  <span className="text-sm text-slate-500">EUR</span>
                </div>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {selectedCurrency && (
        <div className="flex items-center gap-3 p-4 rounded-lg bg-gradient-to-r from-slate-100 to-slate-50 border border-slate-200">
          {getCurrencyIcon(selectedCurrency)}
          <div>
            <p className="font-semibold text-slate-900">Selected Currency</p>
            <p className="text-sm text-slate-600">
              {selectedCurrency === 'USD' ? 'US Dollar (USD)' : 'Euro (EUR)'}
            </p>
          </div>
        </div>
      )}
    </>
  );
}
