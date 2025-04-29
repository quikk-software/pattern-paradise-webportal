import React from 'react';
import TermsAndConditions from '@/components/terms-and-conditions';
import pages from '@/lib/hooks/routes';
import type { Metadata } from 'next';
import { APP_DESCRIPTION, APP_NAME } from '@/lib/constants';

const page = pages.find((page) => page.pathname === '/terms-and-privacy');

export const metadata: Metadata = {
  title: page?.title ?? APP_NAME,
  description: page?.description ?? APP_DESCRIPTION,
};

export default function PrivacyAndTermsPage() {
  return (
    <div>
      <TermsAndConditions />
    </div>
  );
}
