'use client';

import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { CldImage } from 'next-cloudinary';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import { Store } from '@/lib/redux/store';
import { Trash } from 'lucide-react';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { LoadingSpinnerComponent } from '@/components/loading-spinner';
import { useDeleteProduct, useReleaseProduct } from '@/lib/api';
import RequestStatus from '@/lib/components/RequestStatus';

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  image: string;
  isFree: boolean;
  creatorId: string;
  status?: string;
  unavailable?: boolean;
  isTesterCall?: boolean;
  isProductView?: boolean;
}

export default function ProductCard({
  id,
  name,
  price,
  image,
  isFree,
  creatorId,
  status,
  unavailable = false,
  isTesterCall = false,
  isProductView = false,
}: ProductCardProps) {
  const [isReleaseProductDrawerOpen, setIsReleaseProductDrawerOpen] = useState(false);
  const [isDeleteProductDrawerOpen, setIsDeleteProductDrawerOpen] = useState(false);

  const { userId } = useSelector((s: Store) => s.auth);
  const {
    fetch: deleteProduct,
    isLoading: deleteProductIsLoading,
    isSuccess: deleteProductIsSuccess,
    isError: deleteProductIsError,
  } = useDeleteProduct();
  const {
    mutate: releaseProduct,
    isLoading: releaseProductIsLoading,
    isSuccess: releaseProductIsSuccess,
    isError: releaseProductIsError,
  } = useReleaseProduct();

  const isCreator = userId === creatorId;

  const handleDeleteProductClick = async (productId: string) => {
    await deleteProduct(productId);
    setIsDeleteProductDrawerOpen(false);
    window.location.reload();
  };

  const handleReleaseProductClick = async (productId: string) => {
    await releaseProduct(productId);
    setIsReleaseProductDrawerOpen(false);
    window.location.reload();
  };

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
        {isFree ? (
          <span className="text-lg font-bold">FOR FREE</span>
        ) : (
          <span className="text-lg font-bold">€{price.toFixed(2)}</span>
        )}
        {isTesterCall ? (
          <Link href={`/test/products/${id}`}>
            <Button>Show tester call</Button>
          </Link>
        ) : (
          <Link href={`/products/${id}`}>
            <Button>Show details</Button>
          </Link>
        )}
      </CardFooter>
      {isProductView && isCreator && !unavailable ? (
        <>
          <CardFooter className="w-full flex flex-col gap-6">
            <hr className="h-0.5 border-t-0 bg-neutral-100 dark:bg-white/10 w-full" />
            <div className="flex justify-end items-center gap-2 w-full">
              <Link href={`/sell/products/${id}`}>
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
          <Drawer open={isReleaseProductDrawerOpen} onOpenChange={setIsReleaseProductDrawerOpen}>
            <DrawerContent className="p-4">
              <div className="mx-auto w-full max-w-sm flex flex-col gap-4">
                <DrawerHeader>
                  <DrawerTitle>Release pattern</DrawerTitle>
                  <DrawerTitle className="text-sm font-medium">
                    If you release your pattern yourself without testers approving it in a{' '}
                    <Link href="/sell/testings" className="text-blue-500 underline">
                      testing
                    </Link>
                    , your pattern will be ranked the lowest in search results on Pattern Paradise.
                  </DrawerTitle>
                </DrawerHeader>
                <Button
                  onClick={() => {
                    setIsReleaseProductDrawerOpen(false);
                  }}
                  variant={'outline'}
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    handleReleaseProductClick(id);
                  }}
                  disabled={releaseProductIsLoading}
                >
                  {releaseProductIsLoading ? <LoadingSpinnerComponent size="sm" /> : null}
                  Release pattern
                </Button>
                <RequestStatus
                  isSuccess={releaseProductIsSuccess}
                  isError={releaseProductIsError}
                />
              </div>
            </DrawerContent>
          </Drawer>
          <Drawer open={isDeleteProductDrawerOpen} onOpenChange={setIsDeleteProductDrawerOpen}>
            <DrawerContent className="p-4">
              <div className="mx-auto w-full max-w-sm flex flex-col gap-4">
                <DrawerHeader>
                  <DrawerTitle>Are you sure?</DrawerTitle>
                </DrawerHeader>
                <Button
                  onClick={() => {
                    setIsDeleteProductDrawerOpen(false);
                  }}
                  variant={'outline'}
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    handleDeleteProductClick(id);
                  }}
                  variant={'destructive'}
                  disabled={deleteProductIsLoading}
                >
                  {deleteProductIsLoading ? <LoadingSpinnerComponent size="sm" /> : null}
                  Delete pattern
                </Button>
                <RequestStatus isSuccess={deleteProductIsSuccess} isError={deleteProductIsError} />
              </div>
            </DrawerContent>
          </Drawer>
        </>
      ) : null}
    </Card>
  );
}
