'use client';

import React, { PropsWithChildren, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { LoadingSpinnerComponent } from '@/components/loading-spinner';
import { buildQueryString } from '@/lib/utils';
import useGetAllSearchParams from '@/lib/core/useGetAllSearchParams';
import { useValidSession } from '@/hooks/useValidSession';
import { useDispatch } from 'react-redux';
import {
  setRoles,
  setUserId,
  setSubscriptionStatus,
  setEmail,
  setUsername,
} from '@/lib/features/auth/authSlice';
import PayPalReminderWrapper from '@/app/wrappers/PayPalReminderWrapper';
import { usePushNotification } from '@/app/providers/PushNotificationProvider';
import { signOut } from 'next-auth/react';

const AuthGuard: React.FunctionComponent<PropsWithChildren<Record<never, any>>> = ({
  children,
}) => {
  const { data: session, status } = useValidSession();
  const router = useRouter();

  const dispatch = useDispatch();
  const pathname = usePathname();
  const allSearchParams = useGetAllSearchParams();

  const { fcmToken, sendTokenToBackend } = usePushNotification();

  const query = allSearchParams ? buildQueryString(allSearchParams) : null;
  const redirect = query ? `${pathname}?${query}` : pathname;
  const encodedRedirect = encodeURIComponent(redirect);

  const isLoading = status === 'loading';

  useEffect(() => {
    if (status === 'unauthenticated' || (session as any)?.error === 'RefreshAccessTokenError') {
      signOut({ callbackUrl: `/auth/login?redirect=${encodedRedirect}` }).then();
      return;
    }
    dispatch(setUserId(session?.user.id || ''));
    dispatch(setEmail(session?.user.email || ''));
    dispatch(setUsername(session?.user.name || ''));
    dispatch(setRoles(session?.user.roles || []));
    dispatch(setSubscriptionStatus(session?.user.subscriptionStatus || ''));
    if (fcmToken && session?.user.id) {
      sendTokenToBackend?.(session.user.id, fcmToken);
    }
  }, [status, session, router, fcmToken]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <LoadingSpinnerComponent />
      </div>
    );
  }

  return <PayPalReminderWrapper>{children}</PayPalReminderWrapper>;
};

export default AuthGuard;
