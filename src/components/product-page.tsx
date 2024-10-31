import React from 'react';
import { ArrowLeft, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { getProduct } from '@/lib/api/static/product/getProduct';
import NotFoundPage from '@/app/not-found';
import ProductImageSlider from '@/lib/components/ProductImageSlider';
import { BuyNowButton } from '@/lib/components/BuyNowButton';
import CreatedByRef from '@/lib/components/CreatedByRef';

interface ProductPageComponentProps {
  productId: string;
}

export async function ProductPageComponent({ productId }: ProductPageComponentProps) {
  const product = await getProduct(productId);

  if (!product) {
    return <NotFoundPage />;
  }

  return (
    <div className="container mx-auto px-4 py-8 flex flex-col gap-8">
      <Card className="overflow-hidden">
        <CardContent className="p-6">
          <div className="grid gap-8 md:grid-cols-2">
            <ProductImageSlider imageUrls={product.imageUrls} title={product.title} />
            <div className="flex flex-col justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-4">{product.title}</h1>
                <p className="text-gray-600 mb-6">{product.description}</p>
                <CreatedByRef creatorId={product.creatorId} />
              </div>
              <div>
                <BuyNowButton price={product.price} productId={product.id} />
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
