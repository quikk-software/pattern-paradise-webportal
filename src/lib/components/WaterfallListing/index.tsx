import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import ProductImageSlider from '@/lib/components/ProductImageSlider';
import { GetProductResponse } from '@/@types/api-types';
import { Button } from '@/components/ui/button';
import { ArrowRight, Clock, Percent } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { updateFilterField } from '@/lib/features/filter/filterSlice';
import { useTranslations } from 'use-intl';
import { getCurrencySymbol } from '@/lib/utils';

interface WaterfallListingProps {
  products: GetProductResponse[];
  status: 'Released' | 'Created';
  columns: number;
  onImpression?: (productId: string) => Promise<void>;
  showFade?: boolean;
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
    <div className="flex items-center justify-end text-xs text-gray-500">
      <Clock className="w-3 h-3 mr-1" />
      <span className="text-right">{timeRemaining}</span>
    </div>
  );
};

export default function WaterfallListing({
  products,
  status,
  columns,
  onImpression,
  showFade = false,
}: WaterfallListingProps) {
  const productRefs = useRef<(HTMLElement | null)[]>([]);
  const observedProductIds = useRef<Set<string>>(new Set());

  const dispatch = useDispatch();
  const router = useRouter();
  const t = useTranslations();

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

  const handleProductClick = (id: string) => {
    if (typeof window !== 'undefined') {
      const scrollContainer = document.getElementById('main-scroll-area');
      const scrollY = scrollContainer?.scrollTop ?? 0;

      sessionStorage.setItem('scrollY', String(scrollY));
    }

    dispatch(updateFilterField({ key: 'triggerLoad', value: false }));

    if (status === 'Released') {
      router.push(`/app/products/${id}`);
      return;
    }
    if (status === 'Created') {
      router.push(`/app/tester-calls/${id}`);
      return;
    }
  };

  const productGroups: GetProductResponse[][] = [];
  for (let i = 0; i < columns; i++) {
    productGroups[i] = [];
  }

  products.forEach((product, index) => {
    productGroups[index % columns].push(product);
  });

  const isReleased = status === 'Released';

  return (
    <div className="space-y-8">
      <div className="relative">
        <div className="flex gap-2">
          {productGroups.map((group, groupIndex) => (
            <div
              className="flex flex-col gap-2"
              key={groupIndex}
              style={{ flexBasis: `calc(100% / ${columns})`, flexGrow: 0 }}
            >
              {group.map((product, index) => {
                const isDueDateActive =
                  product.salePrice !== undefined &&
                  product.salePriceDueDate !== undefined &&
                  new Date(product.salePriceDueDate) > new Date();
                const isSaleActive =
                  !product.isFree &&
                  ((product.salePrice !== undefined && product.salePriceDueDate === undefined) ||
                    isDueDateActive);

                return (
                  <div
                    key={product.id}
                    onClick={() => handleProductClick(product.id)}
                    className="w-full cursor-pointer"
                  >
                    <Card
                      ref={(el) => {
                        if (el) productRefs.current[index] = el;
                      }}
                      data-product-id={product.id}
                      className="flex flex-col justify-between w-full"
                    >
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
                      {isReleased ? (
                        <CardFooter className="flex flex-col gap-1">
                          <div className="flex justify-end items-end w-full">
                            {product.isFree ? (
                              <span className="font-bold text-right text-sm md:text-base lg:text-lg">
                                {t('browse.forFree')}
                              </span>
                            ) : isSaleActive ? (
                              <div className="flex flex-col items-end">
                                <div className="flex items-center gap-1.5">
                                  <span className="font-bold text-sm md:text-base lg:text-lg text-red-600 text-right">
                                    ${product.salePrice!.toFixed(2)}
                                  </span>
                                  <span className="text-xs md:text-sm line-through text-gray-500 text-right">
                                    ${product.price.toFixed(2)}
                                  </span>
                                </div>
                                {product.salePriceDueDate && (
                                  <SaleCountdown dueDate={product.salePriceDueDate} />
                                )}
                              </div>
                            ) : (
                              <span className="font-bold text-right text-sm md:text-base lg:text-lg">
                                {getCurrencySymbol(product.sellerCurrency)}
                                {product.price.toFixed(2)}
                              </span>
                            )}
                          </div>
                          {isSaleActive && (
                            <div className="w-full mb-2 bg-red-50 dark:bg-red-950/20 rounded-md p-1.5 flex items-center justify-center">
                              <Percent className="w-3 h-3 text-red-500 mr-1" />
                              <span className="text-xs text-red-600 dark:text-red-400 font-medium">
                                {t('browse.saveMoney')} {getCurrencySymbol(product.sellerCurrency)}
                                {(product.price - product.salePrice!).toFixed(2)}
                              </span>
                            </div>
                          )}
                        </CardFooter>
                      ) : null}
                    </Card>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
        {showFade ? (
          <div className="absolute bottom-0 left-0 w-full h-1/5 bg-gradient-to-t from-white to-transparent pointer-events-none" />
        ) : null}
      </div>
      {showFade ? (
        <div className="flex justify-center">
          <Button size="lg" asChild>
            <Link href="/browse">
              {t('browse.browsePatterns')} <ArrowRight />
            </Link>
          </Button>
        </div>
      ) : null}
    </div>
  );
}
