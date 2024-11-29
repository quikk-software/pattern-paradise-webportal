'use client';

import { useSelector } from 'react-redux';
import { useGetProduct } from '@/lib/api';
import { useDownloadPatternsByProductId } from '@/lib/api/pattern';
import React, { useEffect, useState } from 'react';
import { LoadingSpinnerComponent } from '@/components/loading-spinner';
import NotFoundPage from '@/app/not-found';
import { Store } from '@/lib/redux/store';
import { InfoBoxComponent } from '@/components/info-box';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Download } from 'lucide-react';
import CountryFlag from '@/lib/components/CountryFlag';
import RequestStatus from '@/lib/components/RequestStatus';
import { BuyNowButton } from '@/lib/components/BuyNowButton';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import ProductImageSlider from '@/lib/components/ProductImageSlider';
import CreatedByRef from '@/lib/components/CreatedByRef';
import { useRouter } from 'next/navigation';

interface ProductPageComponentProps {
  productId: string;
}

export default function ProductPageComponent({ productId }: ProductPageComponentProps) {
  const [language, setLanguage] = useState<string | undefined>(undefined);

  const { userId } = useSelector((s: Store) => s.auth);

  const router = useRouter();

  const { fetch, data: product, isLoading, isError } = useGetProduct();
  const {
    fetch: downloadPattern,
    isLoading: downloadPatternIsLoading,
    isSuccess: downloadPatternIsSuccess,
    isError: downloadPatternIsError,
    data: file,
  } = useDownloadPatternsByProductId();

  useEffect(() => {
    if (!productId) {
      return;
    }
    fetch(productId);
  }, [productId]);

  useEffect(() => {
    if (!file || !language) {
      return;
    }
    const url = URL.createObjectURL(file);
    const link = document.createElement('a');
    link.href = url;
    link.target = '_self';
    link.download =
      file.name ??
      `${product?.title.toLowerCase().replace(/\s/g, '')}_${
        language ? `${language}_` : ''
      }patterns.zip`;
    document.body.appendChild(link);
    link.click();

    setTimeout(() => {
      URL.revokeObjectURL(url);
      document.body.removeChild(link);
    }, 1000);

    setLanguage(undefined);
  }, [file, language]);

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

  const filesGroupedByLanguage = product.files.reduce((acc, file) => {
    if (!acc[file.language]) {
      acc[file.language] = [];
    }

    const isDuplicate = acc[file.language].some((existingFile) => existingFile.id === file.id);
    if (!isDuplicate) {
      acc[file.language].push(file);
    }

    return acc;
  }, {} as { [language: string]: typeof product.files });

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
                  <>
                    {Object.keys(filesGroupedByLanguage).map((fileLanguage) => (
                      <Button
                        key={fileLanguage}
                        className="w-full sm:w-auto"
                        onClick={() => {
                          setLanguage(fileLanguage);
                          downloadPattern(product.id, fileLanguage);
                        }}
                        disabled={downloadPatternIsLoading}
                      >
                        {downloadPatternIsLoading && fileLanguage === language ? (
                          <LoadingSpinnerComponent size="sm" className="text-white" />
                        ) : (
                          <Download className="mr-2 h-4 w-4" />
                        )}
                        Download pattern <CountryFlag languageCode={fileLanguage} />
                      </Button>
                    ))}
                    <RequestStatus
                      isSuccess={downloadPatternIsSuccess}
                      isError={downloadPatternIsError}
                      successMessage={''}
                    />
                  </>
                ) : (
                  <BuyNowButton
                    price={product.price}
                    productId={product.id}
                    productName={product.title}
                    productStatus={product.status}
                    creatorId={product.creatorId}
                    callback={(orderId: string) => router.push(`/app/auth/me/orders/${orderId}`)}
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
