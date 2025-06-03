import React from 'react';
import MysteryPageComponent from '@/components/mystery-page';
import FeatureComingSoon from '@/lib/components/FeatureComingSoon';
import { generatePageMetadata } from '@/lib/core/metadata';

export async function generateMetadata({ params }: { params: { lang: string } }) {
  return generatePageMetadata('/app/products/mystery-patterns/crochet', params.lang);
}

export default async function MysteryPage() {
  if (process.env.NEXT_PUBLIC_MYSTERY_BOX_ACTIVE !== 'true') {
    return <FeatureComingSoon />;
  }

  return <MysteryPageComponent category={'Crocheting'} displayName={'Crochet'} />;
}
