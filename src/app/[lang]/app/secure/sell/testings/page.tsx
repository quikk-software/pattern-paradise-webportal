import React from 'react';
import { redirect } from 'next/navigation';
import { TestingPageComponent } from '@/components/testing-page';
import { TESTER_CALLS_ENABLED } from '@/lib/constants';

export default function TestingsPage() {
  // Tester Calls feature is disabled — redirect the seller-side testings overview to the homepage.
  if (!TESTER_CALLS_ENABLED) {
    redirect('/');
  }

  return <TestingPageComponent filter={'seller'} />;
}
