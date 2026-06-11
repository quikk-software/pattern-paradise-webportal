'use client';

import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';

export default function RegisterButton() {
  const t = useTranslations();

  return (
    <div className="relative">
      <Button
        size="lg"
        className={cn(
          'relative overflow-hidden font-semibold text-base px-8 py-6 transition-all duration-300 shadow-lg',
          // primary-accessible: normal-sized white text needs >= 4.5:1 contrast, brand orange is too light
          'bg-primary-accessible hover:bg-primary-accessible/90 text-primary-foreground',
          'flex items-center gap-2 group',
        )}
      >
        <span>{t('landing.hero.cta.registerNow')}</span>
        <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
      </Button>
    </div>
  );
}
