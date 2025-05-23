import { ListingComponent } from '@/components/listing';
import React from 'react';
import TestingQuickLinks from '@/lib/components/TestingQuickLinks';
import { generatePageMetadata } from '@/lib/core/metadata';

export const metadata = generatePageMetadata('/app/tester-calls');

export default function TestPage({ searchParams }: { searchParams: { [key: string]: string } }) {
  return (
    <div className="flex flex-col gap-4">
      <TestingQuickLinks />
      <ListingComponent initialQuery={searchParams} status={'Created'} />
    </div>
  );
}
