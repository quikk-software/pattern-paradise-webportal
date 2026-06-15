'use client';

import { useSelector } from 'react-redux';
import { useGetProduct } from '@/lib/api';
import React, { useEffect } from 'react';
import { LoadingSpinnerComponent } from '@/components/loading-spinner';
import NotFoundPage from '@/app/not-found';
import { Store } from '@/lib/redux/store';
import { BuyNowButton } from '@/lib/components/BuyNowButton';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import ProductGallery from '@/lib/components/ProductGallery';
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
import { useTranslations } from 'next-intl';
import { getCurrencySymbol } from '@/lib/utils';

interface ProductPageComponentProps {
  productId: string;
}

// Maps the stored experience level to a craft-themed badge variant.
const DIFFICULTY_VARIANT: Record<string, 'beginner' | 'intermediate' | 'advanced'> = {
  Beginner: 'beginner',
  Intermediate: 'intermediate',
  Professional: 'advanced',
};

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

  const difficultyVariant = product.experience ? DIFFICULTY_VARIANT[product.experience] : undefined;

  return (
    <PayPalOrderProvider
      productId={product.id}
      userId={userId}
      price={isSaleActive ? product.salePrice : product.price}
      currency={getCurrencySymbol(product.sellerCurrency)}
    >
      <div className="flex flex-col gap-8">
        {/* Top action bar */}
        <div className="flex items-center justify-between gap-2">
          <GoBackButton className="w-auto" />
          <div className="flex items-center gap-2">
            <ShareButton
              url={`${process.env.NEXT_PUBLIC_URL}/app/products/${productId}`}
              shareText={t('product.share')}
            />
            {isLoggedIn && !isOwner ? (
              <>
                <LikeProductButton productId={product.id} />
                <ReportProduct productId={product.id} />
              </>
            ) : null}
          </div>
        </div>

        {/* Main: gallery + description (left), details + sticky purchase (right).
            Columns are capped and centered on desktop so the image stays compact
            (no oversized 50/50 split) while the details get comfortable room. */}
        <div className="grid gap-8 lg:grid-cols-[minmax(0,380px)_minmax(0,560px)] lg:items-start lg:justify-center">
          {/* Left column */}
          <div className="flex min-w-0 flex-col gap-6">
            <ProductGallery
              imageUrls={product.imageUrls}
              title={product.title}
              category={product.category}
              subCategories={product.subCategories}
            />
            <div className="flex flex-col gap-4">
              <ShowMoreText description={product.description} maxRows={4} />
              <ProductHashtags hashtags={product.hashtags} />
            </div>
          </div>

          {/* Right column */}
          <div className="flex min-w-0 flex-col gap-5">
            <div className="flex flex-col gap-3">
              <h1 className="font-display text-2xl font-bold leading-tight tracking-tight text-balance break-words sm:text-3xl lg:text-4xl">
                {product.title}
              </h1>
              <div className="flex flex-col gap-2">
                <ProductCategories
                  category={product.category}
                  subCategories={product.subCategories}
                />
                {difficultyVariant ? (
                  <div>
                    <Badge variant={difficultyVariant}>{product.experience}</Badge>
                  </div>
                ) : null}
              </div>
              <div className="space-y-2">
                <CreatedByRef creatorId={product.creatorId} />
                {isOwner ? (
                  <InfoBoxComponent severity="info" message={t('product.owner')} />
                ) : null}
              </div>
            </div>

            {/* Sticky purchase / download card. top offset clears the sticky
                navbar (h-16 = 64px) plus a 16px gap so it isn't hidden on scroll. */}
            <div className="lg:sticky lg:top-20">
              <Card className="shadow-card">
                <CardContent className="flex flex-col gap-2 p-5">
                  {product.isFree || isOwner ? (
                    <DownloadPatternArea product={product} />
                  ) : (
                    <>
                      <BuyNowButton product={product} />
                      <InfoBoxComponent
                        title={t('product.buyHintTitle')}
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
                </CardContent>
              </Card>
            </div>

            {isOwner ? (
              <div className="flex flex-col gap-2">
                <ProductMetrics productId={product.id} />
                <TestingMetrics productId={product.id} />
              </div>
            ) : null}
          </div>
        </div>

        <ReviewMessages productId={product.id} isFree={product.isFree} />
        <TesterShoutout productId={product.id} />
      </div>
    </PayPalOrderProvider>
  );
}
