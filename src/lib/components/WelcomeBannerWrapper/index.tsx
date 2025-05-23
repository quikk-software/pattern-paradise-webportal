'use client';

import React from 'react';
import WelcomeBanner from '@/lib/components/WelcomeBanner';
import { useRouter } from 'next/navigation';

interface WelcomeBannerWrapperProps {
  redirect: string;
}

export default function WelcomeBannerWrapper({ redirect }: WelcomeBannerWrapperProps) {
  const router = useRouter();

  return (
    <WelcomeBanner
      onContinue={() => router.push(`/auth/registration?redirect=${redirect}`)}
      buttonText="Get Started in 2 Minutes"
      minimal
    />
  );
}
