'use client';

import React from 'react';
import usePreselectedRoles from '@/lib/core/usePreselectedRoles';
import { RegistrationStepper } from '@/components/registration-stepper';

const RegistrationScreen: React.FunctionComponent = () => {
  const { preselectedRoles } = usePreselectedRoles();

  return <RegistrationStepper preselectedRoles={preselectedRoles} />;
};

export default RegistrationScreen;
