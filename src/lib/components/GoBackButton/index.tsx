'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface GoBackButton {}

export default function GoBackButton({}: GoBackButton) {
  const router = useRouter();
  return (
    <Button variant="outline" className="w-full" onClick={() => router.back()}>
      <ArrowLeft />
      Go Back
    </Button>
  );
}
