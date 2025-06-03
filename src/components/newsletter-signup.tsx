'use client';

import React, { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useCreateNewsletterSubscription } from '@/lib/api/newsletter-subscription';
import RequestStatus from '@/lib/components/RequestStatus';
import { LoadingSpinnerComponent } from '@/components/loading-spinner';
import { useTranslations } from 'use-intl';

export default function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [cooldown, setCooldown] = useState(0);
  const [submitCount, setSubmitCount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { mutate, isLoading, isSuccess, isError, errorDetail } = useCreateNewsletterSubscription();

  const t = useTranslations();

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (cooldown > 0) {
      timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
    } else if (isSubmitting) {
      setIsSubmitting(false);
    }
    return () => clearTimeout(timer);
  }, [cooldown, isSubmitting]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (cooldown > 0) {
      return;
    }

    setIsSubmitting(true);
    setSubmitCount((prevCount) => prevCount + 1);

    try {
      await mutate({
        email,
      });
    } finally {
      setEmail('');

      const newCooldown = Math.min(60, 5 * Math.pow(2, submitCount));
      setCooldown(newCooldown);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex space-x-2">
        <Input
          type="email"
          placeholder={t('footer.subscribe.placeholder')}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="flex-grow"
        />
        <Button type="submit" disabled={isSubmitting || cooldown > 0}>
          {isLoading ? <LoadingSpinnerComponent size="sm" className="text-white" /> : null}
          {cooldown > 0 ? `${cooldown}s` : t('footer.subscribe.button')}
        </Button>
      </div>
      <RequestStatus
        isSuccess={isSuccess}
        isError={isError}
        successMessage={t('footer.subscribe.success')}
        errorMessage={errorDetail}
      />
    </form>
  );
}
