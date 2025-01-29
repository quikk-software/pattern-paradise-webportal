import React from 'react';
import { PatternParadiseProComponent } from '@/components/pattern-paradise-pro';
import NotFoundPage from '@/app/not-found';

export default function ProPage() {
  if (process.env.NEXT_PUBLIC_PATTERN_PARADISE_PRO_ACTIVE !== 'true') {
    return <NotFoundPage />;
  }

  return (
    <div>
      <PatternParadiseProComponent />
    </div>
  );
}
