'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Coffee, Heart } from 'lucide-react';

interface PayPalTipButtonProps {
  paypalEmail: string;
  defaultAmounts?: number[];
  buttonText?: string;
  currency?: string;
  showIcon?: 'coffee' | 'heart' | 'none';
}

export function TipButton({
  paypalEmail,
  defaultAmounts = [3, 5, 10],
  buttonText = 'Support Me',
  currency = 'USD',
  showIcon = 'heart',
}: PayPalTipButtonProps) {
  const [customAmount, setCustomAmount] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleTip = (amount: number | string) => {
    const tipAmount = typeof amount === 'string' ? Number.parseFloat(amount) : amount;

    if (isNaN(tipAmount) || tipAmount <= 0 || tipAmount >= 10000) {
      setError('Amount is invalid. Please choose an amount between 0.00$ and 10.000$');
      return;
    }
    setError('');

    const paypalUrl = `https://www.paypal.com/donate/?business=${encodeURIComponent(paypalEmail)}&amount=${tipAmount}&currency_code=${currency}`;
    window.open(paypalUrl, '_blank');
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          className="bg-rose-600 hover:bg-rose-500 focus:bg-rose-500 w-full"
          onClick={() => {
            setError('');
            setCustomAmount('');
          }}
        >
          {showIcon === 'coffee' && <Coffee className="w-4 h-4" />}
          {showIcon === 'heart' && <Heart className="w-4 h-4" />}
          {buttonText}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Choose tip amount</h4>
            <p className="text-sm text-muted-foreground">
              Select a preset amount or enter a custom value
            </p>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {defaultAmounts.map((amount) => (
              <Button
                key={amount}
                variant="outline"
                onClick={() => handleTip(amount)}
                className="hover:bg-blue-50 hover:border-blue-200 transition-colors"
              >
                ${amount}
              </Button>
            ))}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="custom-amount">Custom amount</Label>
            <div className="flex flex-col gap-2">
              <Input
                id="custom-amount"
                type="number"
                min="0.50"
                max="10000"
                step="0.50"
                placeholder="Enter amount (in USD)"
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
              />
              <div className="flex flex-col gap-1">
                <Button
                  onClick={() => handleTip(customAmount)}
                  disabled={!customAmount || Number.parseFloat(customAmount) <= 0}
                >
                  Tip
                </Button>
                {error ? <p className="text-red-500 text-xs">{error}</p> : null}
              </div>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
