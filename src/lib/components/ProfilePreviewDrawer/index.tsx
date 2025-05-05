'use client';

import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import UserDetailsCard from '@/lib/components/UserDetailsCard';
import { GetUserAccountResponse } from '@/@types/api-types';

interface ProfilePreviewDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  user: GetUserAccountResponse;
}

export function ProfilePreviewDrawer({ isOpen, onClose, user }: ProfilePreviewDrawerProps) {
  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent>
        <DrawerHeader className="text-center">
          <div className="absolute right-4 top-4">
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Button>
          </div>
          <DrawerTitle className="text-xl font-bold">Profile Preview</DrawerTitle>
        </DrawerHeader>

        <div className="pb-6 w-full">
          <UserDetailsCard user={user} showFlag={false} showRoles={false} hasProducts={false} />
        </div>
      </DrawerContent>
    </Drawer>
  );
}
