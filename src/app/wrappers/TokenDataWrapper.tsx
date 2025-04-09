'use client';

import { PropsWithChildren, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useValidSession } from '@/hooks/useValidSession';
import {
  setEmail,
  setRoles,
  setSubscriptionStatus,
  setUserId,
  setUsername,
} from '@/lib/features/auth/authSlice';

export default function TokenDataWrapper({ children }: PropsWithChildren) {
  const dispatch = useDispatch();
  const { data: session } = useValidSession();

  useEffect(() => {
    dispatch(setUserId(session?.user.id || ''));
    dispatch(setEmail(session?.user.email || ''));
    dispatch(setUsername(session?.user.name || ''));
    dispatch(setRoles(session?.user.roles || []));
    dispatch(setSubscriptionStatus(session?.user.subscriptionStatus || ''));
  }, [session?.user]);

  return <>{children}</>;
}
