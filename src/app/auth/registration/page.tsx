import React from 'react';
import RegistrationScreen from '@/lib/auth/Registration.screen';
import pages from '@/lib/hooks/routes';
import type { Metadata } from 'next';
import { APP_DESCRIPTION, APP_NAME } from '@/lib/constants';

const page = pages.find((page) => page.pathname === '/auth/registration');

export const metadata: Metadata = {
  title: page?.title ?? APP_NAME,
  description: page?.description ?? APP_DESCRIPTION,
};

const RegistrationPage: React.FunctionComponent = () => {
  return <RegistrationScreen />;
};

export default RegistrationPage;
