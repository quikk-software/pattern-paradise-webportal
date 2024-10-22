'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CloudOff } from 'lucide-react';

export function NotFoundComponent() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 px-4 text-center">
      <CloudOff className="w-24 h-24 text-gray-400 mb-8" />
      <h1 className="text-4xl font-bold text-gray-800 mb-4">404 - Page Not Found</h1>
      <p className="text-xl text-gray-600 mb-8 max-w-md">
        Oops! It seems like you&apos;ve ventured into uncharted territory. The page you&apos;re
        looking for has gone on an adventure.
      </p>
      <Button asChild className="flex items-center space-x-2">
        <Link href="/">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Return to Home
        </Link>
      </Button>
    </div>
  );
}
