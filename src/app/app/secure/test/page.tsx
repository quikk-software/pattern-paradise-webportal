import { ListingComponent } from '@/components/listing';
import React from 'react';
import TestingQuickLinks from '@/lib/components/TestingQuickLinks';

export default function TestPage() {
  return (
    <div className="flex flex-col gap-4">
      <TestingQuickLinks />
      <ListingComponent listingType={'test'} />
    </div>
  );
}
