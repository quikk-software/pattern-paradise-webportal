'use client';

import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Rocket, PlusCircle, ShoppingBag, TestTube, SlidersHorizontal } from 'lucide-react';
import ProductCard from '@/lib/components/ProductCard';
import { useListTestingsByUserId, useUpdateTesting } from '@/lib/api/testing';
import { GetTestingResponse } from '@/@types/api-types';
import Link from 'next/link';
import { LoadingSpinnerComponent } from '@/components/loading-spinner';
import { useRouter } from 'next/navigation';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { themes } from '@/lib/core/themes';
import ColorPalette from '@/lib/components/ColorPalette';

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
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [refetch, setRefetch] = useState(true);
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null);
  const [selectedTesting, setSelectedTesting] = useState<GetTestingResponse | null>(null);

  const { fetch: fetchTestings, data: testings, reset } = useListTestingsByUserId({});
  const { mutate: mutateTesting, isLoading: mutateTestingIsLoading } = useUpdateTesting();

  useEffect(() => {
    if (!refetch) {
      return;
    }
    fetchTestings();
    setRefetch(false);
  }, [refetch]);

  const handleTesterCallDrawerClick = (testing: GetTestingResponse) => {
    setSelectedTheme(null);
    setIsDrawerOpen(true);
    setSelectedTesting(testing);
  };

  const handleCancelTestingClick = async () => {};

  const handleUpdateTestingClick = async (
    testing: GetTestingResponse | null,
    theme: string | null,
  ) => {
    if (!testing) {
      return;
    }

    await mutateTesting(testing.id, {
      testerIds: [],
      theme: theme ?? undefined,
    });
    reset();
    setIsDrawerOpen(false);
    setSelectedTheme(null);
    setRefetch(true);
  };

  const handleColorSelect = (theme: string) => {
    setSelectedTheme(theme === selectedTheme ? null : theme);
  };

  const handleKeyDown = (event: React.KeyboardEvent, color: string) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleColorSelect(color);
    }
  };

  return (
    <>
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
                      console.log(testing.id, 'OOOF');
                      handleTesterCallDrawerClick(testing);
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
                  <div className="flex flex-col gap-2 w-full">
                    <Button
                      onClick={() => {
                        handleTesterCallDrawerClick(testing);
                      }}
                    >
                      Update tester call
                    </Button>
                    <Link
                      href={`/test/products/${testing.product.id}`}
                      style={{
                        width: '100%',
                      }}
                    >
                      <Button variant="outline" className="w-full">
                        Go to tester call page
                      </Button>
                    </Link>
                    <Link
                      href={`/test/chats/${testing.id}`}
                      style={{
                        width: '100%',
                      }}
                    >
                      <Button variant="outline" className="w-full">
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
      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <DrawerContent className="p-4">
          <div className="mx-auto w-full max-w-sm flex flex-col gap-4">
            <DrawerHeader>
              <DrawerTitle>Select a theme (optional)</DrawerTitle>
              <DrawerTitle className="text-sm font-medium">
                This will be used for your Tester Call Page.
              </DrawerTitle>
            </DrawerHeader>
            <div className="flex flex-col gap-2 items-center mb-4">
              <h3>Current theme:</h3>
              <ColorPalette
                theme={
                  selectedTheme
                    ? selectedTheme
                    : selectedTesting?.theme
                      ? selectedTesting?.theme
                      : 'neutral'
                }
                selectedTheme={null}
              />
            </div>
            <div className="grid grid-cols-4 gap-2">
              {themes.map((theme) => (
                <ColorPalette
                  key={theme}
                  theme={theme}
                  selectedTheme={selectedTheme}
                  handleColorSelect={handleColorSelect}
                  handleKeyDown={handleKeyDown}
                />
              ))}
            </div>
            <Button
              onClick={() => {
                handleUpdateTestingClick(selectedTesting, selectedTheme);
              }}
            >
              Start tester call!
            </Button>
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
}
