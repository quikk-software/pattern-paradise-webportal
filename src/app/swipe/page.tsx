'use client';

import React, { useEffect } from 'react';

import ProductSwiper from '@/lib/components/Swiper/ProductSwiper';
import { useListProductsForSwipe } from '@/lib/api';

export default function SwipePage() {
  const { fetch, data: products } = useListProductsForSwipe();

  useEffect(() => {
    fetch();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="w-full max-w-md">
        <ProductSwiper products={products} />
      </div>
    </div>
  );
}
