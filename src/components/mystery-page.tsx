'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import GoBackButton from '@/lib/components/GoBackButton';
import ProductHashtags from '@/components/product-hashtags';
import ProductCategories from '@/lib/components/ProductCategories';
import ShareButton from '@/lib/components/ShareButton';
import Image from 'next/image';
import BuyMysteryButton from '@/lib/components/BuyMysteryButton';

interface MysteryPageComponentProps {
  category: string;
}

export default function MysteryPageComponent({ category }: MysteryPageComponentProps) {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center gap-2">
        <GoBackButton />
        <ShareButton
          url={`${process.env.NEXT_PUBLIC_URL}/app/mystery`}
          shareText={'Get your mystery pattern on Pattern Paradise!'}
        />
      </div>
      <Card className="overflow-hidden">
        <CardContent className="p-6">
          <div className="grid lg:grid-cols-2 gap-4">
            <Image
              alt={`${category} Mystery Pattern on Pattern Paradise`}
              src={`/assets/mystery-pattern_v2.jpeg`}
              width={400}
              height={400}
              className={`rounded-lg shadow-md`}
            />
            <div className="flex flex-col justify-start gap-8">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <h1 className="text-3xl font-bold break-words">{category} Mystery Pattern</h1>
                </div>
                <ProductCategories category={category} subCategories={[]} />
                <p>
                  Feeling adventurous? Let the creativity flow with our Mystery Pattern offer! When
                  you purchase this listing, you’ll receive a random digital{' '}
                  <strong>{category} Pattern</strong> from one of our talented designers on Pattern
                  Paradise.
                  <br />
                  <br />
                  Each pattern is here to spark inspiration - perfect for when you’re in the mood
                  for something new, fun, and unexpected. Will it be a cozy accessory, a stylish
                  garment, or a cute home decor piece? There’s only one way to find out!
                  <br />
                  <br />
                  🎁 What’s included:
                  <br />
                </p>
                <ul className="list-disc ml-5">
                  <li>1 surprise digital pattern ({category})</li>
                  <li>PDF download delivered instantly</li>
                  <li>Designed by one of our creators on Pattern Paradise</li>
                </ul>
                <p>
                  <br />
                  💡 Great for:
                  <br />
                </p>
                <ul className="list-disc ml-5">
                  <li>Gifting to yourself or fellow makers</li>
                  <li>Trying something different</li>
                  <li>Adding a spark of surprise to your crafting</li>
                </ul>
                <p>
                  <br />
                  <br />
                  Take a chance - you might just discover your next favorite project🧶
                </p>
                <ProductHashtags hashtags={[category.toLowerCase(), 'mysterypattern']} />
                <BuyMysteryButton category={category} />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
