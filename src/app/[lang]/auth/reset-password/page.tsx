import React from 'react';
import ResetPasswordComponent from '@/components/reset-password';
import { generatePageMetadata } from '@/lib/core/metadata';

export async function generateMetadata({ params }: { params: { lang: string } }) {
  return generatePageMetadata('/auth/reset-password', params.lang);
}

export default function ResetPasswordPage() {
  return <ResetPasswordComponent />;
}
