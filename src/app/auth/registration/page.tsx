import React from 'react';
import RegistrationScreen from '@/lib/auth/Registration.screen';
import { generatePageMetadata } from '@/lib/core/metadata';

export const metadata = generatePageMetadata('/auth/registration');

const RegistrationPage: React.FunctionComponent = () => {
  return <RegistrationScreen />;
};

export default RegistrationPage;
