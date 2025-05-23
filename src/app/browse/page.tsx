import React from 'react';
import { ListingComponent } from '@/components/listing';
import { generatePageMetadata } from '@/lib/core/metadata';
import WelcomeBannerWrapper from '@/lib/components/WelcomeBannerWrapper';

export const metadata = generatePageMetadata('/browse');

export default function BrowsePage({ searchParams }: { searchParams: { [key: string]: string } }) {
  return (
    <div className="space-y-4">
      <WelcomeBannerWrapper redirect="/browse" />
      <ListingComponent status={'Released'} initialQuery={searchParams} />
    </div>
  );
}
