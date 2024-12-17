'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

interface GoBackButton extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export default function GoBackButton({ className }: GoBackButton) {
  const router = useRouter();
  return (
    <Button variant="outline" className={cn('w-full', className)} onClick={() => router.back()}>
      <ArrowLeft />
      Go Back
    </Button>
  );
}
