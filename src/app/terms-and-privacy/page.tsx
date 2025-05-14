import React from 'react';
import Legal from '@/components/legal';
import { generatePageMetadata } from '@/lib/core/metadata';

export const metadata = generatePageMetadata('/terms-and-privacy');

export default function PrivacyAndTermsPage() {
  return (
    <div>
      <Legal />
    </div>
  );
}
