import React from 'react';
import AboutPageComponent from '@/components/about-page';
import { generatePageMetadata } from '@/lib/core/metadata';

export const metadata = generatePageMetadata('/about');

export default function AboutPage() {
  return (
    <div>
      <AboutPageComponent />
    </div>
  );
}
