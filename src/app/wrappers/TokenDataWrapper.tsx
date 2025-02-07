'use client';

import { PropsWithChildren, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useSession } from 'next-auth/react';
import { setRoles, setSubscriptionStatus, setUserId } from '@/lib/features/auth/authSlice';

export default function TokenDataWrapper({ children }: PropsWithChildren) {
  const dispatch = useDispatch();
  const { data: session } = useSession();

  useEffect(() => {
    dispatch(setUserId(session?.user.id || ''));
    dispatch(setRoles(session?.user.roles || []));
    dispatch(setSubscriptionStatus(session?.user.subscriptionStatus || ''));
  }, [session?.user]);

  return <>{children}</>;
}
