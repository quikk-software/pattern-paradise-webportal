'use client';

import React, { PropsWithChildren, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { LoadingSpinnerComponent } from '@/components/loading-spinner';
import { buildQueryString } from '@/lib/utils';
import useGetAllSearchParams from '@/lib/core/useGetAllSearchParams';
import { useSession } from 'next-auth/react';
import { useDispatch } from 'react-redux';
import { setRoles, setUserId } from '@/lib/features/auth/authSlice';

const AuthGuard: React.FunctionComponent<PropsWithChildren<Record<never, any>>> = ({
  children,
}) => {
  const { data: session, status } = useSession();
  const router = useRouter();

  const dispatch = useDispatch();
  const pathname = usePathname();
  const allSearchParams = useGetAllSearchParams();

  const query = allSearchParams ? buildQueryString(allSearchParams) : null;
  const redirect = query ? `${pathname}?${query}` : pathname;
  const encodedRedirect = encodeURIComponent(redirect);

  const isLoading = status === 'loading';

  useEffect(() => {
    if (status === 'unauthenticated' || (session as any)?.error === 'RefreshAccessTokenError') {
      router.push(`/auth/login?redirect=${encodedRedirect}`);
    }
    dispatch(setUserId(session?.user.id || ''));
    dispatch(setRoles(session?.user.roles || []));
  }, [status, session, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <LoadingSpinnerComponent />
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthGuard;
