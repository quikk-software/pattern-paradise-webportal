import type React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>PayPal Merchant Status</span>
          <Badge variant={paypalPaymentsReceivable ? 'success' : 'destructive'}>
            {paypalPaymentsReceivable ? 'Active' : 'Inactive'}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-2">
          <Store className="w-5 h-5 text-blue-500" />
          <span className="font-medium">Legal Name:</span>
          <span>{paypalLegalName}</span>
        </div>

        <div className="flex items-center space-x-2">
          <Mail className="w-5 h-5 text-blue-500" />
          <span className="font-medium">Primary Email:</span>
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
      </CardContent>
    </Card>
  );
}
