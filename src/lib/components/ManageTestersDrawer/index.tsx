import React, { useState } from 'react';
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { GetTestingResponse } from '@/@types/api-types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { LoadingSpinnerComponent } from '@/components/loading-spinner';
import { Trash2 } from 'lucide-react';
import { useRemoveUsersFromTesting } from '@/lib/api/testing';
import RequestStatus from '@/lib/components/RequestStatus';
import { useSelector } from 'react-redux';
import { Store } from '@/lib/redux/store';
import FollowUserButton from '@/lib/components/FollowUserButton';

interface ManageTestersDrawerProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  testing: GetTestingResponse | null;
}

export default function ManageTesterDrawers({
  isOpen,
  setIsOpen,
  testing,
}: ManageTestersDrawerProps) {
  const [selectedTesterIds, setSelectedTesterIds] = useState<string[]>([]);

  const { mutate, isLoading, isSuccess, isError, errorDetail } = useRemoveUsersFromTesting();

  const { userId } = useSelector((s: Store) => s.auth);

  if (!testing?.testers || testing.testers.length === 0) {
    return null;
  }

  const handleRemoveTestersFromTestingClick = (testingId: string, testerIds: string[]) => {
    mutate(testingId, testerIds).then(() => {
      setIsOpen(false);
      if (typeof window !== 'undefined') {
        window.location.reload();
      }
    });
  };

  const handleTesterRemovableListClick = (testerId: string) => {
    const selectedTesterIdsCopy = [...selectedTesterIds];
    const index = selectedTesterIdsCopy.findIndex((id) => id === testerId);
    if (index > -1) {
      selectedTesterIdsCopy.splice(index, 1);
      setSelectedTesterIds(selectedTesterIdsCopy);
      return;
    }
    setSelectedTesterIds([...selectedTesterIdsCopy, testerId]);
  };

  const isOwner = testing.creatorId === userId;

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerContent className="py-4">
        <div className="flex flex-col gap-4 overflow-y-auto max-h-[60vh]">
          {isOwner ? (
            <DrawerHeader>
              <DrawerTitle>Manage Testers</DrawerTitle>
              <DrawerTitle className="text-sm font-medium">
                View and remove testers from your tester call.
              </DrawerTitle>
            </DrawerHeader>
          ) : (
            <DrawerHeader>
              <DrawerTitle>View Testers</DrawerTitle>
              <DrawerTitle className="text-sm font-medium">
                View testers from this tester call.
              </DrawerTitle>
            </DrawerHeader>
          )}
          <div className="flex flex-col gap-4 overflow-y-auto">
            {testing.testers?.map((tester) => (
              <div className="flex justify-between items-center space-x-4" key={tester.id}>
                <Link href={`/users/${tester.id}`} className="flex items-center space-x-2">
                  <Avatar className="w-10 h-10">
                    <AvatarImage
                      src={tester.imageUrl}
                      alt={`${tester.firstName} ${tester.lastName}`}
                    />
                    <AvatarFallback>
                      {tester.firstName?.[0]}
                      {tester.lastName?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="text-md font-semibold line-clamp-1 break-all">
                      {tester.firstName} {tester.lastName}
                    </h2>
                    <p className="text-xs text-muted-foreground line-clamp-1 break-all">
                      @{tester.username}
                    </p>
                  </div>
                </Link>
                <div className="flex flex-row gap-2 items-center justify-end">
                  <FollowUserButton userId={tester.id} variant="icon-button" />
                  {isOwner ? (
                    <Button
                      variant={selectedTesterIds.includes(tester.id) ? 'destructive' : 'outline'}
                      size="icon"
                      onClick={() => handleTesterRemovableListClick(tester.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
          <DrawerFooter className="flex flex-col gap-2">
            <RequestStatus
              isSuccess={isSuccess}
              isError={isError}
              errorMessage={
                <>
                  Something went wrong while removing testers
                  {errorDetail ? `: ${errorDetail}` : ''}
                </>
              }
            />
            <Button
              onClick={() => {
                setIsOpen(false);
              }}
              variant={'outline'}
              disabled={isLoading}
            >
              {isOwner ? 'Cancel' : 'Go Back'}
            </Button>
            {isOwner ? (
              <Button
                onClick={() => handleRemoveTestersFromTestingClick(testing.id, selectedTesterIds)}
                variant={'destructive'}
                disabled={isLoading || selectedTesterIds.length === 0}
              >
                {isLoading ? <LoadingSpinnerComponent size="sm" className="text-white" /> : null}
                Delete Selected Testers
              </Button>
            ) : null}
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
