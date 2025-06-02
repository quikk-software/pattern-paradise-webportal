import React from 'react';

import SwipePageComponent from '@/components/swipe-page';
import { generatePageMetadata } from '@/lib/core/metadata';

export async function generateMetadata({ params }: { params: { lang: string } }) {
  return generatePageMetadata('/swipe', params.lang);
}

export default function SwipePage() {
  return <SwipePageComponent />;
}
