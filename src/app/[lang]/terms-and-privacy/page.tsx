import React from 'react';
import Legal from '@/components/legal';
import { generatePageMetadata } from '@/lib/core/metadata';

export async function generateMetadata({ params }: { params: { lang: string } }) {
  return generatePageMetadata('/terms-and-privacy', params.lang);
}

export default function PrivacyAndTermsPage() {
  return <Legal />;
}
