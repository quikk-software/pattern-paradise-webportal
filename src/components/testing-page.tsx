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
  const [isAbortTestingDrawerOpen, setIsAbortTestingDrawerOpen] = useState(false);
  const [refetch, setRefetch] = useState(true);
  const [loadMore, setLoadMore] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null);
  const [selectedDurationInWeeks, setSelectedDurationInWeeks] = useState<string | undefined>(
    undefined,
  );
  const [selectedExperienceLevel, setSelectedExperienceLevel] = useState<string | undefined>(
    undefined,
  );
  const [selectedTesting, setSelectedTesting] = useState<GetTestingResponse | null>(null);

  const { userId } = useSelector((store: Store) => store.auth);

  const {
    fetch: fetchTestings,
    data: testings,
    hasNextPage,
    reset,
  } = useListTestingsByUserId({ filter });
  const { mutate: mutateTesting, isLoading: mutateTestingIsLoading } = useUpdateTesting();
  const { fetch: fetchAbortTesting, isLoading: fetchAbortTestingIsLoading } = useAbortTesting();

  useEffect(() => {
    if (!refetch) {
      return;
    }
    fetchTestings();
    setRefetch(false);
  }, [refetch]);

  useEffect(() => {
    if (!loadMore) {
      return;
    }
    fetchTestings();
    setLoadMore((p) => !p);
  }, [loadMore]);

  const handleTesterCallDrawerClick = (testing: GetTestingResponse) => {
    setSelectedTheme(null);
    setSelectedDurationInWeeks(undefined);
    setIsUpdateTestingDrawerOpen(true);
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
    experience: string | undefined,
  ) => {
    if (!testing) {
      return;
    }

    await mutateTesting(testing.id, {
      testerIds: [],
      theme: theme ?? undefined,
      durationInWeeks: !!durationInWeeks ? Number(durationInWeeks) : undefined,
      experience,
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

  const handleDurationInWeeksSelect = () => {
    setSelectedDurationInWeeks(undefined);
  };

  const handleKeyDown = (event: React.KeyboardEvent, color: string) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleColorSelect(color);
    }
  };

  return (
    <>
      <div className="p-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold">Your Testings</h1>
        </header>

        {testings.length === 0 ? (
          <p>
            You have no testings yet.{' '}
            {filter === 'customer' ? (
              <Link href="/app/test" className="text-blue-500 underline">
                Explore open Tester Calls here
              </Link>
            ) : (
              <Link href="/app/sell/submit" className="text-blue-500 underline">
                Create a pattern and start a Tester Call here!
              </Link>
            )}
          </p>
        ) : null}

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
                  <div className="flex justify-between items-center">
                    <ProductCard
                      id={testing.product.id}
                      name={testing.product.title}
                      price={testing.product.price}
                      isFree={testing.product.isFree}
                      image={testing.product.imageUrls?.[0]}
                      isTesterCall={true}
                      creatorId={testing.creatorId}
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <div className="flex flex-col gap-2 w-full">
                    {isOwner && testing.status === 'Created' ? (
                      <Link
                        href={`/app/sell/testings/${testing.id}`}
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
                        href={`/app/test/chats?testingId=${testing.id}`}
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
          <div className="mx-auto w-full max-w-sm flex flex-col gap-4 overflow-y-auto max-h-[60vh]">
            <DrawerHeader>
              <DrawerTitle>Testing duration</DrawerTitle>
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
                <SelectTrigger className="w-full">
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
              <DrawerTitle>Tester experience level</DrawerTitle>
              <DrawerTitle className="text-sm font-medium">
                What experience level do your testers need to complete your pattern?
              </DrawerTitle>
            </DrawerHeader>
            <div className="flex flex-col gap-2 items-center mb-4">
              <span className="text-center">
                The experience level is currently set to{' '}
                <strong>{selectedTesting?.experience ?? 'Intermediate'}</strong>
              </span>
              <Select value={selectedExperienceLevel} onValueChange={setSelectedExperienceLevel}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a duration" />
                </SelectTrigger>
                <SelectContent>
                  {['Beginner', 'Intermediate', 'Professional'].map((experience) => (
                    <SelectItem key={experience} value={experience}>
                      {experience}
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
                handleUpdateTestingClick(
                  selectedTesting,
                  selectedTheme,
                  selectedDurationInWeeks,
                  selectedExperienceLevel,
                );
              }}
              disabled={mutateTestingIsLoading}
            >
              {mutateTestingIsLoading ? <LoadingSpinnerComponent size="sm" /> : null}
              Update tester call theme
            </Button>
          </div>
        </DrawerContent>
      </Drawer>
      <Drawer open={isAbortTestingDrawerOpen} onOpenChange={setIsAbortTestingDrawerOpen}>
        <DrawerContent className="p-4">
          <div className="mx-auto w-full max-w-sm flex flex-col gap-4">
            <DrawerHeader>
              <DrawerTitle>Are you sure?</DrawerTitle>
              <DrawerTitle className="text-sm font-medium">
                If you abort this testing, you&apos;ll have to re-create the product in order to
                start the testing process again.
              </DrawerTitle>
            </DrawerHeader>
            <Button
              onClick={() => {
                setIsAbortTestingDrawerOpen(false);
              }}
              variant={'outline'}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                handleAbortTestingClick(selectedTesting);
              }}
              variant={'destructive'}
              disabled={fetchAbortTestingIsLoading}
            >
              {fetchAbortTestingIsLoading ? <LoadingSpinnerComponent size="sm" /> : null}
              Abort testing
            </Button>
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
}
