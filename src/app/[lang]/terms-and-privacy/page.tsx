import React from 'react';
import Legal from '@/components/legal';
import { generatePageMetadata } from '@/lib/core/metadata';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  return generatePageMetadata('/terms-and-privacy', lang);
}

export default function PrivacyAndTermsPage() {
  return <Legal />;
}
