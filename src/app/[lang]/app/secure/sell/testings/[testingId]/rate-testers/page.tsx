import React from 'react';
import TesterRatingOverview from '@/lib/components/TesterRatingOverview';

export default async function RateTestersPage({ params }: { params: Promise<{ testingId: string }> }) {
  const { testingId } = await params;
  return <TesterRatingOverview testingId={testingId} />;
}
