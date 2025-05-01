import React from 'react';
import LoginScreen from '@/lib/auth/Login.screen';
import { generatePageMetadata } from '@/lib/core/metadata';

export const metadata = generatePageMetadata('/auth/login');

const LoginPage: React.FunctionComponent = () => {
  return <LoginScreen />;
};

export default LoginPage;
