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
    <section className="w-full py-8 bg-gradient-to-r from-orange-100 to-amber-100 border-y border-orange-200">
      <div className="container">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 max-w-5xl mx-auto">
          <div className="flex items-center space-x-6">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-amber-500 rounded-full flex items-center justify-center shadow-lg">
              <Gift className="w-6 h-6 text-white" />
            </div>

            <div className="text-left">
              <div className="flex items-center space-x-2 mb-1">
                <h3 className="text-xl md:text-2xl font-bold text-orange-700">
                  {t('landing.hero.mystery.title')}
                </h3>
              </div>
              <p className="text-orange-600 text-sm">{t('landing.hero.mystery.description')}</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">$3.00</div>
            </div>

            <Link href={'/%5Blocale%5D/app/products/mystery-patterns/crochet'}>
              <Button className="bg-gradient-to-r from-primary to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold px-6 py-2 shadow-lg">
                <Sparkles className="w-4 h-4 mr-2" />
                {t('landing.hero.mystery.button')}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
