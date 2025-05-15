import React from 'react';

import SwipePageComponent from '@/components/swipe-page';
import { generatePageMetadata } from '@/lib/core/metadata';

export const metadata = generatePageMetadata('/swipe');

export default function SwipePage() {
  return <SwipePageComponent />;
}
