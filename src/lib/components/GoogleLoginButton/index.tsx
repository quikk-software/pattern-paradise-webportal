'use client';

import React, { useEffect, useState } from 'react';
import { signIn } from 'next-auth/react';
import Image from 'next/image';
import GoogleLogo from '@/assets/logos/google-logo.svg';
import { Button } from '@/components/ui/button';
import { isIOSMode } from '@/lib/core/utils';
import GoogleLoginUnavailableDrawer from '@/lib/components/GoogleLoginUnavailableDrawer';
import RequestPasswordDrawer from '@/lib/components/RequestPasswordDrawer';

interface GoogleLoginButtonProps {
  callbackUrl?: string;
}

export default function GoogleLoginButton({ callbackUrl }: GoogleLoginButtonProps) {
  const [isStandalone, setIsStandalone] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isRequestPasswordDrawerOpen, setIsRequestPasswordDrawerOpen] = useState(false);

  useEffect(() => {
    setIsStandalone(isIOSMode());
  }, []);

  const handleLogin = async () => {
    if (isStandalone) {
      setIsOpen(true);
      return;
    }
    await signIn('google', {
      callbackUrl,
    });
  };

  return (
    <>
      <Button
        onClick={() => handleLogin()}
        className="w-full flex items-center justify-center gap-2 bg-white shadow hover:shadow-md hover:bg-gray-50 transition duration-150"
      >
        <Image src={GoogleLogo} alt="Google Logo" className="w-5 h-5" width={50} height={50} />
        <span className="text-sm font-medium text-gray-700">Login with Google</span>
      </Button>
      <GoogleLoginUnavailableDrawer
        open={isOpen}
        onClose={() => setIsOpen(false)}
        onLogin={() => setIsOpen(false)}
        onResetPassword={() => {
          setIsOpen(false);
          setIsRequestPasswordDrawerOpen(true);
        }}
      />
      <RequestPasswordDrawer
        drawerIsOpen={isRequestPasswordDrawerOpen}
        setDrawerIsOpen={setIsRequestPasswordDrawerOpen}
      />
    </>
  );
}
