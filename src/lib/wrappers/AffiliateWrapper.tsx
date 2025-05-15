'use client';

import { PropsWithChildren, useEffect } from 'react';
import useAffiliate from '@/lib/core/useAffiliate';

export default function AffiliateWrapper({ children }: PropsWithChildren) {
  const { affiliate } = useAffiliate();

  useEffect(() => {
    if (!affiliate || typeof window === 'undefined') {
      return;
    }
    sessionStorage.setItem('affiliate', affiliate);
  }, [affiliate]);

  return <>{children}</>;
}
