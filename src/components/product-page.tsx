'use client';

import { useSelector } from 'react-redux';
import { useGetProduct } from '@/lib/api';
import React, { useEffect } from 'react';
import { LoadingSpinnerComponent } from '@/components/loading-spinner';
import NotFoundPage from '@/app/not-found';
import { Store } from '@/lib/redux/store';
import { BuyNowButton } from '@/lib/components/BuyNowButton';
import { Card, CardContent } from '@/components/ui/card';
import ProductImageSlider from '@/lib/components/ProductImageSlider';
import CreatedByRef from '@/lib/components/CreatedByRef';
import { useRouter } from 'next/navigation';
import DownloadPatternZipButton from '@/lib/components/DownloadPatternZipButton';
import GoBackButton from '@/lib/components/GoBackButton';
import { InfoBoxComponent } from '@/components/info-box';
import ProductHashtags from '@/components/product-hashtags';
import ShowMoreText from '@/lib/components/ShowMoreText';
import ProductCategories from '@/lib/components/ProductCategories';

interface ProductPageComponentProps {
  productId: string;
}

export default function ProductPageComponent({ productId }: ProductPageComponentProps) {
  const { userId } = useSelector((s: Store) => s.auth);

  const router = useRouter();

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
    <div className="container mx-auto max-w-lg px-4 py-8 flex flex-col gap-8">
      <Card className="overflow-hidden">
        <CardContent className="p-6">
          <div className="grid gap-8">
            <ProductImageSlider imageUrls={product.imageUrls} title={product.title} />
            <div className="flex flex-col justify-between gap-8">
              <div className="flex flex-col gap-4">
                <h1 className="text-3xl font-bold">{product.title}</h1>
                <ProductCategories
                  category={product.category}
                  subCategories={product.subCategories}
                />
                <ShowMoreText description={product.description} maxRows={4} />
                <ProductHashtags hashtags={product.hashtags} />
              </div>
              <div className="space-y-2">
                <CreatedByRef creatorId={product.creatorId} />
                {isOwner ? (
                  <InfoBoxComponent severity="info" message="You are the owner of this pattern" />
                ) : null}
              </div>
              <div className="flex flex-col gap-2">
                {product.isFree || isOwner ? (
                  <DownloadPatternZipButton
                    productId={product.id}
                    productTitle={product.title}
                    files={product.files}
                  />
                ) : (
                  <BuyNowButton
                    price={product.price}
                    productId={product.id}
                    productName={product.title}
                    callback={(orderId: string) =>
                      router.push(`/app/secure/auth/me/orders/${orderId}`)
                    }
                  />
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <GoBackButton />
    </div>
  );
}
