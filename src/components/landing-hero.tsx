'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import PayPalLogo from '@/assets/logos/paypal-logo.png';
import Image from 'next/image';
import Link from 'next/link';
import { APP_TITLE, FEATURED_PRODUCTS_LENGTH } from '@/lib/constants';
import { useValidSession } from '@/hooks/useValidSession';
import { GetProductResponse } from '@/@types/api-types';
import { CldImage } from 'next-cloudinary';
import { useRouter } from 'next/navigation';
import useScreenSize from '@/lib/core/useScreenSize';

interface LandingHeroProps {
  products: GetProductResponse[];
}

export default function LandingHero({ products }: LandingHeroProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const { status } = useValidSession();
  const router = useRouter();
  const screenSize = useScreenSize();

  const isLoggedIn = status === 'authenticated';

  const smallScreen = screenSize === 'xs' || screenSize === 'sm' || screenSize === 'md';

  return (
    <section className="pb-8 lg:pb-0 lg:py-16">
      <div className="grid gap-8 lg:grid-cols-[1fr_500px] lg:gap-12 xl:grid-cols-[1fr_600px]">
        <div className="flex flex-col justify-center space-y-6">
          <div className="space-y-4">
            <div>
              <span className="text-lg text-muted-foreground font-medium">Welcome to</span>
              <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl xl:text-6xl/none text-foreground">
                {APP_TITLE.split(' ')[0]}{' '}
                <span className="italic text-primary">
                  {APP_TITLE.split(' ')[1]}
                </span>
              </h1>
            </div>
            <p className="max-w-[600px] text-muted-foreground text-lg leading-relaxed">
              Buy, test, and sell your patterns in one place. Join our community of passionate
              crocheters today!
            </p>
          </div>
          <div className="flex flex-row gap-4 flex-wrap">
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
              <Link href="/app/tester-calls">
                <Button variant="secondary">Show Tester Calls</Button>
              </Link>
            ) : (
              <Link href="/auth/registration?preselectedRoles=Tester&redirect=/app/tester-calls">
                <Button variant="secondary">Become a Tester</Button>
              </Link>
            )}
          </div>
        </div>
        {!smallScreen && products.length === FEATURED_PRODUCTS_LENGTH ? (
          <div className="relative h-[400px] lg:h-[600px] flex items-center justify-center mt-8 mb-4">
            <div className="absolute w-[300px] h-[300px] lg:w-[500px] lg:h-[500px]">
              {products.map((product, index) => (
                <div
                  key={product.id}
                  className={`absolute w-[175px] lg:w-[250px] transition-all duration-500 ease-out transform 
                              ${hoveredIndex === index ? 'z-10 scale-110' : 'scale-100'}
                              ${hoveredIndex !== null && hoveredIndex !== index ? 'opacity-70' : 'opacity-100'}`}
                  style={{
                    top: '50%',
                    left: '50%',
                    transform: `
                      translate(-${index * (smallScreen ? 50 : 40)}%, -${index * 20}%) 
                      ${smallScreen ? 'translateY(-90px)' : 'translateY(-180px)'}
                      ${hoveredIndex === index ? 'scale(1.1)' : 'scale(1)'}
                    `,
                    zIndex: hoveredIndex === index ? 10 : products.length + index,
                  }}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => {
                    setHoveredIndex(null);
                    setSelectedIndex(null);
                  }}
                  onClick={() => {
                    setSelectedIndex(index);
                    if (selectedIndex === index && hoveredIndex === index) {
                      router.push(`/app/products/${product.id}`);
                    }
                  }}
                >
                  <div className="bg-card/80 backdrop-blur-md rounded-clay shadow-clay-card overflow-hidden cursor-pointer hover:shadow-clay-card-hover hover:-translate-y-2 transition-all duration-500 group">
                    <div className="overflow-hidden rounded-t-clay">
                      <CldImage
                        key={product.id}
                        alt={`${product.title} Pattern`}
                        src={product.imageUrls[0]}
                        width="250"
                        height="188"
                        format="webp"
                        className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-display font-semibold text-lg text-foreground line-clamp-1">{product.title}</h3>
                      <div className="mt-3 flex items-center justify-between">
                        <span className="font-display font-bold text-primary text-xl">${product.price.toFixed(2)}</span>
                        <Link href={`/app/products/${product.id}`}>
                          <Button size="sm">Buy Now</Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>
      
      {/* PayPal Partner Badge */}
      <div className="mt-16 flex flex-col items-center justify-center space-y-4 text-center">
        <div className="inline-block rounded-full bg-primary-soft/30 px-4 py-2 text-sm font-medium text-primary">
          Official PayPal Platform Partner
        </div>
        <p className="text-muted-foreground text-base leading-relaxed max-w-lg">
          Secure transactions powered by PayPal. Buy and sell with confidence on our platform.
        </p>
        <div className="rounded-full bg-card/60 shadow-clay-card p-3 hover:-translate-y-1 hover:shadow-clay-card-hover transition-all duration-300">
          <Image
            alt="PayPal Logo"
            className="h-8 lg:h-10 w-auto"
            height="51"
            src={PayPalLogo}
            width="200"
          />
        </div>
      </div>
    </section>
  );
}
