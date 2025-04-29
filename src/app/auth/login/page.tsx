import React from 'react';
import LoginScreen from '@/lib/auth/Login.screen';
import pages from '@/lib/hooks/routes';
import type { Metadata } from 'next';
import { APP_DESCRIPTION, APP_NAME } from '@/lib/constants';

const page = pages.find((page) => page.pathname === '/auth/login');

export const metadata: Metadata = {
  title: page?.title ?? APP_NAME,
  description: page?.description ?? APP_DESCRIPTION,
};

const LoginPage: React.FunctionComponent = () => {
  return <LoginScreen />;
};

export default LoginPage;
