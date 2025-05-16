'use client';

import { useSearchParams } from 'next/navigation';
import { createContext, useContext, useMemo } from 'react';

const PreviewContext = createContext({ isPreview: false });

export const PreviewFlagProvider = ({ children }: { children: React.ReactNode }) => {
  const searchParams = useSearchParams();
  const isPreview = searchParams?.get('preview') === 'true';

  const value = useMemo(() => ({ isPreview }), [isPreview]);

  return <PreviewContext.Provider value={value}>{children}</PreviewContext.Provider>;
};

export const usePreview = () => useContext(PreviewContext);
