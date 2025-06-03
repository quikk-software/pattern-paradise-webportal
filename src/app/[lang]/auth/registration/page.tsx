import React from 'react';
import RegistrationScreen from '@/lib/auth/Registration.screen';
import { generatePageMetadata } from '@/lib/core/metadata';

export async function generateMetadata({ params }: { params: { lang: string } }) {
  return generatePageMetadata('/auth/registration', params.lang);
}

const RegistrationPage: React.FunctionComponent = () => {
  return <RegistrationScreen />;
};

export default RegistrationPage;
