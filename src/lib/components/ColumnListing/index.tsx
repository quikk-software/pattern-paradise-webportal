'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Percent } from 'lucide-react';
import ProductImageSlider from '@/lib/components/ProductImageSlider';
import React from 'react';
import { GetProductResponse } from '@/@types/api-types';

interface ColumnListingProps {
  products: GetProductResponse[];
  listingType: string;
}

const SaleCountdown = ({ dueDate }: { dueDate: string }) => {
  const [timeRemaining, setTimeRemaining] = useState<string>('');

  useEffect(() => {
    const calculateTimeRemaining = () => {
      const now = new Date();
      const saleEndDate = new Date(dueDate);

      if (saleEndDate <= now) {
        setTimeRemaining('Sale ended');
        return;
      }

      const diffMs = saleEndDate.getTime() - now.getTime();
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      const diffHrs = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

      if (diffDays > 0) {
        setTimeRemaining(`${diffDays}d ${diffHrs}h left`);
      } else if (diffHrs > 0) {
        const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
        setTimeRemaining(`${diffHrs}h ${diffMins}m left`);
      } else {
        const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
        setTimeRemaining(`${diffMins}m left`);
      }
    };

    calculateTimeRemaining();
    const timer = setInterval(calculateTimeRemaining, 60000); // Update every minute

    return () => clearInterval(timer);
  }, [dueDate]);

  return (
    <div className="flex items-center text-xs text-gray-500">
      <Clock className="w-3 h-3 mr-1" />
      <span>{timeRemaining}</span>
    </div>
  );
};

export default function ColumnListing({ products, listingType }: ColumnListingProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
      {products.map((product) => {
        const isDueDateActive =
          product.salePrice !== undefined &&
          product.salePriceDueDate !== undefined &&
          new Date(product.salePriceDueDate) > new Date();
        const isSaleActive =
          (product.salePrice !== undefined && product.salePriceDueDate === undefined) ||
          isDueDateActive;

        const discountPercentage = isSaleActive
          ? Math.round(((product.price - product.salePrice!) / product.price) * 100)
          : 0;

        return (
          <Link
            key={product.id}
            rel={'nofollow'}
            href={`/app/secure${
              listingType === 'sell' ? '/products' : listingType === 'test' && '/test/products'
            }/${product.id}`}
          >
            <Card className="flex flex-col justify-between relative h-full">
              {isSaleActive && (
                <div className="absolute -right-2 -top-2 z-10">
                  <div className="relative">
                    <Badge className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 text-xs font-bold shadow-lg">
                      {discountPercentage}% OFF
                    </Badge>
                  </div>
                </div>
              )}
              {isSaleActive && (
                <div className="absolute -right-2 -top-2 z-10">
                  <div className="relative">
                    <Badge className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 text-xs font-bold shadow-lg">
                      {discountPercentage}% OFF
                    </Badge>
                  </div>
                </div>
              )}

              <CardContent className="pt-4 flex flex-col gap-4">
                <ProductImageSlider
                  imageUrls={product.imageUrls}
                  title={product.title}
                  category={product.category}
                  subCategories={product.subCategories}
                />
                <div className="flex flex-col gap-1">
                  <h3 className="font-semibold md:text-lg lg:text-xl">{product.title}</h3>
                  <p className="text-sm text-muted-foreground md:text-base lg:text-lg">
                    {product.category}
                  </p>
                </div>
              </CardContent>

              <CardFooter className="flex flex-col w-full">
                {isSaleActive && (
                  <div className="w-full mb-2 bg-red-50 dark:bg-red-950/20 rounded-md p-1.5 flex items-center justify-center">
                    <Percent className="w-3 h-3 text-red-500 mr-1" />
                    <span className="text-xs text-red-600 dark:text-red-400 font-medium">
                      Save ${(product.price - product.salePrice!).toFixed(2)}
                    </span>
                  </div>
                )}

                <div className="flex justify-between items-center w-full">
                  {product.isFree ? (
                    <span className="font-bold text-sm md:text-base lg:text-lg">FOR FREE</span>
                  ) : isSaleActive ? (
                    <div className="flex flex-col">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-sm md:text-base lg:text-lg text-red-600">
                          ${product.salePrice!.toFixed(2)}
                        </span>
                        <span className="text-xs md:text-sm line-through text-gray-500">
                          ${product.price.toFixed(2)}
                        </span>
                      </div>
                      {product.salePriceDueDate && (
                        <SaleCountdown dueDate={product.salePriceDueDate} />
                      )}
                    </div>
                  ) : (
                    <span className="font-bold text-sm md:text-base lg:text-lg">
                      ${product.price.toFixed(2)}
                    </span>
                  )}
                  <span className="underline text-right text-xs md:text-base lg:text-lg">
                    Details
                  </span>
                </div>
              </CardFooter>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}
