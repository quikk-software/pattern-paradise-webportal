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
  const sp = await searchParams;
  const p = await params;
  const queryString = new URLSearchParams(sp).toString();
  const fullPath = queryString ? `/browse?${queryString}` : '/browse';
  const fallback = '/browse';

  return generatePageMetadata(fullPath, p.lang, fallback);
}

export default async function BrowsePage({
  searchParams,
}: {
  searchParams: { [key: string]: string };
}) {
  const sp = await searchParams;

  return (
    <div className="space-y-4">
      <WelcomeBannerWrapper redirect="/browse" />
      <ListingComponent status={'Released'} initialQuery={sp} />
    </div>
  );
}
