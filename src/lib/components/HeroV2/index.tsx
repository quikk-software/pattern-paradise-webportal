'use client';

import Link from 'next/link';
import { GetProductResponse } from '@/@types/api-types';
import { CldImage } from 'next-cloudinary';
import React from 'react';
import { useValidSession } from '@/hooks/useValidSession';
import AnimatedHeroHeading from '@/lib/components/AnimatedHeroHeading';
import WelcomeHero from '@/components/welcome-hero';
import { Heart, HeartHandshake, Instagram } from 'lucide-react';
import RegisterButton from '@/lib/components/RegisterButton';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { theme } from '@/lib/constants';
import { useTranslations } from 'use-intl';

interface HeroV2Props {
  products: GetProductResponse[];
}

export default function HeroV2({ products }: HeroV2Props) {
  const { status, data: session } = useValidSession();
  const t = useTranslations();

  const isLoggedIn = status === 'authenticated';
  const themeColor = session?.user.theme ?? 'amber';

  return (
    <section
      style={{
        position: 'relative',
        overflow: 'hidden',
        background: `bg-white`,
        paddingTop: '2rem',
        paddingBottom: '2rem',
      }}
    >
      <div className="container mx-auto px-4 md:px-6">
        {/* 66px is needed for the search bar to have enough space */}
        <div className="grid gap-6 md:grid-cols-2 md:gap-10 pt-[66px]">
          <div className="flex flex-col justify-center space-y-4 z-10 pb-4">
            {isLoggedIn && session ? (
              <WelcomeHero
                userName={session.user.name as string}
                themeColor={session.user.theme as string}
                isSeller={session.user.roles?.includes('Seller') ?? false}
                avatarUrl={session.user.image ?? ''}
              />
            ) : (
              <div className="space-y-2">
                <AnimatedHeroHeading />
                <p className="text-lg text-muted-foreground">{t('landing.hero.subtitle')}</p>
              </div>
            )}

            {!isLoggedIn ? (
              <div className="flex flex-wrap gap-2">
                <Link rel={'nofollow'} href="/auth/registration" className="z-10">
                  <RegisterButton />
                </Link>
                <Link href="/swipe" className="z-10">
                  <div className="relative">
                    <Button
                      size="lg"
                      className={cn(
                        'relative overflow-hidden font-semibold text-base px-8 py-6 transition-all duration-300 shadow-lg',
                        'bg-rose-600 text-white hover:bg-rose-600/90 text-primary-foreground',
                        'flex items-center gap-2 group',
                      )}
                    >
                      <span>{t('landing.hero.cta.swipePatterns')}</span>
                      <Heart className="w-5 h-5 fill-white transition-transform duration-300 group-hover:translate-x-1" />
                    </Button>
                  </div>
                </Link>
              </div>
            ) : null}
          </div>

          <div
            className="relative flex items-center justify-center rounded-lg p-2 mx-auto mt-4 mb-4"
            style={{
              width: '300px',
              height: '300px',
            }}
          >
            <div
              style={{
                position: 'absolute',
                inset: '0',
                background: `linear-gradient(to bottom right, ${(theme.colors as any)[themeColor][200]}, ${theme.colors.background})`,
                opacity: 0.8,
              }}
              className="shadow-lg rounded-lg"
            />
            <div className="absolute inset-0 grid grid-cols-2 gap-2">
              {products.map((product) => (
                <Link
                  href={`/app/products/${product.id}`}
                  rel={'nofollow'}
                  key={product.id}
                  className="z-10"
                >
                  <div className="overflow-hidden rounded-md bg-card p-1 shadow-sm">
                    <div className="aspect-square overflow-hidden rounded-md">
                      <CldImage
                        alt={`${product.category} Pattern '${product.title}' on Pattern Paradise`}
                        src={product.imageUrls?.at(0) ?? ''}
                        width={200}
                        height={200}
                        className="h-full w-full object-cover"
                        format="webp"
                      />
                    </div>
                  </div>
                </Link>
              ))}
              <div
                style={{
                  position: 'absolute',
                  bottom: '-1rem',
                  right: '-1rem',
                  height: '6rem',
                  width: '6rem',
                  borderRadius: '9999px',
                  backgroundColor: (theme.colors as any)[themeColor][500],
                  opacity: 0.7,
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  top: '-1.5rem',
                  left: '-1.5rem',
                  height: '5rem',
                  width: '5rem',
                  borderRadius: '9999px',
                  backgroundColor: (theme.colors as any)[themeColor][500],
                  opacity: 0.5,
                }}
              />
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-4 md:flex-row items-center justify-center">
          <div className="flex flex-col items-center text-center md:text-left md:items-start px-6 py-4 md:w-1/2">
            <Link
              href="https://instagram.com/the.patternparadise"
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="flex items-center gap-2 transition-colors mb-3"
              style={{
                color: (theme.colors as any)[themeColor][800],
              }}
            >
              <Instagram className="h-6 w-6" />
              <span className="font-medium text-lg">{t('landing.hero.follow')}</span>
            </Link>
            <p className="text-zinc-500 text-sm/relaxed md:text-base/relaxed dark:text-zinc-400 max-w-xs">
              <Link
                href="https://instagram.com/the.patternparadise"
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="text-blue-500 underline"
              >
                {t('landing.hero.followLink')}
              </Link>{' '}
              {t('landing.hero.followDescription')}
            </p>
          </div>

          <div className="hidden md:block h-24 w-px bg-zinc-200 dark:bg-zinc-700 mx-4"></div>

          <div className="md:hidden w-full h-px bg-zinc-200 dark:bg-zinc-700"></div>

          <div className="flex flex-col items-center text-center md:text-left md:items-start px-6 py-4 md:w-1/2">
            <div
              className="flex items-center gap-2 transition-colors mb-3"
              style={{
                color: (theme.colors as any)[themeColor][800],
              }}
            >
              <HeartHandshake className="h-6 w-6" />
              <span className="font-medium text-lg">{t('landing.hero.payment')}</span>
            </div>
            <p className="text-zinc-500 text-sm/relaxed md:text-base/relaxed dark:text-zinc-400 max-w-xs">
              {t.rich('landing.hero.paymentDescription', {
                PayPalLink: (chunks) => (
                  <Link
                    href="https://paypal.com"
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    className="text-blue-500 underline"
                  >
                    {chunks}
                  </Link>
                ),
                StripeLink: (chunks) => (
                  <Link
                    href="https://stripe.com"
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    className="text-blue-500 underline"
                  >
                    {chunks}
                  </Link>
                ),
              })}
            </p>
          </div>
        </div>
      </div>
      <div
        style={{
          position: 'absolute',
          top: '-6rem',
          right: '-6rem',
          height: '16rem',
          width: '16rem',
          borderRadius: '9999px',
          backgroundColor: (theme.colors as any)[themeColor][200],
          opacity: 0.5,
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: '10rem',
          left: '-5rem',
          height: '10rem',
          width: '10rem',
          borderRadius: '9999px',
          backgroundColor: (theme.colors as any)[themeColor][200],
          opacity: 0.3,
        }}
      />
    </section>
  );
}
