import React from 'react';
import MysteryPageComponent from '@/components/mystery-page';
import FeatureComingSoon from '@/lib/components/FeatureComingSoon';
import pages from '@/lib/hooks/routes';
import type { Metadata } from 'next';
import { APP_DESCRIPTION, APP_NAME } from '@/lib/constants';

const page = pages.find((page) => page.pathname === '/app/mystery');

export const metadata: Metadata = {
  title: page?.title ?? APP_NAME,
  description: page?.description ?? APP_DESCRIPTION,
};

export default async function MysteryPage() {
  if (process.env.NEXT_PUBLIC_MYSTERY_BOX_ACTIVE !== 'true') {
    return <FeatureComingSoon />;
  }

  return <MysteryPageComponent category={'Crocheting'} />;
}
