import React from 'react';
import ContactForm from '@/components/contact-form';
import { generatePageMetadata } from '@/lib/core/metadata';

export async function generateMetadata({ params }: { params: { lang: string } }) {
  return generatePageMetadata('/help', params.lang);
}

export default function HelpPage() {
  return <ContactForm />;
}
