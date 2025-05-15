'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import ProductCard from '@/lib/components/ProductCard';
import { useAbortTesting, useListTestingsByUserId, useUpdateTesting } from '@/lib/api/testing';
import { GetTestingResponse } from '@/@types/api-types';
import Link from 'next/link';
import { LoadingSpinnerComponent } from '@/components/loading-spinner';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { themes } from '@/lib/core/themes';
import ColorPalette from '@/lib/components/ColorPalette';
import { useSelector } from 'react-redux';
import { Store } from '@/lib/redux/store';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import ConfirmDrawer from '@/lib/components/ConfirmDrawer';
import ManageTesterDrawers from '@/lib/components/ManageTestersDrawer';

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

interface TestingPageComponentProps {
  filter?: 'customer' | 'seller';
}

export function TestingPageComponent({ filter }: TestingPageComponentProps) {
  const [isUpdateTestingDrawerOpen, setIsUpdateTestingDrawerOpen] = useState(false);
  const [isManageTestersDrawerOpen, setIsManageTestersDrawerOpen] = useState(false);
  const [isAbortTestingDrawerOpen, setIsAbortTestingDrawerOpen] = useState(false);
  const [refetch, setRefetch] = useState(true);
  const [loadMore, setLoadMore] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null);
  const [selectedDurationInWeeks, setSelectedDurationInWeeks] = useState<string | undefined>(
    undefined,
  );
  const [selectedTesting, setSelectedTesting] = useState<GetTestingResponse | null>(null);

  const { userId } = useSelector((store: Store) => store.auth);

  const {
    fetch: fetchTestings,
    data: testings,
    hasNextPage,
    reset,
    isLoading: fetchTestingsIsLoading,
  } = useListTestingsByUserId({ filter });
  const { mutate: mutateTesting, isLoading: mutateTestingIsLoading } = useUpdateTesting();
  const { fetch: fetchAbortTesting, isLoading: fetchAbortTestingIsLoading } = useAbortTesting();

  useEffect(() => {
    if (!refetch || !userId) {
      return;
    }
    fetchTestings(userId, 'newest');
    setRefetch(false);
  }, [refetch, userId]);

  useEffect(() => {
    if (!loadMore || !userId) {
      return;
    }
    fetchTestings(userId, 'newest');
    setLoadMore((p) => !p);
  }, [loadMore, userId]);

  const handleTesterCallDrawerClick = (testing: GetTestingResponse) => {
    setSelectedTheme(null);
    setSelectedDurationInWeeks(undefined);
    setIsUpdateTestingDrawerOpen(true);
    setSelectedTesting(testing);
  };

  const handleManageTestersDrawerClick = (testing: GetTestingResponse) => {
    setIsManageTestersDrawerOpen(true);
    setSelectedTesting(testing);
  };

  const handleAbortTestingDrawerClick = (testing: GetTestingResponse) => {
    setSelectedTheme(null);
    setSelectedDurationInWeeks(undefined);
    setIsAbortTestingDrawerOpen(true);
    setSelectedTesting(testing);
  };

  const handleAbortTestingClick = async (testing: GetTestingResponse | null) => {
    if (!testing) {
      return;
    }

    await fetchAbortTesting(testing.id);

    reset();
    setIsAbortTestingDrawerOpen(false);
    setRefetch(true);
  };

  const handleUpdateTestingClick = async (
    testing: GetTestingResponse | null,
    theme: string | null,
    durationInWeeks: string | undefined,
  ) => {
    if (!testing) {
      return;
    }

    await mutateTesting(testing.id, {
      theme: theme ?? undefined,
      durationInWeeks: !!durationInWeeks ? Number(durationInWeeks) : undefined,
    });
    reset();
    setIsUpdateTestingDrawerOpen(false);
    setSelectedTheme(null);
    setSelectedDurationInWeeks(undefined);
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

  const isCustomer = filter === 'customer';

  return (
    <>
      <div>
        <header className="mb-8">
          <h1 className="text-3xl font-bold">{isCustomer ? 'My Testings' : 'My Tester Calls'}</h1>
        </header>

        {fetchTestingsIsLoading ? <LoadingSpinnerComponent /> : null}
        {testings.length === 0 && !fetchTestingsIsLoading ? (
          <p>
            You have no testings yet.{' '}
            {isCustomer ? (
              <Link rel={'nofollow'} href="/app/tester-calls" className="text-blue-500 underline">
                Explore open Tester Calls here
              </Link>
            ) : (
              <Link
                rel={'nofollow'}
                href="/app/secure/sell/submit"
                className="text-blue-500 underline"
              >
                Create a pattern and start a Tester Call here!
              </Link>
            )}
          </p>
        ) : null}

        {testings.length > 0 ? (
          <div className="grid xs:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {testings.map((testing) => {
              const isOwner = userId === testing.creatorId;
              return (
                <Card key={testing.product.id}>
                  <CardHeader className="flex flex-row items-center justify-end space-y-0 pb-2">
                    <CardDescription
                      className={`text-sm font-semibold ${getStatusColor(testing.status)}`}
                    >
                      {testing.status}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col gap-2">
                      <ProductCard
                        id={testing.product.id}
                        name={testing.product.title}
                        price={testing.product.price}
                        isFree={testing.product.isFree}
                        imageUrls={testing.product.imageUrls}
                        isTesterCall={true}
                        creatorId={testing.creatorId}
                        category={testing.product.category}
                        subCategories={testing.product.subCategories}
                        salePrice={testing.product.salePrice}
                        salePriceDueDate={testing.product.salePriceDueDate}
                      />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <div className="flex flex-col gap-2 w-full">
                      {isOwner && testing.status === 'Created' ? (
                        <Link
                          rel={'nofollow'}
                          href={`/app/secure/sell/testings/${testing.id}`}
                          style={{
                            width: '100%',
                          }}
                        >
                          <Button variant="default" className="w-full">
                            View tester applications
                          </Button>
                        </Link>
                      ) : null}
                      {testing.status === 'InProgress' ? (
                        <Link
                          rel={'nofollow'}
                          href={`/app/secure/test/chats?testingId=${testing.id}`}
                          style={{
                            width: '100%',
                          }}
                        >
                          <Button variant="default" className="w-full">
                            View chat with testers
                          </Button>
                        </Link>
                      ) : null}
                      {isOwner && testing.status === 'Created' ? (
                        <Button
                          onClick={() => {
                            handleTesterCallDrawerClick(testing);
                          }}
                          variant="outline"
                        >
                          Update testing
                        </Button>
                      ) : null}
                      {isOwner &&
                      testing.status === 'InProgress' &&
                      testing?.testers &&
                      testing.testers?.length > 0 ? (
                        <Button
                          onClick={() => {
                            handleManageTestersDrawerClick(testing);
                          }}
                          variant="outline"
                        >
                          Manage testers
                        </Button>
                      ) : null}
                      {isOwner &&
                      (testing.status === 'Created' || testing.status === 'InProgress') ? (
                        <Button
                          variant="destructive"
                          className="w-full"
                          onClick={() => {
                            handleAbortTestingDrawerClick(testing);
                          }}
                        >
                          Abort tester call
                        </Button>
                      ) : null}
                    </div>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        ) : null}
        {hasNextPage ? (
          <Button
            variant="outline"
            className="w-full"
            onClick={() => {
              setLoadMore(true);
            }}
          >
            Load more
          </Button>
        ) : null}
      </div>
      <Drawer open={isUpdateTestingDrawerOpen} onOpenChange={setIsUpdateTestingDrawerOpen}>
        <DrawerContent className="p-4">
          <div className="flex flex-col gap-4 overflow-y-auto max-h-[60vh]">
            <DrawerHeader>
              <DrawerTitle>Testing Duration</DrawerTitle>
              <DrawerTitle className="text-sm font-medium">
                How much time do you want to give your testers to complete your pattern?
              </DrawerTitle>
            </DrawerHeader>
            <div className="flex flex-col gap-2 items-center mb-4">
              <span className="text-center">
                Your testing is currently set to{' '}
                <strong>
                  {String(selectedTesting?.durationInWeeks ?? 2)} week
                  {selectedTesting?.durationInWeeks === 1 ? '' : 's'}
                </strong>
              </span>
              <Select value={selectedDurationInWeeks} onValueChange={setSelectedDurationInWeeks}>
                <SelectTrigger className="w-full" aria-label={'Select a duration'}>
                  <SelectValue placeholder="Select a duration" />
                </SelectTrigger>
                <SelectContent>
                  {['1', '2', '3', '4', '5', '6'].map((weeks) => (
                    <SelectItem key={weeks} value={weeks}>
                      {weeks} week{weeks === '1' ? '' : 's'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
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
                handleUpdateTestingClick(selectedTesting, selectedTheme, selectedDurationInWeeks);
              }}
              disabled={mutateTestingIsLoading}
            >
              {mutateTestingIsLoading ? <LoadingSpinnerComponent size="sm" /> : null}
              Update tester call theme
            </Button>
          </div>
        </DrawerContent>
      </Drawer>
      <ConfirmDrawer
        isOpen={isAbortTestingDrawerOpen}
        setIsOpen={setIsAbortTestingDrawerOpen}
        callbackFn={() => handleAbortTestingClick(selectedTesting)}
        isLoading={fetchAbortTestingIsLoading}
        description="If you abort this testing, you'll have to re-create the product in order to  start the testing process again."
      />
      <ManageTesterDrawers
        isOpen={isManageTestersDrawerOpen}
        setIsOpen={setIsManageTestersDrawerOpen}
        testing={selectedTesting}
      />
    </>
  );
}
