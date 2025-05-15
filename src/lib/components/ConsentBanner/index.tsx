'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';
import { useAcceptTermsAndPrivacy } from '@/lib/api';
import { LoadingSpinnerComponent } from '@/components/loading-spinner';
import { useValidSession } from '@/hooks/useValidSession';
import dayjs, { ADVANCED_DATE_FORMAT } from '@/lib/core/dayjs';

export function ConsentBanner() {
  const [isVisible, setIsVisible] = useState(false);

  const { data: session, update } = useValidSession();

  const { mutate, isLoading } = useAcceptTermsAndPrivacy();

  useEffect(() => {
    if (!session?.user) {
      return;
    }

    const hasAccepted = !!session.user.hasAcceptedTerms && !!session.user.hasAcceptedPrivacy;
    if (!hasAccepted) {
      setIsVisible(true);
    }
  }, [session?.user, session?.user]);

  const handleAccept = () => {
    mutate().then(() => {
      update().then(() => setIsVisible(false));
    });
  };

  if (!isVisible) {
    return null;
  }

  const acceptUntil = dayjs(session?.user.acceptedTermsOn).add(30, 'days');

  return (
    <div className="z-40 w-full border-b bg-amber-50 shadow-sm">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4 py-4">
        <div className="flex items-start md:items-center gap-3 text-sm">
          <AlertCircle className="h-5 w-5 text-primary mt-0.5 md:mt-0 flex-shrink-0" />
          <p className="text-amber-900">
            We&apos;ve updated our{' '}
            <a
              href="/terms-and-privacy"
              className="font-medium text-amber-700 hover:text-amber-800 underline underline-offset-4"
            >
              Terms of Service and Privacy Policy
            </a>
            . Please review and accept them by{' '}
            <span className="underline">{acceptUntil.format(ADVANCED_DATE_FORMAT)}</span> to
            continue using Pattern Paradise.
          </p>
        </div>
        <Button
          onClick={handleAccept}
          size="sm"
          className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-2 rounded-md transition-colors duration-200 shadow-sm"
        >
          {isLoading ? <LoadingSpinnerComponent size="sm" className="text-white" /> : null}
          Accept
        </Button>
      </div>
    </div>
  );
}
