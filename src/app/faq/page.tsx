import React from 'react';
import FAQPageComponent from '@/components/faq-page-component';
import { generatePageMetadata } from '@/lib/core/metadata';

export const metadata = generatePageMetadata('/faq');

export default function FAQPage() {
  return (
    <div>
      <FAQPageComponent />
    </div>
  );
}
