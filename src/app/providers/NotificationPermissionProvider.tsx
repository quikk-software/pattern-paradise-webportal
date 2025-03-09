'use client';

import React, { useState } from 'react';
import NotificationPreferences from '@/lib/components/NotificationPreferences';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useSelector } from 'react-redux';
import { Store } from '@/lib/redux/store';

export default function NotificationPermissionProvider() {
  const [isDialogOpen, setIsDialogOpen] = useState(true);

  const { userId } = useSelector((s: Store) => s.auth);

  if (!userId) {
    return null;
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent>
        <NotificationPreferences disableCard={true} callback={(value) => setIsDialogOpen(value)} />
      </DialogContent>
    </Dialog>
  );
}
