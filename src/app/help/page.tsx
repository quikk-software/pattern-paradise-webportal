import React from 'react';
import ContactForm from '@/components/contact-form';
import { generatePageMetadata } from '@/lib/core/metadata';

export const metadata = generatePageMetadata('/help');

export default function HelpPage() {
  return <ContactForm />;
}
