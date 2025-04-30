import React from 'react';
import { signIn } from 'next-auth/react';
import Image from 'next/image';
import GoogleLogo from '@/assets/logos/google-logo.svg';
import { Button } from '@/components/ui/button';

interface GoogleLoginButtonProps {
  callbackUrl?: string;
}

export default function GoogleLoginButton({ callbackUrl }: GoogleLoginButtonProps) {
  return (
    <Button
      onClick={() =>
        signIn('keycloak-google', {
          callbackUrl,
        })
      }
      className="w-full flex items-center justify-center gap-2 bg-white shadow hover:shadow-md hover:bg-gray-50 transition duration-150"
    >
      <Image src={GoogleLogo} alt="Google Logo" className="w-5 h-5" width={50} height={50} />
      <span className="text-sm font-medium text-gray-700">Login with Google</span>
    </Button>
  );
}
