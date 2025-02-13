'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import PayPalLogo from '@/assets/logos/paypal-logo.png';
import Image from 'next/image';
import Link from 'next/link';
import { APP_TITLE, FEATURED_PRODUCTS_LENGTH } from '@/lib/constants';
import { useSession } from 'next-auth/react';
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

  const { status } = useSession();
  const router = useRouter();
  const screenSize = useScreenSize();

  const isLoggedIn = status === 'authenticated';

  const smallScreen = screenSize === 'xs' || screenSize === 'sm' || screenSize === 'md';

  return (
    <section className="pb-8 lg:pb-0 lg:py-16">
      <div className="grid gap-6 lg:grid-cols-[1fr_500px] lg:gap-12 xl:grid-cols-[1fr_600px]">
        <div className="flex flex-col justify-center space-y-4">
          <div className="space-y-4">
            <div>
              <span className="text-xl text-zinc-500">Welcome to</span>
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                {APP_TITLE}
              </h1>
            </div>
            <p className="max-w-[600px] text-zinc-500 md:text-xl dark:text-zinc-400">
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
        {!smallScreen && products.length === FEATURED_PRODUCTS_LENGTH ? (
          <div className="relative h-[400px] lg:h-[600px] flex items-center justify-center mt-8 mb-4">
            <div className="absolute w-[300px] h-[300px] lg:w-[500px] lg:h-[500px]">
              {products.map((product, index) => (
                <div
                  key={product.id}
                  className={`absolute w-[175px] lg:w-[250px] transition-all duration-300 ease-in-out transform 
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
                  <div className="bg-white rounded-xl shadow-xl overflow-hidden cursor-pointer">
                    <CldImage
                      key={product.id}
                      alt={`${product.title} Pattern`}
                      src={product.imageUrls[0]}
                      width="250"
                      height="188"
                      className={`rounded-lg shadow-md`}
                    />
                    <div className="p-4">
                      <h3 className="font-semibold text-lg">{product.title}</h3>
                      <div className="mt-2 flex items-center justify-between">
                        <span className="font-bold text-primary">${product.price.toFixed(2)}</span>
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
      <div className="mt-12 flex flex-col items-center justify-center space-y-4 text-center">
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
    </section>
  );
}
