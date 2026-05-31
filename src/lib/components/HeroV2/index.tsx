'use client';

import Link from 'next/link';
import { GetProductResponse } from '@/@types/api-types';
import { CldImage } from 'next-cloudinary';
import React from 'react';
import { useValidSession } from '@/hooks/useValidSession';
import WelcomeHero from '@/components/welcome-hero';
import { Heart, X, ShieldCheck, Download, Layers } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useTranslations } from 'next-intl';

interface HeroV2Props {
  products: GetProductResponse[];
}

// Card rotations for handmade feel
const CARD_ROTATIONS = ['-rotate-[4deg]', 'rotate-[5deg]', '-rotate-[1deg]'];
const CARD_OFFSETS = [
  'translate-x-0 translate-y-0 z-30',
  'translate-x-8 -translate-y-4 z-20',
  'translate-x-16 translate-y-2 z-10',
];

export default function HeroV2({ products }: HeroV2Props) {
  const { status, data: session } = useValidSession();
  const t = useTranslations();

  const isLoggedIn = status === 'authenticated';

  // Take only the first 3 products for the card cluster
  const displayProducts = products.slice(0, 3);

  return (
    <section className="relative overflow-hidden bg-background pt-8 pb-12 md:pb-16">
      <div className="container mx-auto px-4 md:px-6">
        {/* 66px is needed for the search bar to have enough space */}
        <div className="grid gap-8 md:gap-12 lg:grid-cols-[55%_45%] pt-[66px] items-center">
          {/* Left Column - Text */}
          <div className="flex flex-col justify-center space-y-6 z-10">
            {isLoggedIn && session ? (
              <WelcomeHero
                userName={session.user.name as string}
                themeColor={session.user.theme as string}
                isSeller={session.user.roles?.includes('Seller') ?? false}
                avatarUrl={session.user.image ?? ''}
              />
            ) : (
              <div className="space-y-5">
                {/* Pill Badge */}
                <Badge
                  variant="outline"
                  className="px-4 py-1.5 text-sm font-medium text-muted-foreground border-border bg-card"
                >
                  {t('landing.hero.patternCount')}
                </Badge>

                {/* H1 Headline */}
                <h1 className="font-serif text-4xl md:text-5xl lg:text-[3.5rem] font-semibold tracking-tight text-foreground leading-[1.1]">
                  {t('landing.hero.headline')}
                </h1>

                {/* Subline */}
                <p className="text-lg text-muted-foreground leading-relaxed max-w-[330px]">
                  {t('landing.hero.subline')}
                </p>
              </div>
            )}

            {/* CTAs */}
            {!isLoggedIn && (
              <div className="flex flex-wrap gap-3">
                <Link href="/swipe" className="z-10">
                  <Button size="lg" className="gap-2 text-base font-semibold px-6">
                    <Layers className="w-5 h-5" />
                    {t('landing.hero.cta.swipePatterns')}
                  </Button>
                </Link>
                <Link href="/browse" className="z-10">
                  <Button size="lg" variant="outline" className="text-base font-semibold px-6">
                    {t('landing.hero.cta.browseAll')}
                  </Button>
                </Link>
              </div>
            )}

            {/* Trust Line */}
            {!isLoggedIn && (
              <div className="flex flex-wrap items-center gap-6 pt-2">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <ShieldCheck className="w-4 h-4" />
                  <span className="text-sm">{t('landing.hero.trust.payment')}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Download className="w-4 h-4" />
                  <span className="text-sm">{t('landing.hero.trust.download')}</span>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Visual Card Cluster */}
          <div className="relative flex items-center justify-center min-h-[350px] md:min-h-[420px]">
            {/* Card Cluster */}
            <div className="relative w-[280px] h-[350px] md:w-[320px] md:h-[400px]">
              {displayProducts.map((product, index) => (
                <Link
                  href={`/app/products/${product.id}`}
                  rel="nofollow"
                  key={product.id}
                  className={`absolute top-0 left-0 transition-all duration-300 hover:z-40 hover:scale-105 ${CARD_ROTATIONS[index]} ${CARD_OFFSETS[index]}`}
                >
                  <div className="w-[200px] md:w-[220px] bg-card rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(43,33,24,0.08)] border border-border hover:shadow-[0_8px_30px_rgba(43,33,24,0.12)] transition-shadow duration-300">
                    {/* Product Image */}
                    <div className="aspect-square overflow-hidden">
                      <CldImage
                        alt={`${product.category} Pattern '${product.title}' on Pattern Paradise`}
                        src={product.imageUrls?.at(0) ?? ''}
                        width={220}
                        height={220}
                        className="h-full w-full object-cover"
                        format="webp"
                      />
                    </div>
                    {/* Product Info */}
                    <div className="p-3 flex items-center justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <p className="font-serif text-sm font-medium text-foreground truncate">
                          {product.title}
                        </p>
                        <p className="text-sm font-semibold text-primary">
                          {product.isFree
                            ? t('landing.hero.free')
                            : `$${(product.salePrice || product.price).toFixed(2)}`}
                        </p>
                      </div>
                      <Heart className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Swipe Action Buttons - Hint */}
            <div className="absolute bottom-4 right-4 md:bottom-8 md:right-8 flex items-center gap-3 z-40">
              <button
                aria-label="Skip pattern"
                className="w-12 h-12 rounded-full bg-card border border-border shadow-[0_4px_12px_rgba(43,33,24,0.08)] flex items-center justify-center text-muted-foreground hover:bg-muted transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <Link href="/swipe">
                <button
                  aria-label="Like pattern"
                  className="w-12 h-12 rounded-full bg-primary shadow-[0_4px_12px_rgba(224,105,0,0.3)] flex items-center justify-center text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  <Heart className="w-5 h-5" />
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Subtle decorative elements */}
      <div className="absolute top-20 right-[-100px] w-[200px] h-[200px] rounded-full bg-primary/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-50px] left-[-50px] w-[150px] h-[150px] rounded-full bg-primary/5 blur-3xl pointer-events-none" />
    </section>
  );
}
