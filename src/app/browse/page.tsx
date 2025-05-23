import React from 'react';
import { ListingComponent } from '@/components/listing';
import { generatePageMetadata } from '@/lib/core/metadata';

export const metadata = generatePageMetadata('/browse');

export default function BrowsePage({ searchParams }: { searchParams: { [key: string]: string } }) {
  return <ListingComponent status={'Released'} initialQuery={searchParams} />;
}
