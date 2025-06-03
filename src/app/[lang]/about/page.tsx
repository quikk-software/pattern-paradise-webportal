import React from 'react';
import AboutPageComponent from '@/components/about-page';
import { generatePageMetadata } from '@/lib/core/metadata';

export async function generateMetadata({ params }: { params: { lang: string } }) {
  return generatePageMetadata('/about', params.lang);
}

export default function AboutPage() {
  return <AboutPageComponent />;
}
