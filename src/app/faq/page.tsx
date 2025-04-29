import React from 'react';
import FAQPageComponent from '@/components/faq-page-component';
import pages from '@/lib/hooks/routes';
import type { Metadata } from 'next';
import { APP_DESCRIPTION, APP_NAME } from '@/lib/constants';

const page = pages.find((page) => page.pathname === '/faq');

export const metadata: Metadata = {
  title: page?.title ?? APP_NAME,
  description: page?.description ?? APP_DESCRIPTION,
};

export default function FAQPage() {
  return (
    <div>
      <FAQPageComponent />
    </div>
  );
}
