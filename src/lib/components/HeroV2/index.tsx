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
import { THEME_COLOR } from '@/lib/constants';

const theme = {
  colors: {
    background: 'hsl(var(--background))',
    foreground: 'hsl(var(--foreground))',
    primary: 'hsl(var(--primary))',
    primaryForeground: 'hsl(var(--primary-foreground))',
    muted: {
      foreground: 'hsl(var(--muted-foreground))',
    },
    accent: 'hsl(var(--accent))',
    accentForeground: 'hsl(var(--accent-foreground))',
    card: 'hsl(var(--card))',
    border: 'hsl(var(--border))',
    input: 'hsl(var(--input))',
    ring: 'hsl(var(--ring))',
    slate: {
      200: '#e2e8f0',
      500: '#64748b',
      800: '#1e293b',
    },
    gray: {
      200: '#e5e7eb',
      500: '#6b7280',
      800: '#1f2937',
    },
    zinc: {
      200: '#e4e4e7',
      500: '#71717a',
      800: '#27272a',
    },
    neutral: {
      200: '#e5e5e5',
      500: '#737373',
      800: '#262626',
    },
    stone: {
      200: '#e7e5e4',
      500: '#78716c',
      800: '#292524',
    },
    red: {
      200: '#fecaca',
      500: '#ef4444',
      800: '#991b1b',
    },
    orange: {
      200: '#fed7aa',
      500: '#f97316',
      800: '#9a3412',
    },
    amber: {
      200: '#fde68a',
      500: '#f59e0b',
      800: '#92400e',
    },
    yellow: {
      200: '#fef08a',
      500: '#eab308',
      800: '#78350f',
    },
    lime: {
      200: '#d9f99d',
      500: '#84cc16',
      800: '#3f6212',
    },
    green: {
      200: '#bbf7d0',
      500: '#22c55e',
      800: '#166534',
    },
    emerald: {
      200: '#a7f3d0',
      500: '#10b981',
      800: '#065f46',
    },
    teal: {
      200: '#99f6e4',
      500: '#14b8a6',
      800: '#115e59',
    },
    cyan: {
      200: '#a5f3fc',
      500: '#06b6d4',
      800: '#155e75',
    },
    sky: {
      200: '#bae6fd',
      500: '#0ea5e9',
      800: '#075985',
    },
    blue: {
      200: '#bfdbfe',
      500: '#3b82f6',
      800: '#1e40af',
    },
    indigo: {
      200: '#c7d2fe',
      500: '#6366f1',
      800: '#3730a3',
    },
    violet: {
      200: '#ddd6fe',
      500: '#8b5cf6',
      800: '#5b21b6',
    },
    purple: {
      200: '#e9d5ff',
      500: '#a855f7',
      800: '#6b21a8',
    },
    fuchsia: {
      200: '#f5d0fe',
      500: '#d946ef',
      800: '#701a75',
    },
    pink: {
      200: '#fbcfe8',
      500: '#ec4899',
      800: '#831843',
    },
    rose: {
      200: '#fecdd3',
      500: '#f43f5e',
      800: '#881337',
    },
  },
};

interface HeroV2Props {
  products: GetProductResponse[];
}

export default function HeroV2({ products }: HeroV2Props) {
  const { status, data: session } = useValidSession();

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
        <div className="grid gap-6 md:grid-cols-2 md:gap-10">
          <div className="flex flex-col justify-center space-y-4 z-10 pb-4">
            {isLoggedIn && session ? (
              <WelcomeHero
                userName={session.user.name as string}
                isSeller={session.user.roles?.includes('Seller') ?? false}
                avatarUrl={session.user.image ?? ''}
              />
            ) : (
              <div className="space-y-2">
                <AnimatedHeroHeading />
                <p className="text-lg text-muted-foreground">
                  Buy, test, and sell your patterns in one place. Join our community of passionate
                  crocheters & knitters today!
                </p>
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
                      <span>Swipe Patterns</span>
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
              className="flex items-center gap-2 text-amber-600 hover:text-amber-700 transition-colors mb-3"
            >
              <Instagram className="h-6 w-6" />
              <span className="font-medium text-lg">Follow our creative journey</span>
            </Link>
            <p className="text-zinc-500 text-sm/relaxed md:text-base/relaxed dark:text-zinc-400 max-w-xs">
              <Link
                href="https://instagram.com/the.patternparadise"
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="text-blue-500 underline"
              >
                Join our community
              </Link>{' '}
              and get inspired with our latest patterns and designs.
            </p>
          </div>

          <div className="hidden md:block h-24 w-px bg-zinc-200 dark:bg-zinc-700 mx-4"></div>

          <div className="md:hidden w-full h-px bg-zinc-200 dark:bg-zinc-700"></div>

          <div className="flex flex-col items-center text-center md:text-left md:items-start px-6 py-4 md:w-1/2">
            <div className="flex items-center gap-2 text-amber-600 hover:text-amber-700 transition-colors mb-3">
              <HeartHandshake className="h-6 w-6" />
              <span className="font-medium text-lg text-primary">Secure payment</span>
            </div>
            <p className="text-zinc-500 text-sm/relaxed md:text-base/relaxed dark:text-zinc-400 max-w-xs">
              Buy and sell safely with our secure{' '}
              <Link
                href="https://paypal.com"
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="text-blue-500 underline"
              >
                PayPal
              </Link>{' '}
              and{' '}
              <Link
                href="https://stripe.com"
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="text-blue-500 underline"
              >
                Stripe
              </Link>{' '}
              payment options.
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
