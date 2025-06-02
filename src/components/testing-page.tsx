'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
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
import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
  CheckCircle,
  Clock,
  Eye,
  MessageSquare,
  MoreVertical,
  Play,
  Settings,
  Star,
  Trash2,
  Users,
  XCircle,
} from 'lucide-react';

const getStatusConfig = (status: GetTestingResponse['status']) => {
  switch (status) {
    case 'Created':
      return {
        color: 'bg-amber-100 text-amber-800 border-amber-200',
        icon: Clock,
        label: 'Pending',
      };
    case 'InProgress':
      return {
        color: 'bg-blue-100 text-blue-800 border-blue-200',
        icon: Play,
        label: 'In Progress',
      };
    case 'Approved':
      return {
        color: 'bg-green-100 text-green-800 border-green-200',
        icon: CheckCircle,
        label: 'Approved',
      };
    case 'Declined':
      return {
        color: 'bg-red-100 text-red-800 border-red-200',
        icon: XCircle,
        label: 'Declined',
      };
    default:
      return {
        color: 'bg-gray-100 text-gray-800 border-gray-200',
        icon: Clock,
        label: 'Unknown',
      };
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

  const router = useRouter();

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
    fetchTestings(userId, 'newest', ['Created', 'InProgress', 'Approved', 'Declined']);
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
              <Link
                rel={'nofollow'}
                href="/%5Blang%5D/app/tester-calls"
                className="text-blue-500 underline"
              >
                Explore open Tester Calls here
              </Link>
            ) : (
              <Link
                rel={'nofollow'}
                href="/%5Blang%5D/app/secure/sell/submit"
                className="text-blue-500 underline"
              >
                Create a pattern and start a Tester Call here!
              </Link>
            )}
          </p>
        ) : null}

        {testings.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {testings.map((testing) => {
              const isOwner = userId === testing.creatorId;
              const statusConfig = getStatusConfig(testing.status);
              const StatusIcon = statusConfig.icon;

              return (
                <Card
                  key={testing.product.id}
                  className="group border-0 shadow-md hover:shadow-xl transition-all duration-300 bg-white overflow-hidden"
                >
                  {/* Status Header */}
                  <div className="bg-gradient-to-r from-slate-50 to-white p-4 border-b border-slate-100">
                    <div className="flex items-center justify-between">
                      <Badge className={cn('gap-1.5 font-medium', statusConfig.color)}>
                        <StatusIcon className="w-3.5 h-3.5" />
                        {statusConfig.label}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <CardContent className="p-6">
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

                    {/* Testing Info */}
                    <div className="mt-4 p-3 bg-slate-50 rounded-lg">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-600">Duration:</span>
                        <span className="font-medium text-slate-900">
                          {testing.durationInWeeks} week{testing.durationInWeeks !== 1 ? 's' : ''}
                        </span>
                      </div>
                      {testing.testers && testing.testers.length > 0 && (
                        <div className="flex items-center justify-between text-sm mt-2">
                          <span className="text-slate-600">Testers:</span>
                          <span className="font-medium text-slate-900">
                            {testing.testers.length}
                          </span>
                        </div>
                      )}
                    </div>
                  </CardContent>

                  <CardFooter className="p-6 pt-0">
                    <div className="flex flex-col gap-3 w-full">
                      {/* Primary Actions */}
                      {isOwner && testing.status === 'Created' && (
                        <Link
                          href={`/%5Blocale%5D/app/secure/sell/testings/${testing.id}`}
                          className="w-full"
                        >
                          <Button className="w-full gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
                            <Eye className="w-4 h-4" />
                            View Applications
                          </Button>
                        </Link>
                      )}

                      {testing.status === 'InProgress' && (
                        <Link
                          href={`/%5Blocale%5D/app/secure/test/chats?testingId=${testing.id}`}
                          className="w-full"
                        >
                          <Button className="w-full gap-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800">
                            <MessageSquare className="w-4 h-4" />
                            Chat with Testers
                          </Button>
                        </Link>
                      )}

                      {isOwner && testing.status === 'Approved' && (
                        <Button
                          className="w-full gap-2 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800"
                          onClick={() =>
                            router.push(`/app/secure/sell/testings/${testing.id}/rate-testers`)
                          }
                        >
                          <Star className="w-4 h-4" />
                          Rate Testers
                        </Button>
                      )}

                      {/* Secondary Actions */}
                      <div className="flex gap-2">
                        {isOwner && testing.status === 'Created' && (
                          <Button
                            onClick={() => handleTesterCallDrawerClick(testing)}
                            variant="outline"
                            className="flex-1 gap-2"
                          >
                            <Settings className="w-4 h-4" />
                            Update
                          </Button>
                        )}

                        {isOwner &&
                          testing.status === 'InProgress' &&
                          testing?.testers &&
                          testing.testers?.length > 0 && (
                            <Button
                              onClick={() => handleManageTestersDrawerClick(testing)}
                              variant="outline"
                              className="flex-1 gap-2"
                            >
                              <Users className="w-4 h-4" />
                              Manage
                            </Button>
                          )}

                        {isOwner &&
                          (testing.status === 'Created' || testing.status === 'InProgress') && (
                            <Button
                              variant="outline"
                              className="flex-1 gap-2 text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
                              onClick={() => handleAbortTestingDrawerClick(testing)}
                            >
                              <Trash2 className="w-4 h-4" />
                              Abort
                            </Button>
                          )}
                      </div>
                    </div>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        )}
        {hasNextPage ? (
          <Button
            variant="outline"
            className="w-full"
            onClick={() => {
              setLoadMore(true);
            }}
          >
            Load More
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
