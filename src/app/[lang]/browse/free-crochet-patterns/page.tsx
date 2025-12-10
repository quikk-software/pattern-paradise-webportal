import React from 'react';
import { ListingComponent } from '@/components/listing';
import { generatePageMetadata } from '@/lib/core/metadata';
import WelcomeBannerWrapper from '@/lib/components/WelcomeBannerWrapper';
import { FreePatternsHero } from '@/components/free-patterns-hero';

export async function generateMetadata({ params }: { params: { lang: string } }) {
  const p = await params;
  const fullPath = '/browse/free-crochet-patterns';

  return generatePageMetadata(fullPath, p.lang);
}

export default async function BrowsePage() {
  return (
    <div className="space-y-4">
      <WelcomeBannerWrapper redirect="/browse/free-crochet-patterns" />
      <FreePatternsHero />
      <ListingComponent
        status={'Released'}
        initialQuery={{
          sortBy: 'mostRelevant',
          maxPrice: '0',
          craft: 'Crocheting',
        }}
      />
    </div>
  );
}
