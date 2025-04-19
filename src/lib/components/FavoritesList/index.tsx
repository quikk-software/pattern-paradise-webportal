'use client';

import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Heart } from 'lucide-react';
import { useListProductLikes } from '@/lib/api/product-like';
import React, { useEffect, useRef, useState } from 'react';
import { GetProductLikeResponse } from '@/@types/api-types';
import Link from 'next/link';
import { EasterEgg } from '@/lib/components/EasterEgg';

export default function FavoritesList() {
  const [filterOption, setFilterOption] = useState<string>('liked');

  const observer = useRef<IntersectionObserver | null>(null);

  const {
    fetch: fetchProductLikes,
    data: productLikes,
    isLoading: fetchProductLikesIsLoading,
    hasNextPage,
  } = useListProductLikes({});

  useEffect(() => {
    fetchProductLikes(false);
  }, []);

  useEffect(() => {
    fetchProductLikes(
      filterOption === 'swiped' ? true : filterOption === 'liked' ? false : undefined,
    );
  }, [filterOption]);

  const lastProductRef = (node: HTMLElement | null) => {
    if (fetchProductLikesIsLoading) {
      return;
    }
    if (observer.current) {
      observer.current.disconnect();
    }

    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasNextPage) {
        fetchProductLikes(
          filterOption === 'swiped' ? true : filterOption === 'liked' ? false : undefined,
        );
      }
    });

    if (node) {
      observer.current.observe(node);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">
          Your Favorite Patterns{' '}
          <EasterEgg eventCampaignId={'00000000-0000-0000-0000-000000000005'} size={'xs'} />
        </h1>
      </div>

      <Tabs
        defaultValue={filterOption}
        className="w-full"
        onValueChange={(value) => setFilterOption(value)}
      >
        <TabsList className="mb-6 grid w-full grid-cols-2">
          <TabsTrigger value="liked">Regular Likes</TabsTrigger>
          <TabsTrigger value="swiped">Swipe Likes</TabsTrigger>
        </TabsList>

        <TabsContent value="liked" className="mt-0">
          <div className="space-y-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {productLikes.map((item) => (
                <ProductCard key={item.id} item={item} />
              ))}
            </div>
            <div ref={lastProductRef} className="h-10" />
          </div>
        </TabsContent>

        <TabsContent value="swiped" className="mt-0">
          <div className="space-y-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {productLikes.map((item) => (
                <ProductCard key={item.id} item={item} />
              ))}
            </div>
            <div ref={lastProductRef} className="h-10" />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function ProductCard({ item }: { item: GetProductLikeResponse }) {
  return (
    <Link href={`/app/products/${item.productId}`}>
      <Card className="overflow-hidden h-full flex flex-col">
        <div className="relative pt-4 px-4">
          <Badge
            className="absolute top-4 right-4 z-10 bg-rose-500"
            style={{
              margin: '1rem',
            }}
          >
            <Heart className="h-3 w-3 mr-1 fill-white" />
            Liked
          </Badge>
          <div className="aspect-square relative rounded-lg overflow-hidden">
            <Image
              src={item.product.imageUrls[0] || ''}
              alt={item.product.title}
              fill
              className="object-cover transition-all hover:scale-105"
            />
          </div>
        </div>
        <CardHeader className="pt-4 pb-0">
          <h3 className="font-semibold text-lg line-clamp-2">{item.product.title}</h3>
        </CardHeader>
        <CardContent className="pb-0">
          <p className="text-muted-foreground text-sm">
            Added on {new Date(item.createdAt).toLocaleDateString()}
          </p>
        </CardContent>
        <CardFooter className="mt-auto pt-4">
          <div className="flex justify-between items-center w-full">
            <span className="font-bold text-lg">${item.product.price.toFixed(2)}</span>
            <Button variant="outline" size="sm">
              View Details
            </Button>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
