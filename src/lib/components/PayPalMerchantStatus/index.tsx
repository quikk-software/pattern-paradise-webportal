import type React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { CheckCircle, XCircle, Mail, Store, CreditCard, Link } from 'lucide-react';
import { GetUserPayPalMerchantStatusResponse } from '@/@types/api-types';

type PayPalMerchantStatusProps = GetUserPayPalMerchantStatusResponse;

const StatusIcon: React.FC<{ condition: boolean }> = ({ condition }) => {
  return condition ? (
    <CheckCircle className="w-5 h-5 text-green-500" />
  ) : (
    <XCircle className="w-5 h-5 text-red-500" />
  );
};

export default function PayPalMerchantStatus({
  paypalPaymentsReceivable,
  paypalLegalName,
  paypalPrimaryEmail,
  paypalPrimaryEmailConfirmed,
  hasOauthThirdParty,
}: PayPalMerchantStatusProps) {
  return (
    <div className="space-y-4">
      <span className="text-2xl font-bold">PayPal Merchant Status</span>
      {paypalLegalName ? (
        <div className="flex items-center space-x-2">
          <Store className="w-5 h-5 text-blue-500" />
          <span className="font-medium">Legal Name:</span>
          <span>{paypalLegalName}</span>
        </div>
      ) : null}

      <div className="flex items-center space-x-2">
        <Mail className="w-5 h-5 text-blue-500" />
        <span className="font-medium">Email:</span>
        <span>{paypalPrimaryEmail}</span>
      </div>

      <div className="flex items-center space-x-2">
        <StatusIcon condition={paypalPrimaryEmailConfirmed} />
        <span className="font-medium">Email Confirmed:</span>
        <span>{paypalPrimaryEmailConfirmed ? 'Yes' : 'No'}</span>
      </div>

      <div className="flex items-center space-x-2">
        <CreditCard className="w-5 h-5 text-blue-500" />
        <span className="font-medium">Can Receive Payments:</span>
        <span>{paypalPaymentsReceivable ? 'Yes' : 'No'}</span>
      </div>

      <div className="flex items-center space-x-2">
        <Link className="w-5 h-5 text-blue-500" />
        <span className="font-medium">OAuth Connected:</span>
        <span>{hasOauthThirdParty ? 'Yes' : 'No'}</span>
      </div>
    </div>
  );
}
