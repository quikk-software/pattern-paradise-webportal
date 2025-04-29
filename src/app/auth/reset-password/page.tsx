import React from 'react';
import ResetPasswordComponent from '@/components/reset-password';
import pages from '@/lib/hooks/routes';
import type { Metadata } from 'next';
import { APP_DESCRIPTION, APP_NAME } from '@/lib/constants';

const page = pages.find((page) => page.pathname === '/auth/reset-password');

export const metadata: Metadata = {
  title: page?.title ?? APP_NAME,
  description: page?.description ?? APP_DESCRIPTION,
};

export default function ResetPasswordPage() {
  return <ResetPasswordComponent />;
}
