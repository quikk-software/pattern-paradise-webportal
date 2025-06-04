'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { X, Heart, ShoppingBag, RefreshCw, ArrowRight } from 'lucide-react';
import SwipeableCard, { type SwipeableCardRef } from './SwipeableCard';
import { GetProductResponse } from '@/@types/api-types';
import useMainAreaHeight from '@/hooks/useMainAreaHeight';
import { useCreateProductLike } from '@/lib/api/product-like';
import Link from 'next/link';
import { useTranslations } from 'use-intl';

interface ProductSwiperProps {
  products: GetProductResponse[];
}

export default function ProductSwiper({ products }: ProductSwiperProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const activeCardRef = useRef<SwipeableCardRef>(null);

  const { mutate: createProductLike } = useCreateProductLike();

  const mainAreaHeight = useMainAreaHeight();
  const t = useTranslations();

  const handleSwiped = (direction: 'left' | 'right', productId: string) => {
    if (direction === 'right') {
      createProductLike(productId, true);
    }
    setCurrentIndex((prev) => prev + 1);
  };

  const handleLike = () => {
    if (currentIndex >= products.length) return;
    activeCardRef.current?.triggerSwipe('right');
  };

  const handleDislike = () => {
    if (currentIndex >= products.length) return;
    activeCardRef.current?.triggerSwipe('left');
  };

  const renderCardStack = () => {
    if (currentIndex >= products.length) {
      return (
        <div className="bg-gradient-to-br from-rose-50 to-rose-100 rounded-xl shadow-xl p-8 text-center border border-rose-200">
          <div className="mb-6 relative">
            <div className="relative">
              <div className="absolute -top-1 -right-1 w-20 h-20 bg-rose-100 rounded-full opacity-60 animate-pulse"></div>
              <div className="absolute -bottom-2 -left-3 w-16 h-16 bg-rose-200 rounded-full opacity-60 animate-pulse delay-300"></div>
              <div className="relative bg-white p-6 rounded-full mx-auto w-32 h-32 flex items-center justify-center shadow-md">
                <ShoppingBag className="w-16 h-16 text-rose-400" />
              </div>
            </div>
          </div>

          <h3 className={`text-2xl font-bold mb-3 text-rose-700`}>You&apos;ve seen it all!</h3>

          <p className={`text-rose-600/80 mb-8`}>
            You&apos;ve swiped through all our amazing patterns. Ready to discover them again?
          </p>

          <div className="flex flex-col gap-3">
            <Button
              onClick={() => setCurrentIndex(0)}
              className={`bg-rose-500 hover:bg-rose-600 text-white gap-2`}
              size="lg"
            >
              <RefreshCw className="w-4 h-4 mr-1" />
              Start Over
            </Button>
          </div>
        </div>
      );
    }

    const visibleProducts = products.slice(currentIndex, currentIndex + 3);

    return (
      <div className="relative w-full h-full grow">
        {visibleProducts.map((product, index) => {
          const isTop = index === 0;
          return (
            <SwipeableCard
              key={product.id}
              ref={isTop ? activeCardRef : null}
              product={product}
              isActive={isTop}
              stackPosition={index}
              onSwiped={(direction) => (isTop ? handleSwiped(direction, product.id) : undefined)}
            />
          );
        })}
      </div>
    );
  };

  return (
    <div
      className="relative w-full flex flex-col"
      style={{
        height: `${mainAreaHeight}px`,
      }}
    >
      <div className="flex-1">{renderCardStack()}</div>

      {currentIndex < products.length && (
        <div>
          <div
            className="flex w-full gap-4 mt-4 flex-0"
            style={{
              justifyContent: 'space-around',
              alignItems: 'center',
            }}
          >
            <Button
              variant="outline"
              size="icon"
              className="h-12 w-12 rounded-full border-2 border-red-500 text-red-500"
              onClick={handleDislike}
            >
              <X />
            </Button>
            {products.at(currentIndex)?.id ? (
              <Button asChild variant={'secondary'} className="space-x-2">
                <Link href={`/app/products/${products.at(currentIndex)?.id}`}>
                  <ArrowRight />
                  {t('swipe.showDetails')}
                </Link>
              </Button>
            ) : null}
            <Button
              variant="outline"
              size="icon"
              className="h-12 w-12 rounded-full border-2 border-green-500 text-green-500"
              onClick={handleLike}
            >
              <Heart />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
