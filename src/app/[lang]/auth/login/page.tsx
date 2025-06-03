import React from 'react';
import LoginScreen from '@/lib/auth/Login.screen';
import { generatePageMetadata } from '@/lib/core/metadata';

export async function generateMetadata({ params }: { params: { lang: string } }) {
  return generatePageMetadata('/auth/login', params.lang);
}

const LoginPage: React.FunctionComponent = () => {
  return <LoginScreen />;
};

export default LoginPage;
