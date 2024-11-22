'use client';

import React from 'react';
import { RegistrationFormComponent } from '@/components/registration-form';
import usePreselectedRoles from '@/lib/core/usePreselectedRoles';

const RegistrationScreen: React.FunctionComponent = () => {
  const { preselectedRoles } = usePreselectedRoles();

  return <RegistrationFormComponent preselectedRoles={preselectedRoles} />;
};

export default RegistrationScreen;
