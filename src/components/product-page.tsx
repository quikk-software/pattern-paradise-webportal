'use client';

import React, { useEffect, useState } from 'react';
import { ArrowLeft, ChevronLeft, ChevronRight, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useGetProduct } from '@/lib/api';
import { LoadingSpinnerComponent } from '@/components/loading-spinner';
import NotFoundPage from '@/app/not-found';
import { CldImage } from 'next-cloudinary';
import Link from 'next/link';

interface ProductPageComponentProps {
  productId: string;
}

export function ProductPageComponent({ productId }: ProductPageComponentProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const { fetch, data: product, isLoading, isError } = useGetProduct();

  useEffect(() => {
    fetch(productId);
  }, [productId]);

  if (isError) {
    return <NotFoundPage />;
  }

  if (isLoading || !product) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <LoadingSpinnerComponent />
      </div>
    );
  }

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === product.imageUrls.length - 1 ? 0 : prevIndex + 1,
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? product.imageUrls.length - 1 : prevIndex - 1,
    );
  };

  return (
    <div className="container mx-auto px-4 py-8 flex flex-col gap-8">
      <Card className="overflow-hidden">
        <CardContent className="p-6">
          <div className="grid gap-8 md:grid-cols-2">
            <div className="relative aspect-square">
              <CldImage
                alt={`${product.title} - Image ${currentImageIndex + 1}`}
                src={product.imageUrls[currentImageIndex]}
                width="1000"
                height="1000"
                crop={{
                  type: 'auto',
                  source: true,
                }}
              />
              <div className="absolute inset-0 flex items-center justify-between p-4">
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full bg-white/80 backdrop-blur-sm"
                  onClick={prevImage}
                  aria-label="Previous image"
                >
                  <ChevronLeft className="h-6 w-6" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full bg-white/80 backdrop-blur-sm"
                  onClick={nextImage}
                  aria-label="Next image"
                >
                  <ChevronRight className="h-6 w-6" />
                </Button>
              </div>
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {product.imageUrls.map((_, index) => (
                  <div
                    key={index}
                    className={`h-2 w-2 rounded-full ${
                      index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>
            </div>
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
