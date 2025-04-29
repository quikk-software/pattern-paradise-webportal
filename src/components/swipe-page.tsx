'use client';

import { useListProductsForSwipe } from '@/lib/api';
import React, { useEffect } from 'react';
import ProductSwiper from '@/lib/components/Swiper/ProductSwiper';

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
