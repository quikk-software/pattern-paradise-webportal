import { ListingComponent } from '@/components/listing';
import React from 'react';
import TestingQuickLinks from '@/lib/components/TestingQuickLinks';
import { generatePageMetadata } from '@/lib/core/metadata';

export const metadata = generatePageMetadata('/app/tester-calls');

export default function TestPage() {
  return (
    <div className="flex flex-col gap-4">
      <TestingQuickLinks />
      <ListingComponent listingType={'test'} />
    </div>
  );
}
