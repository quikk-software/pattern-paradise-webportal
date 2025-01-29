'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle, ShoppingBag, ChartNoAxesCombined } from 'lucide-react';
import Link from 'next/link';
import { useGetUser, useListProductsByUserId } from '@/lib/api';
import { useSelector } from 'react-redux';
import { Store } from '@/lib/redux/store';
import ProductCard from '@/lib/components/ProductCard';
import { LoadingSpinnerComponent } from '@/components/loading-spinner';
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card';
import PatternParadiseIcon from '@/lib/icons/PatternParadiseIcon';
import { InfoBoxComponent } from '@/components/info-box';
import { useRouter } from 'next/navigation';
import { useGetProductReportsCount } from '@/lib/api/report';
import OpenIncidentsInfoBox from '@/lib/components/OpenIncidentsInfoBox';

const getStatusColor = (status?: string) => {
  switch (status) {
    case 'Created':
      return 'text-yellow-500';
    case 'InProgress':
      return 'text-blue-500';
    case 'Released':
      return 'text-green-500';
    case 'Declined':
      return 'text-red-500';
    case 'Aborted':
      return 'text-red-500';
    case 'Deleted':
      return 'text-red-500';
    default:
      return 'text-gray-500';
  }
};

export function SellPageComponent() {
  const [loadMore, setLoadMore] = useState(false);

  const router = useRouter();

  const { userId } = useSelector((s: Store) => s.auth);

  const { fetch, data: products, isLoading, hasNextPage } = useListProductsByUserId({});
  const { fetch: fetchProductReportsCount, data: productReportsCount } =
    useGetProductReportsCount();
  const { fetch: fetchUser, data: user } = useGetUser();

  useEffect(() => {
    fetch(userId);
    fetchUser(userId);
    fetchProductReportsCount(userId);
  }, [userId]);

  useEffect(() => {
    if (!loadMore) {
      return;
    }
    fetch(userId);
    setLoadMore((p) => !p);
  }, [loadMore, userId]);

  return (
    <div>
      <header className="flex flex-col gap-4 mb-8">
        <h1 className="text-3xl font-bold">Actions</h1>
        {productReportsCount && productReportsCount > 0 ? (
          <OpenIncidentsInfoBox type="product" count={productReportsCount} />
        ) : null}
        {user?.paypalMerchantIsActive === false ? (
          <InfoBoxComponent
            message={
              <>
                In order to create and sell patterns, you must{' '}
                <Link
                  href="/app/secure/auth/me?action=scrollToPayPal"
                  className="text-blue-500 underline"
                >
                  connect PayPal
                </Link>{' '}
                to your Pattern Paradise account.
              </>
            }
          />
        ) : null}
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        <div className="block">
          <Button
            variant="outline"
            className="w-full h-full min-h-[100px] flex flex-col items-center justify-center gap-2"
            disabled={!user?.paypalMerchantIsActive}
            onClick={() => router.push('/app/secure/sell/submit')}
          >
            <PlusCircle className="h-8 w-8" />
            <span className="text-lg font-semibold">Create Pattern</span>
          </Button>
        </div>
        <Link href="/app/secure/sell/dashboard" className="block">
          <Button
            variant="outline"
            className="w-full h-full min-h-[100px] flex flex-col items-center justify-center gap-2 "
          >
            <ChartNoAxesCombined className="h-8 w-8" />
            <span className="text-lg font-semibold">Show Analytics</span>
          </Button>
        </Link>
        <Link href="/app/secure/sell/orders" className="block">
          <Button
            variant="outline"
            className="w-full h-full min-h-[100px] flex flex-col items-center justify-center gap-2 "
          >
            <ShoppingBag className="h-8 w-8" />
            <span className="text-lg font-semibold">Show My Orders</span>
          </Button>
        </Link>
        <Link href="/app/secure/sell/testings" className="block">
          <Button
            variant="outline"
            className="w-full h-full min-h-[100px] flex flex-col items-center justify-center gap-2 "
          >
            <PatternParadiseIcon className="h-8 w-8 fill-black" />
            <span className="text-lg font-semibold">My Tester Calls</span>
          </Button>
        </Link>
      </div>

      <h2 className="text-2xl font-bold mb-8">Your Patterns</h2>
      {isLoading ? <LoadingSpinnerComponent /> : null}
      {products.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {products.map((product) => {
              const isCreator = userId === product.creatorId;
              return (
                <Card key={product.id}>
                  {isCreator ? (
                    <CardHeader className="flex w-full">
                      <CardDescription
                        className={`text-sm font-semibold text-right ${getStatusColor(
                          product.status,
                        )}`}
                      >
                        {product.status}
                      </CardDescription>
                    </CardHeader>
                  ) : null}
                  <CardContent>
                    <ProductCard
                      key={product.id}
                      id={product.id}
                      name={product.title}
                      price={product.price}
                      isFree={product.isFree}
                      imageUrls={product.imageUrls}
                      creatorId={product.creatorId}
                      status={product.status}
                      unavailable={
                        product.status === 'Deleted' ||
                        product.status === 'Aborted' ||
                        product.status === 'Declined'
                      }
                      isProductView={true}
                    />
                  </CardContent>
                </Card>
              );
            })}
          </div>
          <div className="flex">
            {hasNextPage ? (
              <Button
                variant={'outline'}
                className={'w-full'}
                onClick={() => {
                  setLoadMore(true);
                }}
              >
                Load more
              </Button>
            ) : null}
          </div>
        </>
      ) : null}
      {products.length === 0 && !isLoading ? (
        <p>
          No patterns available.
          <Link href="/app/secure/sell/submit" className="text-blue-500 underline">
            Create a pattern here!
          </Link>
        </p>
      ) : null}
    </div>
  );
}
