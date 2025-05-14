'use client';

import PrivacyPolicy from '@/components/privacy-policy';
import Imprint from '@/components/imprint';
import useAction from '@/lib/core/useAction';
import { MutableRefObject, useEffect, useRef } from 'react';
import TermsAndConditions from '@/components/terms-and-conditions';

export default function Legal() {
  const { action } = useAction();

  const paymentPolicyRef = useRef<HTMLDivElement | null>(null);
  const privacyPolicyRef = useRef<HTMLDivElement | null>(null);
  const termsAndConditionsRef = useRef<HTMLDivElement | null>(null);

  const executeScroll = (ref: MutableRefObject<HTMLDivElement | null>) => {
    ref.current?.scrollIntoView();
  };

  useEffect(() => {
    switch (action) {
      case 'scrollToPaymentPolicy':
        executeScroll(paymentPolicyRef);
        break;
      case 'scrollToPrivacyPolicy':
        executeScroll(privacyPolicyRef);
        break;
      case 'scrollToTermsAndConditions':
        executeScroll(termsAndConditionsRef);
        break;
      default:
        break;
    }
  }, [action]);

  return (
    <div className="space-y-4">
      <Imprint />
      <PrivacyPolicy privacyPolicyRef={privacyPolicyRef} />
      <TermsAndConditions termsAndConditionsRef={termsAndConditionsRef} />
    </div>
  );
}
