import { Building2, User } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { InfoIconPopover } from '@/lib/components/InfoIconPopover';
import React from 'react';
import Link from 'next/link';

interface PayPalAccountSelectorProps {
  selectedType: 'business' | 'personal' | null;
  setSelectedType: (selectedType: 'business' | 'personal') => void;
}

export default function PayPalAccountSelector({
  selectedType,
  setSelectedType,
}: PayPalAccountSelectorProps) {
  const handleTypeSelect = (type: 'business' | 'personal') => {
    setSelectedType(type);
  };

  return (
    <div>
      <h2 className="text-sm font-bold">
        What type of PayPal account do you have?{' '}
        <InfoIconPopover
          title={'Why do we need to know this?'}
          content={
            'PayPal Business Accounts are not available in every country. In order to sell your products via Pattern Paradise, you can also use your personal PayPal account. In this case, PayPal only offers your customers payment via Express Checkout. In order to use all PayPal functions such as payment via Apple and Google Pay, you need a PayPal Business account.'
          }
        />
      </h2>
      <p className="text-xs text-muted-foreground mb-2">
        ⚠️ Note: Selecting 'Business' when you don't have access to a{' '}
        <Link
          href="https://www.paypal.com/business"
          target="_blank"
          className="text-blue-500 underline"
        >
          PayPal Business
        </Link>{' '}
        account may cause errors when processing your customers' payments.
      </p>
      <div className="grid grid-cols-2 gap-2">
        <Card
          className={`cursor-pointer transition-all duration-300 ${
            selectedType === 'business' ? 'ring-2 ring-primary' : 'hover:shadow-lg'
          }`}
          onClick={() => handleTypeSelect('business')}
        >
          <CardContent className="flex flex-col items-center justify-center p-2">
            <Building2 className="w-8 h-8 text-primary mb-2" />
            <h3 className="text-lg font-semibold text-center">Business</h3>
          </CardContent>
        </Card>

        <Card
          className={`cursor-pointer transition-all duration-300 ${
            selectedType === 'personal' ? 'ring-2 ring-primary' : 'hover:shadow-lg'
          }`}
          onClick={() => handleTypeSelect('personal')}
        >
          <CardContent className="flex flex-col items-center justify-center p-2">
            <User className="w-8 h-8 text-primary mb-2" />
            <h3 className="text-lg font-semibold text-center">Personal</h3>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
