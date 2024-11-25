'use client';

import React from 'react';
import useVerificationCode from '@/lib/core/useVerificationCode';
import useVerificationType from '@/lib/core/useVerificationType';
import ConfirmCodeComponent from '@/components/confirm-code';

export default function ConfirmPage() {
  const { verificationCode } = useVerificationCode();
  const { verificationType } = useVerificationType();
  return (
    <ConfirmCodeComponent verificationCode={verificationCode} verificationType={verificationType} />
  );
}
