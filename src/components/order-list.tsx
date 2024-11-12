'use client';

import { useEffect, useState } from 'react';
import { ChevronRightIcon, PackageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { GetOrderResponse } from '@/@types/api-types';
import { useRouter } from 'next/navigation';
import { useListOrders } from '@/lib/api/order';
import { combineArraysById } from '@/lib/core/utils';

export function OrderListComponent() {
  const [loadMore, setLoadMore] = useState(false);

  const { fetch, data: orders, count, hasNextPage } = useListOrders({});

  useEffect(() => {
    fetch(1, 20);
  }, []);

  useEffect(() => {
    if (!loadMore) {
      return;
    }
    fetch();
  }, [loadMore]);

  const router = useRouter();

  const getStatusColor = (status: GetOrderResponse['status']) => {
    switch (status) {
      case 'CREATED':
        return 'text-yellow-500';
      case 'CAPTURED':
        return 'text-green-500';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>
      {count === 0 ? <p>You have no orders. Start shopping patterns!</p> : null}
      <div className="space-y-4">
        {orders.map((order) => (
          <Card key={order.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{order.productName}</CardTitle>
              <CardDescription className={`text-sm font-semibold ${getStatusColor(order.status)}`}>
                {order.status}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div className="text-2xl font-bold">${order.productPrice.toFixed(2)}</div>
                <div className="text-sm text-muted-foreground">
                  {new Date(order.createdAt).toDateString()}
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  router.push(`/auth/me/orders/${order.id}`);
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
    </div>
  );
}
