'use client';

import React, { useEffect, useState } from 'react';
import { Blocks, ChevronRightIcon, TableIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { GetOrderResponse } from '@/@types/api-types';
import { useRouter } from 'next/navigation';
import { useListOrders } from '@/lib/api/order';
import Link from 'next/link';
import { LoadingSpinnerComponent } from '@/components/loading-spinner';
import OrderTable from '@/components/order-table';
import UserDetailsCardWrapper from '@/lib/wrappers/UserDetailsCardWrapper';

interface OrderListComponentProps {
  filter?: 'customer' | 'seller';
}

export function OrderListComponent({ filter }: OrderListComponentProps) {
  const [loadMore, setLoadMore] = useState(false);
  const [showCards, setShowCards] = useState(false);

  const {
    fetch,
    data: orders,
    hasNextPage,
    isLoading,
  } = useListOrders({
    filter,
  });

  useEffect(() => {
    fetch(1, 20);
  }, []);

  useEffect(() => {
    if (!loadMore) {
      return;
    }
    fetch();
    setLoadMore((p) => !p);
  }, [loadMore]);

  const router = useRouter();

  const getStatusColor = (status: GetOrderResponse['status']) => {
    switch (status) {
      case 'CREATED':
        return 'text-yellow-500';
      case 'APPROVED':
        return 'text-yellow-500';
      case 'CAPTURED':
        return 'text-green-500';
      case 'COMPLETED':
        return 'text-green-500';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center gap-2 mb-6">
        <h1 className="text-2xl font-bold">My Orders</h1>
        <Button
          variant={'outline'}
          onClick={() => setShowCards((showCards) => !showCards)}
          size="sm"
        >
          {showCards ? (
            <div className="flex items-center gap-1">
              <TableIcon /> Switch to table
            </div>
          ) : (
            <div className="flex items-center gap-1">
              <Blocks /> Switch to cards
            </div>
          )}
        </Button>
      </div>
      {isLoading ? <LoadingSpinnerComponent /> : null}
      {orders.length === 0 && !isLoading ? (
        <p>
          You have no orders.{' '}
          {filter === 'customer' ? (
            <Link href="/" className="text-blue-500 underline">
              Start shopping patterns!
            </Link>
          ) : (
            <Link
              rel={'nofollow'}
              href="/%5Blang%5D/app/secure/sell/submit"
              className="text-blue-500 underline"
            >
              Create a pattern here!
            </Link>
          )}
        </p>
      ) : null}
      {orders.length > 0 ? (
        <div>
          {showCards ? (
            <div className={'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'}>
              {orders.map((order) => (
                <Card key={order.id}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{order.productName}</CardTitle>
                    <CardDescription
                      className={`text-sm font-semibold ${getStatusColor(order.status)}`}
                    >
                      {order.status}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-8">
                    <div className="flex justify-between items-center">
                      <div className="text-2xl font-bold">${order.productPrice.toFixed(2)}</div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(order.createdAt).toDateString()}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h5 className="font-semibold">
                        {filter === 'customer' ? 'Sold by' : 'Bought by'}
                      </h5>
                      <UserDetailsCardWrapper
                        user={filter === 'customer' ? order.seller : order.customer}
                        showFlag={false}
                        showRoles={false}
                      />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => {
                        router.push(`/app/secure/auth/me/orders/${order.id}`);
                      }}
                    >
                      View Details
                      <ChevronRightIcon className="ml-2 h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
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
          ) : (
            <OrderTable filter={filter} />
          )}
        </div>
      ) : null}
    </div>
  );
}
