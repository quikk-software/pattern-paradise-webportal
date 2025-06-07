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
import GoBackButton from '@/lib/components/GoBackButton';
import { InfoBoxComponent } from '@/components/info-box';
import ProductHashtags from '@/components/product-hashtags';
import ShowMoreText from '@/lib/components/ShowMoreText';
import ProductCategories from '@/lib/components/ProductCategories';
import ProductMetrics from '@/lib/components/ProductMetrics';
import TestingMetrics from '@/lib/components/TestingMetrics';
import { ReportProduct } from '@/lib/components/ReportProduct';
import ReviewMessages from '@/lib/components/ReviewMessages';
import TesterShoutout from '@/lib/components/TesterShoutout';
import { PayPalOrderProvider } from '@/lib/hooks/usePayPalOrder';
import ShareButton from '@/lib/components/ShareButton';
import LikeProductButton from '@/lib/components/LikeProductButton';
import { useValidSession } from '@/hooks/useValidSession';
import Link from 'next/link';
import DownloadPatternArea from '@/lib/components/DownloadPatternArea';
import { useTranslations } from 'use-intl';

interface ProductPageComponentProps {
  productId: string;
}

export default function ProductPageComponent({ productId }: ProductPageComponentProps) {
  const { userId } = useSelector((s: Store) => s.auth);

  const { data: session, status } = useValidSession();
  const t = useTranslations();

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
  const isLoggedIn = status === 'authenticated' && session?.user.accessToken;
  const isDueDateActive =
    product.salePrice !== undefined &&
    product.salePriceDueDate !== undefined &&
    new Date(product.salePriceDueDate) > new Date();
  const isSaleActive =
    !product.isFree &&
    ((product.salePrice !== undefined && product.salePriceDueDate === undefined) ||
      isDueDateActive);

  return (
    <PayPalOrderProvider
      productId={product.id}
      userId={userId}
      price={isSaleActive ? product.salePrice : product.price}
    >
      <div className="flex flex-col gap-8">
        <div className="flex items-center gap-2">
          <GoBackButton />
          <ShareButton
            url={`${process.env.NEXT_PUBLIC_URL}/app/products/${productId}`}
            shareText={t('product.share')}
          />
        </div>
        <Card className="overflow-hidden">
          <CardContent className="p-6">
            <div className="grid lg:grid-cols-2 gap-4">
              <ProductImageSlider
                imageUrls={product.imageUrls}
                title={product.title}
                category={product.category}
                subCategories={product.subCategories}
              />
              <div className="flex flex-col justify-start gap-8">
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-2">
                    {isLoggedIn && !isOwner ? (
                      <div className="flex justify-end gap-2">
                        <ReportProduct productId={product.id} />
                        <LikeProductButton productId={product.id} />
                      </div>
                    ) : null}
                    <h1 className="text-3xl font-bold break-words">{product.title}</h1>
                  </div>
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
                    <InfoBoxComponent severity="info" message={t('product.owner')} />
                  ) : null}
                </div>
                <div className="flex flex-col gap-2">
                  {product.isFree || isOwner ? (
                    <DownloadPatternArea product={product} />
                  ) : (
                    <>
                      <BuyNowButton product={product} />
                      <InfoBoxComponent
                        title="Instant download"
                        message={
                          <span>
                            {t.rich('product.buyHint1', {
                              DownloadLink: (chunks) => (
                                <Link
                                  href="/app/secure/auth/me/patterns"
                                  className="text-blue-500 underline"
                                >
                                  {t('product.downloadLinkText')}
                                </Link>
                              ),
                            })}
                            <br />
                            <br />
                            {t('product.buyHint2')}
                          </span>
                        }
                      />
                    </>
                  )}
                  {isOwner ? (
                    <div className="flex flex-col gap-2 mt-4">
                      <ProductMetrics productId={product.id} />
                      <TestingMetrics productId={product.id} />
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <ReviewMessages productId={product.id} isFree={product.isFree} />
        <TesterShoutout productId={product.id} />
      </div>
    </PayPalOrderProvider>
  );
}
