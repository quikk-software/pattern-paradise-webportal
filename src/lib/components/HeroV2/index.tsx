'use client';

import Image from 'next/image';
import Link from 'next/link';
import { GetProductResponse } from '@/@types/api-types';
import { CldImage } from 'next-cloudinary';
import { Button } from '@/components/ui/button';
import React from 'react';
import { useSession } from 'next-auth/react';
import PayPalLogo from '@/assets/logos/paypal-logo.png';

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
  const { status } = useSession();

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
      ></div>
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
      ></div>
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid gap-6 md:grid-cols-2 md:gap-10">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                <span className="block">Your Crochet</span>
                <span className="block text-primary">Pattern Paradise</span>
              </h1>
              <p className="text-lg text-muted-foreground">
                Buy, test, and sell your patterns in one place. Join our community of passionate
                crocheters today!
              </p>
            </div>

            <div className="flex flex-row gap-2">
              {isLoggedIn ? (
                <Link rel={'nofollow'} href="/app/secure/sell">
                  <Button variant={'default'}>Start Selling</Button>
                </Link>
              ) : (
                <Link
                  rel={'nofollow'}
                  href="/auth/registration?preselectedRoles=Seller&redirect=/app/secure/sell"
                >
                  <Button variant={'default'}>Start Selling</Button>
                </Link>
              )}
              {isLoggedIn ? (
                <Link href="/app/secure/test">
                  <Button variant="outline">Show Tester Calls</Button>
                </Link>
              ) : (
                <Link href="/auth/registration?preselectedRoles=Tester&redirect=/app/secure/test">
                  <Button variant="outline">Become a Tester</Button>
                </Link>
              )}
            </div>
          </div>

          {/* Right column - Image grid */}
          <div className="relative flex items-center justify-center rounded-lg border border-border p-2">
            <div className="grid grid-cols-2 gap-2">
              {products.map((product) => (
                <div className="overflow-hidden rounded-md bg-card p-1 shadow-sm" key={product.id}>
                  <div className="aspect-square overflow-hidden rounded-md">
                    <CldImage
                      alt={`${product.category} Pattern '${product.title}'`}
                      src={product.imageUrls?.at(0) ?? ''}
                      width={200}
                      height={200}
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center justify-center space-y-4 text-center">
          <div className="inline-block rounded-lg bg-orange-50 px-3 py-1 text-sm text-primary">
            Official PayPal Platform Partner
          </div>
          <p className="text-zinc-500 text-md/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-zinc-400">
            Secure transactions powered by PayPal. Buy and sell with confidence on our platform.
          </p>
          <Image
            alt="PayPal Logo"
            className="h-8 lg:h-12 w-auto"
            height="51"
            src={PayPalLogo}
            width="200"
          />
        </div>
      </div>
    </section>
  );
}
