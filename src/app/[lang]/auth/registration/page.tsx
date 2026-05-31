import React from 'react';
import RegistrationScreen from '@/lib/auth/Registration.screen';
import { generatePageMetadata } from '@/lib/core/metadata';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  return generatePageMetadata('/auth/registration', lang);
}

const RegistrationPage: React.FunctionComponent = () => {
  return <RegistrationScreen />;
};

export default RegistrationPage;
