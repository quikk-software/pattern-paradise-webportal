'use client';

import React, { useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import NotFoundPage from '@/app/not-found';
import ProductImageSlider from '@/lib/components/ProductImageSlider';
import { BuyNowButton } from '@/lib/components/BuyNowButton';
import CreatedByRef from '@/lib/components/CreatedByRef';
import DownloadPatternZipButton from '../lib/components/DownloadPatternZipButton';
import { useGetProduct } from '@/lib/api';
import { LoadingSpinnerComponent } from '@/components/loading-spinner';
import { useSelector } from 'react-redux';
import { Store } from '@/lib/redux/store';
import { InfoBoxComponent } from '@/components/info-box';

interface ProductPageComponentProps {
  productId: string;
}

export default function ProductPageComponent({ productId }: ProductPageComponentProps) {
  const { userId } = useSelector((s: Store) => s.auth);

  const { fetch, data: product, isLoading, isError } = useGetProduct();

  useEffect(() => {
    if (!productId) {
      return;
    }
    fetch(productId);
  }, [productId]);

  if (isError) {
    return <NotFoundPage />;
  }

  if (isLoading || !product) {
    return (
      <div className="flex justify-center items-center h-full">
        <LoadingSpinnerComponent />
      </div>
    );
  }

  const isOwner = product.creatorId === userId;

  return (
    <div className="container mx-auto px-4 py-8 flex flex-col gap-8">
      <Card className="overflow-hidden">
        <CardContent className="p-6">
          <div className="grid gap-8 md:grid-cols-4">
            <ProductImageSlider imageUrls={product.imageUrls} title={product.title} />
            <div className="flex flex-col justify-between gap-6">
              <div className="flex flex-col gap-4">
                <h1 className="text-3xl font-bold">{product.title}</h1>
                <p className="text-gray-600">{product.description}</p>
                <CreatedByRef creatorId={product.creatorId} />
              </div>
              <div className="flex flex-col gap-4">
                {isOwner ? (
                  <InfoBoxComponent message="You are the owner of this pattern" severity="info" />
                ) : null}
                {product.isFree || isOwner ? (
                  <DownloadPatternZipButton productId={product.id} />
                ) : (
                  <BuyNowButton
                    price={product.price}
                    productId={product.id}
                    productStatus={product.status}
                    creatorId={product.creatorId}
                    callback={undefined}
                  />
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <Button asChild className="flex items-center space-x-2" variant="outline">
        <Link href="/">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Go back
        </Link>
      </Button>
    </div>
  );
}
