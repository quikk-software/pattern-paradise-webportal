import React from 'react';
import { PatternParadiseProComponent } from '@/components/pattern-paradise-pro';
import FeatureComingSoon from '../../lib/components/FeatureComingSoon';

export default function ProPage() {
  if (process.env.NEXT_PUBLIC_PATTERN_PARADISE_PRO_ACTIVE !== 'true') {
    return <FeatureComingSoon />;
  }

  return (
    <div>
      <PatternParadiseProComponent />
    </div>
  );
}
