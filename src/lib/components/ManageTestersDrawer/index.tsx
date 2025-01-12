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

  const { mutate, isLoading, isError, errorDetail } = useRemoveUsersFromTesting();

  if (!testing?.testers || testing.testers.length === 0) {
    return null;
  }

  const handleRemoveTestersFromTestingClick = (testingId: string, testerIds: string[]) => {
    mutate(testingId, testerIds).then(() => {
      setIsOpen(false);
      window.location.reload();
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

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerContent className="p-4">
        <div className="mx-auto w-full max-w-sm flex flex-col gap-4 overflow-y-auto max-h-[60vh]">
          <DrawerHeader>
            <DrawerTitle>Manage Testers</DrawerTitle>
            <DrawerTitle className="text-sm font-medium">
              View and remove testers from your tester call.
            </DrawerTitle>
          </DrawerHeader>
          <div className="flex flex-col gap-4 overflow-y-auto">
            {testing.testers?.map((tester) => (
              <div className="flex justify-between items-center space-x-4" key={tester.id}>
                <Link href={`/users/${tester.id}`} className="flex items-center space-x-4">
                  <Avatar className="w-12 h-12">
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
                    <h2 className="text-lg font-semibold">
                      {tester.firstName} {tester.lastName}
                    </h2>
                    <p className="text-sm text-muted-foreground">@{tester.username}</p>
                  </div>
                </Link>
                <Button
                  variant={selectedTesterIds.includes(tester.id) ? 'destructive' : 'outline'}
                  size="icon"
                  onClick={() => handleTesterRemovableListClick(tester.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
          <DrawerFooter className="flex flex-col gap-2">
            {isError ? (
              <p className="text-red-500">
                Something went wrong while removing testers
                {errorDetail ? `: ${errorDetail}` : ''}
              </p>
            ) : null}
            <Button
              onClick={() => {
                setIsOpen(false);
              }}
              variant={'outline'}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={() => handleRemoveTestersFromTestingClick(testing.id, selectedTesterIds)}
              variant={'destructive'}
              disabled={isLoading || selectedTesterIds.length === 0}
            >
              {isLoading ? <LoadingSpinnerComponent size="sm" className="text-white" /> : null}
              Delete Selected Testers
            </Button>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
