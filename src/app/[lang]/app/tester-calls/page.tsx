import { ListingComponent } from '@/components/listing';
import React from 'react';
import { redirect } from 'next/navigation';
import TestingQuickLinks from '@/lib/components/TestingQuickLinks';
import { generatePageMetadata } from '@/lib/core/metadata';
import { TESTER_CALLS_ENABLED } from '@/lib/constants';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  return generatePageMetadata('/app/tester-calls', lang);
}

export default function TestPage({ searchParams }: { searchParams: { [key: string]: string } }) {
  // Tester Calls feature is disabled — redirect visitors to the homepage. See TESTER_CALLS_ENABLED.
  if (!TESTER_CALLS_ENABLED) {
    redirect('/');
  }

  return (
    <div className="flex flex-col gap-4">
      <TestingQuickLinks />
      <ListingComponent initialQuery={searchParams} status={'Created'} />
    </div>
  );
}
