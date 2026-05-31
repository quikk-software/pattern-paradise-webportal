'use client';

import Link from 'next/link';
import { GetProductResponse } from '@/@types/api-types';
import React, { useEffect, useRef, useState } from 'react';
import { useValidSession } from '@/hooks/useValidSession';
import WelcomeHero from '@/components/welcome-hero';
import { Heart, X, ShieldCheck, Download, Layers, ArrowRight, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useTranslations } from 'next-intl';
import { useListProductsForSwipe } from '@/lib/api';
import { useCreateProductLike } from '@/lib/api/product-like';
import HeroSwipeableCard, { HeroSwipeableCardRef } from './HeroSwipeableCard';

interface HeroV2Props {
  products: GetProductResponse[];
}

export default function HeroV2({ products: initialProducts }: HeroV2Props) {
  const { status, data: session } = useValidSession();
  const t = useTranslations();

  const isLoggedIn = status === 'authenticated';

  // Swipe functionality
  const { fetch: fetchSwipeProducts, data: swipeProducts } = useListProductsForSwipe();
  const { mutate: createProductLike } = useCreateProductLike();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const activeCardRef = useRef<HeroSwipeableCardRef>(null);

  // Fetch swipe products in background on mount
  useEffect(() => {
    fetchSwipeProducts().then(() => {
      setIsLoaded(true);
    });
  }, []);

  // Use swipe products once loaded, otherwise fall back to initial products
  const products = isLoaded && swipeProducts.length > 0 ? swipeProducts : initialProducts;
  const visibleProducts = products.slice(currentIndex, currentIndex + 3);
  const currentProduct = products[currentIndex];
  const hasMoreProducts = currentIndex < products.length;

  const handleSwiped = (direction: 'left' | 'right', productId: string) => {
    if (direction === 'right') {
      createProductLike(productId, true);
    }
    setCurrentIndex((prev) => prev + 1);
  };

  const handleLike = () => {
    if (!hasMoreProducts) return;
    activeCardRef.current?.triggerSwipe('right');
  };

  const handleDislike = () => {
    if (!hasMoreProducts) return;
    activeCardRef.current?.triggerSwipe('left');
  };

  const handleRestart = () => {
    setCurrentIndex(0);
  };

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

          {/* Right Column - Swipeable Card Cluster */}
          <div className="relative flex items-center justify-center min-h-[350px] md:min-h-[420px]">
            {/* Card Cluster */}
            <div className="relative w-[280px] h-[350px] md:w-[320px] md:h-[400px]">
              {hasMoreProducts ? (
                visibleProducts.map((product, index) => {
                  const isTop = index === 0;
                  return (
                    <HeroSwipeableCard
                      key={`${product.id}-${currentIndex}`}
                      ref={isTop ? activeCardRef : null}
                      product={product}
                      isActive={isTop}
                      stackPosition={index}
                      onSwiped={(direction) =>
                        isTop ? handleSwiped(direction, product.id) : undefined
                      }
                    />
                  );
                })
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-card rounded-2xl p-6 text-center shadow-lg border border-border max-w-[220px]">
                    <p className="text-sm text-muted-foreground mb-4">
                      {t('swipe.allSwiped') || "You've seen all patterns!"}
                    </p>
                    <Button onClick={handleRestart} size="sm" variant="outline" className="gap-2">
                      <RefreshCw className="w-4 h-4" />
                      {t('swipe.startOver') || 'Start Over'}
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Swipe Action Buttons */}
            <div className="absolute bottom-4 right-4 md:bottom-8 md:right-8 flex items-center gap-3 z-40">
              {hasMoreProducts ? (
                <>
                  <button
                    aria-label="Skip pattern"
                    onClick={handleDislike}
                    className="w-12 h-12 rounded-full bg-card border border-border shadow-[0_4px_12px_rgba(43,33,24,0.08)] flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-red-500 hover:border-red-200 transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                  {currentProduct && (
                    <Link href={`/app/products/${currentProduct.id}`}>
                      <button
                        aria-label="View pattern details"
                        className="w-12 h-12 rounded-full bg-card border border-border shadow-[0_4px_12px_rgba(43,33,24,0.08)] flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-primary hover:border-primary/20 transition-colors cursor-pointer"
                      >
                        <ArrowRight className="w-5 h-5" />
                      </button>
                    </Link>
                  )}
                  <button
                    aria-label="Like pattern"
                    onClick={handleLike}
                    className="w-12 h-12 rounded-full bg-primary shadow-[0_4px_12px_rgba(224,105,0,0.3)] flex items-center justify-center text-primary-foreground hover:bg-primary/90 transition-colors cursor-pointer"
                  >
                    <Heart className="w-5 h-5" />
                  </button>
                </>
              ) : (
                <Link href="/swipe">
                  <Button className="gap-2">
                    <Layers className="w-4 h-4" />
                    {t('landing.hero.cta.swipePatterns')}
                  </Button>
                </Link>
              )}
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
