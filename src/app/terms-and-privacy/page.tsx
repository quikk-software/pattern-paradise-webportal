import React from 'react';
import TermsAndConditions from '@/components/terms-and-conditions';
import { NavbarComponent } from '@/components/navbar';

export default function PrivacyAndTermsPage() {
  return (
    <div>
      <NavbarComponent background="none" />
      <TermsAndConditions />
    </div>
  );
}
