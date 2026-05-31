import React from 'react';
import ResetPasswordComponent from '@/components/reset-password';
import { generatePageMetadata } from '@/lib/core/metadata';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  return generatePageMetadata('/auth/reset-password', lang);
}

export default function ResetPasswordPage() {
  return <ResetPasswordComponent />;
}
