import React from 'react';
import FAQPageComponent from '@/components/faq-page-component';
import { NavbarComponent } from '@/components/navbar';

export default function FAQPage() {
  return (
    <div>
      <NavbarComponent background="none" />
      <FAQPageComponent />
    </div>
  );
}
