'use client';

import React, { useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Rocket, PlusCircle, ShoppingBag, TestTube } from 'lucide-react';
import ProductCard from '@/lib/components/ProductCard';
import { useListTestingsByUserId, useUpdateTesting } from '@/lib/api/testing';
import { GetTestingResponse } from '@/@types/api-types';
import Link from 'next/link';
import { LoadingSpinnerComponent } from '@/components/loading-spinner';
import { useRouter } from 'next/navigation';

const getStatusColor = (status: GetTestingResponse['status']) => {
  switch (status) {
    case 'Created':
      return 'text-yellow-500';
    case 'InProgress':
      return 'text-blue-500';
    case 'Approved':
      return 'text-green-500';
    case 'Declined':
      return 'text-red-500';
    default:
      return 'text-gray-500';
  }
};

export function TestingPageComponent() {
  const router = useRouter();

  const { fetch: fetchTestings, data: testings } = useListTestingsByUserId({});
  const { mutate: mutateTesting, isLoading: mutateTestingIsLoading } = useUpdateTesting();

  useEffect(() => {
    fetchTestings();
  }, []);

  const handleCancelTestingClick = async () => {};

  const handleUpdateTestingClick = async (testingId: string) => {
    await mutateTesting(testingId, {
      testerIds: [],
    });
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Your Testings</h1>
      </header>

      <div className="grid gap-6 mb-8">
        {testings.map((testing) => (
          <Card key={testing.product.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{testing.product.title}</CardTitle>
              <CardDescription
                className={`text-sm font-semibold ${getStatusColor(testing.status)}`}
              >
                {testing.status}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <ProductCard
                  id={testing.product.id}
                  name={testing.product.title}
                  price={testing.product.price}
                  image={testing.product.imageUrls?.[0]}
                />
              </div>
            </CardContent>
            <CardFooter>
              {testing.status === 'Created' ? (
                <Button
                  className="w-full"
                  onClick={() => {
                    handleUpdateTestingClick(testing.id);
                  }}
                  disabled={mutateTestingIsLoading}
                >
                  {mutateTestingIsLoading ? (
                    <LoadingSpinnerComponent size="sm" className="text-white" />
                  ) : (
                    <Rocket />
                  )}
                  Start tester call
                </Button>
              ) : null}
              {testing.status === 'InProgress' ? (
                <div className="flex flex-col gap-2">
                  <Link
                    href={`/test/chats/products/${testing.product.id}`}
                    style={{
                      width: '100%',
                    }}
                  >
                    <Button variant="destructive" className="w-full">
                      View chat with testers
                    </Button>
                  </Link>
                  <Button
                    variant="destructive"
                    className="w-full"
                    onClick={() => {
                      handleCancelTestingClick();
                    }}
                  >
                    Abort tester call
                  </Button>
                </div>
              ) : null}
            </CardFooter>
          </Card>
        ))}
      </div>

      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Explore Open Testings</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Patterns</CardTitle>
            <PlusCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">25</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Orders</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Testings</CardTitle>
            <TestTube className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
