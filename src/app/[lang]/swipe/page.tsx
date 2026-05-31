import React from 'react';

import SwipePageComponent from '@/components/swipe-page';
import { generatePageMetadata } from '@/lib/core/metadata';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  return generatePageMetadata('/swipe', lang);
}

export default function SwipePage() {
  return <SwipePageComponent />;
}
