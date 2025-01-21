import React from 'react';
import { PatternParadiseProComponent } from '@/components/pattern-paradise-pro';
import NotFoundPage from '@/app/not-found';
import { NavbarComponent } from '@/components/navbar';

export default function ProPage() {
  if (process.env.NEXT_PUBLIC_PATTERN_PARADISE_PRO_ACTIVE !== 'true') {
    return <NotFoundPage />;
  }

  return (
    <div className="bg-gradient-to-br from-gray-100 via-white to-gray-200 text-black">
      <NavbarComponent background="none" />
      <PatternParadiseProComponent />
    </div>
  );
}
