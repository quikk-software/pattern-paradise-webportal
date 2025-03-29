import type React from 'react';
import ServiceWorkerRegister from '@/lib/core/ServiceWorkerRegister';

export function ServiceWorkerProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ServiceWorkerRegister />
      {children}
    </>
  );
}
