import React from 'react';
import ContactForm from '@/components/contact-form';
import { NavbarComponent } from '@/components/navbar';

export default function HelpPage() {
  return (
    <div>
      <NavbarComponent background="none" />
      <ContactForm />
    </div>
  );
}
