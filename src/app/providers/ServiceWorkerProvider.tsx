import type React from 'react';
import ServiceWorkerRegister from '@/lib/core/serviceWorkerRegister';

export function ServiceWorkerProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ServiceWorkerRegister />
      {children}
    </>
  );
}
