import React from 'react';
import TermsAndConditions from '@/components/terms-and-conditions';
import { generatePageMetadata } from '@/lib/core/metadata';

export const metadata = generatePageMetadata('/terms-and-privacy');

export default function PrivacyAndTermsPage() {
  return (
    <div>
      <TermsAndConditions />
    </div>
  );
}
