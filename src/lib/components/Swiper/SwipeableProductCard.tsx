'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Percent } from 'lucide-react';
import type { GetProductResponse } from '@/@types/api-types';

interface ProductCardProps {
  product: GetProductResponse;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [timeRemaining, setTimeRemaining] = useState<string>('');

  const isDueDateActive =
    product.salePrice !== undefined &&
    product.salePriceDueDate !== undefined &&
    new Date(product.salePriceDueDate) > new Date();
  const isSaleActive =
    !product.isFree &&
    ((product.salePrice !== undefined && product.salePriceDueDate === undefined) ||
      isDueDateActive);

  const discountPercentage = isSaleActive
    ? Math.round(((product.price - product.salePrice!) / product.price) * 100)
    : 0;

  useEffect(() => {
    if (!product.salePriceDueDate) return;

    const calculateTimeRemaining = () => {
      const now = new Date();
      const dueDate = new Date(product.salePriceDueDate!);

      if (dueDate <= now) {
        setTimeRemaining('Sale ended');
        return;
      }

      const diffMs = dueDate.getTime() - now.getTime();
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
  }, [product.salePriceDueDate]);

  return (
    <Card className="w-full h-full flex flex-col overflow-hidden shadow-lg relative">
      {isDueDateActive && (
        <div className="absolute -right-2 -top-2 z-10">
          <div className="relative">
            <Badge className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 text-sm font-bold shadow-lg">
              SALE {discountPercentage}% OFF
            </Badge>
          </div>
        </div>
      )}

      <div className="w-full relative flex-1 overflow-hidden">
        <img
          src={product.imageUrls?.at(0) || ''}
          alt={`${product.title} on Pattern Paradise`}
          style={{
            objectFit: 'contain',
          }}
          onError={(e) => {
            e.currentTarget.src = '';
          }}
        />
      </div>

      <CardContent className="p-4">
        <div className="flex justify-between gap-2 items-start mb-2">
          <h2 className="text-lg font-bold line-clamp-1">{product.title}</h2>

          {isSaleActive ? (
            <div className="flex flex-col items-end">
              <div className="flex items-center gap-2">
                <span className="text-base font-semibold text-red-600">
                  ${product.salePrice!.toFixed(2)}
                </span>
                <span className="text-sm line-through text-gray-500">
                  ${product.price.toFixed(2)}
                </span>
              </div>
              {isDueDateActive ? (
                <div className="flex items-center text-xs text-gray-500 mt-1">
                  <Clock className="w-3 h-3 mr-1" />
                  <span>{timeRemaining}</span>
                </div>
              ) : null}
            </div>
          ) : (
            <span className="text-base font-semibold text-green-600">
              ${product.price.toFixed(2)}
            </span>
          )}
        </div>

        {isSaleActive && (
          <div className="w-full mt-1 bg-red-50 dark:bg-red-950/20 rounded-md p-2 flex items-center justify-center">
            <Percent className="w-4 h-4 text-red-500 mr-1" />
            <span className="text-xs text-red-600 dark:text-red-400 font-medium">
              Limited time offer! Save ${(product.price - product.salePrice!).toFixed(2)}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
