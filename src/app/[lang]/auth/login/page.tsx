import React from 'react';
import LoginScreen from '@/lib/auth/Login.screen';
import { generatePageMetadata } from '@/lib/core/metadata';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  return generatePageMetadata('/auth/login', lang);
}

const LoginPage: React.FunctionComponent = () => {
  return <LoginScreen />;
};

export default LoginPage;
