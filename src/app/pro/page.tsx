import React from 'react';
import { PatternParadiseProComponent } from '@/components/pattern-paradise-pro';
import FeatureComingSoon from '../../lib/components/FeatureComingSoon';
import pages from '@/lib/hooks/routes';
import type { Metadata } from 'next';
import { APP_DESCRIPTION, APP_NAME } from '@/lib/constants';

const page = pages.find((page) => page.pathname === '/pro');

export const metadata: Metadata = {
  title: page?.title ?? APP_NAME,
  description: page?.description ?? APP_DESCRIPTION,
};

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
