import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import ProductImageSlider from '@/lib/components/ProductImageSlider';
import { GetProductResponse } from '@/@types/api-types';

interface WaterfallListingProps {
  products: GetProductResponse[];
  listingType: string;
  columns: number;
  onImpression?: (productId: string) => Promise<void>;
}

export default function WaterfallListing({
  products,
  listingType,
  columns,
  onImpression,
}: WaterfallListingProps) {
  const productRefs = useRef<(HTMLElement | null)[]>([]);
  const observedProductIds = useRef<Set<string>>(new Set());

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(async (entry) => {
          if (entry.isIntersecting) {
            const productId = entry.target.getAttribute('data-product-id');
            if (productId && !observedProductIds.current.has(productId)) {
              observedProductIds.current.add(productId);

              try {
                if (onImpression) {
                  await onImpression(productId);
                }
              } catch (error) {
                console.error(`Error tracking impression for product ${productId}:`, error);
              }

              observer.unobserve(entry.target);
            }
          }
        });
      },
      { threshold: 0.5 },
    );

    productRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      observer.disconnect();
    };
  }, [onImpression]);

  const productGroups: GetProductResponse[][] = [];
  for (let i = 0; i < columns; i++) {
    productGroups[i] = [];
  }

  products.forEach((product, index) => {
    productGroups[index % columns].push(product);
  });

  return (
    <div className="flex gap-2">
      {productGroups.map((group, groupIndex) => (
        <div
          className="flex flex-col gap-2"
          key={groupIndex}
          style={{ flexBasis: `calc(100% / ${columns})`, flexGrow: 0 }}
        >
          {group.map((product, index) => (
            <Link
              key={product.id}
              rel={'nofollow'}
              href={`${
                listingType === 'sell'
                  ? '/app/products'
                  : listingType === 'test' && '/app/tester-calls'
              }/${product.id}`}
              className="w-full"
            >
              <Card
                ref={(el) => {
                  if (el) productRefs.current[index] = el;
                }}
                data-product-id={product.id}
                className="flex flex-col justify-between w-full"
              >
                <CardContent className="pt-4 flex flex-col gap-4">
                  <ProductImageSlider imageUrls={product.imageUrls} title={product.title} />
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
                  <span className="underline text-right text-xs md:text-base lg:text-lg">
                    Details
                  </span>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      ))}
    </div>
  );
}
