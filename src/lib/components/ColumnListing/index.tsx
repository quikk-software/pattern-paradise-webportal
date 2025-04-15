import Link from 'next/link';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import ProductImageSlider from '@/lib/components/ProductImageSlider';
import React from 'react';
import { GetProductResponse } from '@/@types/api-types';

interface ColumnListingProps {
  products: GetProductResponse[];
  listingType: string;
}

export default function ColumnListing({ products, listingType }: ColumnListingProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
      {products.map((product) => (
        <Link
          key={product.id}
          rel={'nofollow'}
          href={`/app/secure${
            listingType === 'sell' ? '/products' : listingType === 'test' && '/test/products'
          }/${product.id}`}
        >
          <Card className="flex flex-col justify-between">
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
            <CardFooter className="flex justify-between">
              {product.isFree ? (
                <span className="font-bold text-sm md:text-base lg:text-lg">FOR FREE</span>
              ) : (
                <span className="font-bold text-sm md:text-base lg:text-lg">
                  ${product.price.toFixed(2)}
                </span>
              )}
              <span className="underline text-right text-xs md:text-base lg:text-lg">Details</span>
            </CardFooter>
          </Card>
        </Link>
      ))}
    </div>
  );
}
