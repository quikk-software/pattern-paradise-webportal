import React from 'react';
import { ListingComponent } from '@/components/listing';
import { generatePageMetadata } from '@/lib/core/metadata';
import WelcomeBannerWrapper from '@/lib/components/WelcomeBannerWrapper';

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: { lang: string };
  searchParams: { [key: string]: string };
}) {
  const queryString = new URLSearchParams(searchParams).toString();
  const fullPath = queryString ? `/browse?${queryString}` : '/browse';
  const fallback = '/browse';

  return generatePageMetadata(fullPath, params.lang, fallback);
}

export default function BrowsePage({ searchParams }: { searchParams: { [key: string]: string } }) {
  return (
    <div className="space-y-4">
      <WelcomeBannerWrapper redirect="/browse" />
      <ListingComponent status={'Released'} initialQuery={searchParams} />
    </div>
  );
}
