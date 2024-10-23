'use client';

import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CldImage } from 'next-cloudinary';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  image: string;
}

export default function ProductCard({ id, name, price, image }: ProductCardProps) {
  return (
    <Card key={id} className="flex flex-col">
      <CardHeader>
        <CldImage
          alt="Pattern paradise"
          src={image}
          width="340"
          height="250"
          crop={{
            type: 'auto',
            source: true,
          }}
        />
      </CardHeader>
      <CardContent className="flex-grow">
        <CardTitle>{name}</CardTitle>
      </CardContent>
      <CardFooter
        className="w-full flex items-center justify-between"
        style={{
          // TODO: Check why class is not working
          justifyContent: 'space-between',
        }}
      >
        <span className="text-lg font-bold">€{price.toFixed(2)}</span>
        <Link href={`/products/${id}`}>
          <Button>Show details</Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
