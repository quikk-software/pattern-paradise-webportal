import React from 'react';
import ResetPasswordComponent from '@/components/reset-password';
import { generatePageMetadata } from '@/lib/core/metadata';

export const metadata = generatePageMetadata('/auth/reset-password');

export default function ResetPasswordPage() {
  return <ResetPasswordComponent />;
}
