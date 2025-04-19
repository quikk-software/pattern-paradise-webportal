'use client';

import Link from 'next/link';
import { GetProductResponse } from '@/@types/api-types';
import { CldImage } from 'next-cloudinary';
import React from 'react';
import { useValidSession } from '@/hooks/useValidSession';
import AnimatedHeroHeading from '@/lib/components/AnimatedHeroHeading';
import WelcomeHero from '@/components/welcome-hero';
import { ArrowRight, Heart, HeartHandshake, Instagram } from 'lucide-react';
import RegisterButton from '@/lib/components/RegisterButton';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { EasterEgg } from '@/lib/components/EasterEgg';

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
    amber: {
      200: '#fde68a',
      500: '#f59e0b',
      800: '#92400e',
    },
  },
};

interface HeroV2Props {
  products: GetProductResponse[];
}

export default function HeroV2({ products }: HeroV2Props) {
  const { status, data: session } = useValidSession();

  const isLoggedIn = status === 'authenticated';

  return (
    <section
      style={{
        position: 'relative',
        overflow: 'hidden',
        background: `linear-gradient(to bottom, ${theme.colors.amber[200]}, ${theme.colors.background})`,
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
                <Link rel={'nofollow'} href="/swipe" className="z-10">
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
                background: `linear-gradient(to bottom right, ${theme.colors.amber[200]}, ${theme.colors.background})`,
                opacity: 0.8,
              }}
              className="shadow-lg rounded-lg"
            />
            <div className="absolute inset-0 grid grid-cols-2 gap-2">
              {products.map((product) => (
                <Link href={`/app/products/${product.id}`} key={product.id} className="z-10">
                  <div className="overflow-hidden rounded-md bg-card p-1 shadow-sm">
                    <div className="aspect-square overflow-hidden rounded-md">
                      <CldImage
                        alt={`${product.category} Pattern '${product.title}'`}
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
                  backgroundColor: theme.colors.amber[500],
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
                  backgroundColor: theme.colors.amber[500],
                  opacity: 0.5,
                }}
              />
              <EasterEgg
                eventCampaignId={'00000000-0000-0000-0000-000000000004'}
                size={'xs'}
                className="absolute top-2/3 left-2/3 z-50"
              />
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-4 md:flex-row items-center justify-center">
          <div className="flex flex-col items-center text-center md:text-left md:items-start px-6 py-4 md:w-1/2">
            <Link
              href="https://instagram.com/the.patternparadise"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-amber-600 hover:text-amber-700 transition-colors mb-3"
            >
              <Instagram className="h-6 w-6" />
              <span className="font-medium text-lg">Follow our creative journey</span>
            </Link>
            <p className="text-zinc-500 text-sm/relaxed md:text-base/relaxed dark:text-zinc-400 max-w-xs">
              <Link
                href="https://instagram.com/the.patternparadise"
                target="_blank"
                rel="noopener noreferrer"
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
                rel="noopener noreferrer"
                className="text-blue-500 underline"
              >
                PayPal
              </Link>{' '}
              and{' '}
              <Link
                href="https://stripe.com"
                target="_blank"
                rel="noopener noreferrer"
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
          backgroundColor: theme.colors.amber[200],
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
          backgroundColor: theme.colors.amber[200],
          opacity: 0.3,
        }}
      />
    </section>
  );
}
