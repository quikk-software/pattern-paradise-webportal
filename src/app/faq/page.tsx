import React from 'react';
import { generatePageMetadata } from '@/lib/core/metadata';
import FAQPageComponent from '@/lib/components/FAQ';

export const metadata = generatePageMetadata('/faq');

export default function FAQPage() {
  return <FAQPageComponent />;
}
