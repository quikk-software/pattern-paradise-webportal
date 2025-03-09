'use client';

import React from 'react';
import NotificationPreferences from '@/lib/components/NotificationPreferences';
import { useSelector } from 'react-redux';
import { Store } from '@/lib/redux/store';

export default function NotificationPermissionProvider() {
  const { userId } = useSelector((s: Store) => s.auth);

  if (!userId) {
    return null;
  }

  return <NotificationPreferences disableCard={true} />;
}
