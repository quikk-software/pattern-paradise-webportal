'use client';

import { PropsWithChildren, useEffect, useState } from 'react';
import PayPalReminder from '@/lib/components/PayPalReminder';
import { useGetUser } from '@/lib/api';
import { useSelector } from 'react-redux';
import { Store } from '@/lib/redux/store';

export default function PayPalReminderWrapper({ children }: PropsWithChildren) {
  const [showPayPalReminder, setShowPayPalReminder] = useState(false);

  const { fetch } = useGetUser();

  const { userId } = useSelector((s: Store) => s.auth);

  useEffect(() => {
    fetch(userId).then((user) =>
      setShowPayPalReminder(!!user?.roles?.includes('Seller') && !user?.paypalMerchantIsActive),
    );
  }, [userId]);

  return (
    <>
      {children}
      <PayPalReminder open={showPayPalReminder} setOpen={setShowPayPalReminder} />
    </>
  );
}
