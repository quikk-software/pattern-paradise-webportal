'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Instagram, ChevronUp, ChevronDown, Check } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  GetTesterApplicationResponse,
  GetTestingResponse,
  GetUserAccountResponse,
} from '@/@types/api-types';
import { Checkbox } from '@/components/ui/checkbox';
import { useDispatch, useSelector } from 'react-redux';
import { Store } from '@/lib/redux/store';
import {
  addSelectedApplicant,
  removeSelectedApplicant,
  resetSelectedApplicants,
} from '@/lib/features/testing/testingSlice';
import { InfoBoxComponent } from '@/components/info-box';
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { LoadingSpinnerComponent } from '@/components/loading-spinner';
import { useUpdateTesting } from '@/lib/api/testing';
import { useRouter } from 'next/navigation';
import RequestStatus from '@/lib/components/RequestStatus';
import TikTokIcon from '@/lib/icons/TikTokIcon';
import Link from 'next/link';

const MIN_TESTER_COUNT = 3;

type SortKey = 'name' | 'assignedAt' | 'updatedAt';

const useSortableData = (
  items: GetTesterApplicationResponse[],
  config = { key: 'assignedAt' as SortKey, direction: 'asc' as 'asc' | 'desc' },
) => {
  const [sortConfig, setSortConfig] = useState(config);

  const sortedItems = () => {
    let sortableItems = [...items];
    if (sortConfig.key) {
      sortableItems.sort((a, b) => {
        if (sortConfig.key === 'name') {
          const aName = `${a.user.firstName} ${a.user.lastName}`.trim();
          const bName = `${b.user.firstName} ${b.user.lastName}`.trim();
          if (aName < bName) return sortConfig.direction === 'asc' ? -1 : 1;
          if (aName > bName) return sortConfig.direction === 'asc' ? 1 : -1;
        } else {
          if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
          if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  };

  const requestSort = (key: SortKey, directionFn: (direction: 'asc' | 'desc') => void) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    directionFn(direction);
    setSortConfig({ key, direction });
  };

  return { items: sortedItems, requestSort, sortConfig };
};

export function TesterApplicantsPage({
  applications,
  directionFn,
  sortKeyFn,
  filterFn,
  filter,
  totalApplicantsCount,
  testing,
}: {
  applications: GetTesterApplicationResponse[];
  directionFn: (direction: 'asc' | 'desc') => void;
  sortKeyFn: (sortKey: 'updatedAt' | 'assignedAt') => void;
  filterFn: (filter: string[]) => void;
  filter: string[];
  totalApplicantsCount: number;
  testing?: GetTestingResponse;
}) {
  const { requestSort, sortConfig } = useSortableData(applications);
  const [showAddApplicantsDrawer, setShowAddApplicantsDrawer] = useState<boolean>(false);

  const router = useRouter();
  const dispatch = useDispatch();
  const { selectedApplicants: sa } = useSelector((s: Store) => s.testing);
  const selectedApplicants = Object.values(sa);

  const { mutate, isLoading, isSuccess, isError } = useUpdateTesting();

  useEffect(() => {
    dispatch(resetSelectedApplicants());
  }, [testing?.id]);

  const toggleApplicant = (user: GetUserAccountResponse) => {
    if (!!selectedApplicants.find((sa) => sa.id === user.id)) {
      dispatch(removeSelectedApplicant(user));
    } else {
      dispatch(addSelectedApplicant(user));
    }
  };

  const renderSortIcon = (columnName: SortKey) => {
    if (sortConfig.key === columnName) {
      return sortConfig.direction === 'asc' ? (
        <ChevronUp className="w-4 h-4" />
      ) : (
        <ChevronDown className="w-4 h-4" />
      );
    }
    return null;
  };

  const handleAddApplicantsClick = async (
    applicants: GetUserAccountResponse[],
    testingId?: string,
  ) => {
    if (!testingId) {
      return;
    }
    await mutate(testingId, {
      testerIds: applicants.map((user) => user.id),
    });

    router.push(`/app/secure/test/chats?testingId=${testingId}`);
  };

  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-4">
            <h1 className="text-2xl font-bold">Tester Applicants</h1>
            <Card>
              <CardHeader>
                <CardTitle className="text-md">Filter</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-2">
                <div className="flex flex-start space-x-4 mb-4">
                  <Button
                    variant="outline"
                    onClick={() => {
                      requestSort('updatedAt', directionFn);
                      sortKeyFn('updatedAt');
                    }}
                  >
                    Recently updated {renderSortIcon('updatedAt')}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      requestSort('assignedAt', directionFn);
                      sortKeyFn('assignedAt');
                    }}
                  >
                    Recently applied {renderSortIcon('assignedAt')}
                  </Button>
                </div>
                <div className="flex gap-2 items-center">
                  <Checkbox
                    id={'user.instagramRef'}
                    checked={!!filter.find((f) => f === 'user.instagramRef')}
                    onCheckedChange={() =>
                      !!filter.find((f) => f === 'user.instagramRef')
                        ? filterFn(filter.filter((f) => f !== 'user.instagramRef'))
                        : filterFn([...filter, 'user.instagramRef'])
                    }
                  />
                  <label
                    htmlFor={'user.instagramRef'}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Instagram available
                  </label>
                </div>
                <div className="flex gap-2 items-center">
                  <Checkbox
                    id={'user.tiktokRef'}
                    checked={!!filter.find((f) => f === 'user.tiktokRef')}
                    onCheckedChange={() =>
                      !!filter.find((f) => f === 'user.tiktokRef')
                        ? filterFn(filter.filter((f) => f !== 'user.tiktokRef'))
                        : filterFn([...filter, 'user.tiktokRef'])
                    }
                  />
                  <label
                    htmlFor={'user.tiktokRef'}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    TikTok available
                  </label>
                </div>
              </CardContent>
            </Card>
          </div>
          {totalApplicantsCount < MIN_TESTER_COUNT ? (
            <InfoBoxComponent
              severity="warning"
              message={`There are currently not enough applications for your tester call. Testers available: ${totalApplicantsCount} / Testers needed: ${MIN_TESTER_COUNT}.`}
            />
          ) : null}
          {totalApplicantsCount >= MIN_TESTER_COUNT ? (
            <InfoBoxComponent message="Select at least 3 of your preferred testers by clicking on the user's card." />
          ) : null}
          <div className="w-full sticky top-4 z-50">
            <Button
              className="w-full"
              disabled={selectedApplicants.length < MIN_TESTER_COUNT}
              onClick={() => {
                setShowAddApplicantsDrawer(true);
              }}
            >
              Complete selection
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {applications.map((application) => (
              <Card
                key={application.user.id}
                className={`relative cursor-pointer transition-all ${
                  !!selectedApplicants.find((sa) => sa.id === application.user.id)
                    ? 'ring-2 ring-green-500'
                    : ''
                }`}
                onClick={() => toggleApplicant(application.user)}
              >
                {!!selectedApplicants.find((sa) => sa.id === application.user.id) && (
                  <div className="absolute top-2 right-2 bg-green-500 rounded-full p-1">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                )}
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <Link href={`/users/${application.user.id}`} passHref>
                      <Avatar className="w-12 h-12">
                        <AvatarImage
                          src={application.user.imageUrl}
                          alt={`${application.user.firstName} ${application.user.lastName}`}
                        />
                        <AvatarFallback>
                          {application.user.firstName?.[0]}
                          {application.user.lastName?.[0]}
                        </AvatarFallback>
                      </Avatar>
                    </Link>
                    <div>
                      <Link href={`/users/${application.user.id}`}>
                        <h2 className="text-lg font-semibold underline text-blue-500">
                          {application.user.firstName} {application.user.lastName}
                        </h2>
                      </Link>
                      <p className="text-sm text-muted-foreground">@{application.user.username}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex space-x-2 mb-2">
                    {application.user.instagramRef && (
                      <a
                        href={`https://instagram.com/${application.user.instagramRef}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Badge variant="secondary">
                          <Instagram className="w-4 h-4 mr-1" />
                          Instagram
                        </Badge>
                      </a>
                    )}
                    {application.user.tiktokRef && (
                      <a
                        href={`https://tiktok.com/@${application.user.tiktokRef}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Badge variant="secondary">
                          <TikTokIcon className="w-4 h-4 mr-1" />
                          TikTok
                        </Badge>
                      </a>
                    )}
                  </div>
                  <p className="text-sm">
                    Applied on: {new Date(application.assignedAt).toLocaleDateString()}
                  </p>
                  <p className="text-sm">
                    Last Updated: {new Date(application.updatedAt).toLocaleDateString()}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
      <Drawer open={showAddApplicantsDrawer} onOpenChange={setShowAddApplicantsDrawer}>
        <DrawerContent
          className="p-4 flex flex-col gap-8"
          aria-describedby="Tester selection confirmation"
        >
          <div className="mx-auto w-full max-w-sm flex flex-col gap-4">
            <DrawerHeader>
              <DrawerTitle>Start testing process</DrawerTitle>
              <DrawerTitle className="text-sm font-medium">
                You are about to start the testing process for your pattern &apos;
                {testing?.product.title}&apos;. Are you ready to go with the following testers?
              </DrawerTitle>
            </DrawerHeader>
          </div>
          <div className="flex flex-col gap-4 max-h-48 overflow-y-auto">
            {selectedApplicants.map((applicant) => (
              <div className="flex items-center space-x-4" key={applicant.id}>
                <Avatar className="w-12 h-12">
                  <AvatarImage
                    src={applicant.imageUrl}
                    alt={`${applicant.firstName} ${applicant.lastName}`}
                  />
                  <AvatarFallback>
                    {applicant.firstName?.[0]}
                    {applicant.lastName?.[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-lg font-semibold">
                    {applicant.firstName} {applicant.lastName}
                  </h2>
                  <p className="text-sm text-muted-foreground">@{applicant.username}</p>
                </div>
              </div>
            ))}
          </div>
          <DrawerFooter>
            <InfoBoxComponent message="You will automatically be redirected to the group chat with your testers after starting the testing process." />
            <Button
              onClick={() => {
                setShowAddApplicantsDrawer(false);
              }}
              variant={'outline'}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                handleAddApplicantsClick(selectedApplicants, testing?.id);
              }}
              variant={'default'}
            >
              {isLoading ? <LoadingSpinnerComponent size="sm" /> : null}
              Start testing process
            </Button>
            <RequestStatus isSuccess={isSuccess} isError={isError} />
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
}
