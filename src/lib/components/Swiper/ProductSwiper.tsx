'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { X, Heart } from 'lucide-react';
import SwipeableCard, { type SwipeableCardRef } from './SwipeableCard';
import { GetProductResponse } from '@/@types/api-types';
import useMainAreaHeight from '@/hooks/useMainAreaHeight';

interface ProductSwiperProps {
  products: GetProductResponse[];
}

export default function ProductSwiper({ products }: ProductSwiperProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const activeCardRef = useRef<SwipeableCardRef>(null);

  const mainAreaHeight = useMainAreaHeight();

  const handleSwiped = (direction: 'left' | 'right') => {
    setTimeout(() => {
      setCurrentIndex((prev) => prev + 1);
    }, 600);
  };

  const handleLike = () => {
    if (currentIndex >= products.length) return;
    activeCardRef.current?.triggerSwipe('right');
  };

  const handleDislike = () => {
    if (currentIndex >= products.length) return;
    activeCardRef.current?.triggerSwipe('left');
  };

  // Render the card stack
  const renderCardStack = () => {
    if (currentIndex >= products.length) {
      return (
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <h3 className="text-xl font-semibold mb-4">No more products!</h3>
          <p className="text-gray-500 mb-6">You&apos;ve seen all available products.</p>
          <Button onClick={() => setCurrentIndex(0)}>Start Over</Button>
        </div>
      );
    }

    const visibleProducts = products.slice(currentIndex, currentIndex + 3);

    return (
      <div
        className="relative w-full"
        style={{
          height: '350px',
        }}
      >
        {visibleProducts.map((product, index) => {
          const isTop = index === 0;
          return (
            <SwipeableCard
              key={product.id}
              ref={isTop ? activeCardRef : null}
              product={product}
              isActive={isTop}
              stackPosition={index}
              onSwiped={isTop ? handleSwiped : undefined}
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
      <div>{renderCardStack()}</div>

      {currentIndex < products.length && (
        <div className="flex w-full justify-center gap-4 mt-4 absolute bottom-0 left-0 right-0">
          <Button
            variant="outline"
            size="icon"
            className="h-12 w-12 rounded-full border-2 border-red-500 text-red-500 hover:bg-red-50"
            onClick={handleDislike}
          >
            <X className="h-8 w-8" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-12 w-12 rounded-full border-2 border-green-500 text-green-500 hover:bg-green-50"
            onClick={handleLike}
          >
            <Heart className="h-8 w-8" />
          </Button>
        </div>
      )}
    </div>
  );
}
