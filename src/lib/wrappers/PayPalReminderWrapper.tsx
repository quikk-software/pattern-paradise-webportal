'use client';

import { PropsWithChildren, useEffect, useState } from 'react';
import PaymentProviderReminder from '../components/PaymentProviderReminder';
import { useGetUser } from '@/lib/api';
import { useSelector } from 'react-redux';
import { Store } from '@/lib/redux/store';

export default function PayPalReminderWrapper({ children }: PropsWithChildren) {
  const [showPaymentProviderReminder, setShowPaymentProviderReminder] = useState(false);

  const { fetch } = useGetUser();

  const { userId } = useSelector((s: Store) => s.auth);

  useEffect(() => {
    fetch(userId).then((user) =>
      setShowPaymentProviderReminder(
        !!user?.roles?.includes('Seller') &&
          !user?.paypalMerchantIsActive &&
          !user?.stripeAccountId,
      ),
    );
  }, [userId]);

  return (
    <>
      {children}
      <PaymentProviderReminder
        open={showPaymentProviderReminder}
        setOpen={setShowPaymentProviderReminder}
      />
    </>
  );
}
