'use server';

import { Button } from '@/components/ui/button';
import { Sparkles, Gift } from 'lucide-react';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';

export default async function MysteryPatternHero() {
  if (process.env.NEXT_PUBLIC_MYSTERY_BOX_ACTIVE !== 'true') {
    return null;
  }

  const t = await getTranslations();

  return (
    <section className="w-full py-8 bg-gradient-to-r from-primary/5 to-primary/10 border-y border-border">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-center gap-6 max-w-4xl mx-auto text-center md:text-left">
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6">
            <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center shadow-[0_4px_20px_rgba(224,105,0,0.2)]">
              <Gift className="w-7 h-7 text-white" />
            </div>

            <div>
              <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                <h3 className="font-display text-xl md:text-2xl font-semibold text-foreground">
                  {t('landing.hero.mystery.title')}
                </h3>
              </div>
              <p className="text-muted-foreground text-sm">{t('landing.hero.mystery.description')}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">$3.00</div>
            </div>

            <Link href={'/app/products/mystery-patterns/crochet'}>
              <Button className="shadow-[0_4px_20px_rgba(224,105,0,0.2)]">
                <Sparkles className="w-4 h-4" />
                {t('landing.hero.mystery.button')}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
