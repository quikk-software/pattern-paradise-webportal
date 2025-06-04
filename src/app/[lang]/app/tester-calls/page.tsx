import { ListingComponent } from '@/components/listing';
import React from 'react';
import TestingQuickLinks from '@/lib/components/TestingQuickLinks';
import { generatePageMetadata } from '@/lib/core/metadata';

export async function generateMetadata({ params }: { params: { lang: string } }) {
  return generatePageMetadata('/app/tester-calls', params.lang);
}

export default function TestPage({ searchParams }: { searchParams: { [key: string]: string } }) {
  return (
    <div className="flex flex-col gap-4">
      <TestingQuickLinks />
      <ListingComponent initialQuery={searchParams} status={'Created'} />
    </div>
  );
}
