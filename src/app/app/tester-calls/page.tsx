import { ListingComponent } from '@/components/listing';
import React from 'react';
import TestingQuickLinks from '@/lib/components/TestingQuickLinks';
import pages from '@/lib/hooks/routes';
import type { Metadata } from 'next';
import { APP_DESCRIPTION, APP_NAME } from '@/lib/constants';

const page = pages.find((page) => page.pathname === '/app/tester-calls');

export const metadata: Metadata = {
  title: page?.title ?? APP_NAME,
  description: page?.description ?? APP_DESCRIPTION,
};

export default function TestPage() {
  return (
    <div className="flex flex-col gap-4">
      <TestingQuickLinks />
      <ListingComponent listingType={'test'} />
    </div>
  );
}
