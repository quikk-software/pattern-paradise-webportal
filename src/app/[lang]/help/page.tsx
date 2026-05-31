import React from 'react';
import ContactForm from '@/components/contact-form';
import { generatePageMetadata } from '@/lib/core/metadata';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  return generatePageMetadata('/help', lang);
}

export default function HelpPage() {
  return <ContactForm />;
}
