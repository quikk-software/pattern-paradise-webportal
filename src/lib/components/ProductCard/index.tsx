'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import { Store } from '@/lib/redux/store';
import { Trash } from 'lucide-react';
import { useDeleteProduct } from '@/lib/api';
import ConfirmDrawer from '@/lib/components/ConfirmDrawer';
import ProductImageSlider from '@/lib/components/ProductImageSlider';
import ReleasePatternDrawer from '@/lib/components/ReleasePatternDrawer';

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  imageUrls: string[];
  isFree: boolean;
  creatorId: string;
  status?: string;
  testingStatus?: string;
  unavailable?: boolean;
  isTesterCall?: boolean;
  isProductView?: boolean;
}

export default function ProductCard({
  id,
  name,
  price,
  imageUrls,
  isFree,
  creatorId,
  status,
  testingStatus,
  unavailable = false,
  isTesterCall = false,
  isProductView = false,
}: ProductCardProps) {
  const [isReleaseProductDrawerOpen, setIsReleaseProductDrawerOpen] = useState(false);
  const [isDeleteProductDrawerOpen, setIsDeleteProductDrawerOpen] = useState(false);

  const { userId } = useSelector((s: Store) => s.auth);
  const { fetch: deleteProduct, isLoading: deleteProductIsLoading } = useDeleteProduct();

  const isCreator = userId === creatorId;

  const handleDeleteProductClick = async (productId: string) => {
    await deleteProduct(productId);
    setIsDeleteProductDrawerOpen(false);
    window.location.reload();
  };

  return (
    <Card key={id} className="flex flex-col">
      <CardHeader>
        <ProductImageSlider imageUrls={imageUrls} title={name} />
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
        {isFree ? (
          <span className="text-lg font-bold">FOR FREE</span>
        ) : (
          <span className="text-lg font-bold">${price.toFixed(2)}</span>
        )}
        {isTesterCall ? (
          <Link href={`/app/secure/test/products/${id}`}>
            <Button>Show tester call</Button>
          </Link>
        ) : (
          <Link href={`/app/products/${id}`}>
            <Button>Show details</Button>
          </Link>
        )}
      </CardFooter>
      {isProductView && isCreator && !unavailable ? (
        <>
          <CardFooter className="w-full flex flex-col gap-6">
            <hr className="h-0.5 border-t-0 bg-neutral-100 dark:bg-white/10 w-full" />
            <div className="flex justify-end items-center gap-2 w-full">
              <Link href={`/app/secure/sell/products/${id}`}>
                <Button variant="secondary">Update product</Button>
              </Link>
              <Button
                variant="destructive"
                onClick={() => {
                  setIsDeleteProductDrawerOpen(true);
                }}
              >
                <Trash />
              </Button>
            </div>
            {status === 'Created' || status === 'InProgress' ? (
              <Button
                className="w-full"
                onClick={() => {
                  setIsReleaseProductDrawerOpen(true);
                }}
              >
                Release pattern
              </Button>
            ) : null}
          </CardFooter>
          <ReleasePatternDrawer
            isOpen={isReleaseProductDrawerOpen}
            setIsOpen={setIsReleaseProductDrawerOpen}
            productId={id}
            testingStatus={testingStatus}
          />
          <ConfirmDrawer
            isOpen={isDeleteProductDrawerOpen}
            setIsOpen={setIsDeleteProductDrawerOpen}
            callbackFn={() => {
              handleDeleteProductClick(id).then(() => setIsDeleteProductDrawerOpen(false));
            }}
            isLoading={deleteProductIsLoading}
            description="You cannot restore deleted patterns."
          />
        </>
      ) : null}
    </Card>
  );
}
