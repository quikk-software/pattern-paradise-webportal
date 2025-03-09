'use client';

import React, { useState } from 'react';
import NotificationPreferences from '@/lib/components/NotificationPreferences';
import { Dialog, DialogContent } from '@/components/ui/dialog';

export default function NotificationPermissionProvider() {
  const [isDialogOpen, setIsDialogOpen] = useState(true);

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent>
        <NotificationPreferences disableCard={true} callback={(value) => setIsDialogOpen(value)} />
      </DialogContent>
    </Dialog>
  );
}
