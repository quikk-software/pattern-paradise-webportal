'use client';

import { usePathname } from 'next/navigation';
import pages from '@/lib/hooks/routes/index';
import { useMemo } from 'react';

const useCurrentPage = () => {
  const pathname = usePathname();
  const currentPage = useMemo(() => pages.find((page) => page.pathname === pathname)!, [pathname]);

  return currentPage;
};

export default useCurrentPage;
