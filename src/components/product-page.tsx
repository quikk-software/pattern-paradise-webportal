import React from 'react';
import { ArrowLeft, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { getProduct } from '@/lib/api/static/product/getProduct';
import NotFoundPage from '@/app/not-found';
import ProductImageSlider from '@/lib/components/ProductImageSlider';

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
                <div className="flex items-center mb-6">
                  <User className="h-5 w-5 mr-2" />
                  <span className="text-sm text-gray-500">Created by PLACEHOLDER</span>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-6">
                  <span className="text-3xl font-bold">€{product.price.toFixed(2)}</span>
                  <Button className="px-8">Buy now</Button>
                </div>
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
