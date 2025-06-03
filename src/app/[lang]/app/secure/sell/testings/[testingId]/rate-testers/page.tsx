import React from 'react';
import TesterRatingOverview from '@/lib/components/TesterRatingOverview';

export default function RateTestersPage({ params }: { params: { testingId: string } }) {
  return <TesterRatingOverview testingId={params.testingId} />;
}
