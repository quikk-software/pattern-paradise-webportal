'use client';

import React, { useEffect } from 'react';
import { firebaseConfig, getDeviceToken } from '@/lib/notifications/device-token';
import { useStoreDeviceToken } from '@/lib/api';
import { useSelector } from 'react-redux';
import { Store } from '@/lib/redux/store';
import { initializeApp } from '@firebase/app';

export default function NotificationPermissionProvider() {
  const { mutate } = useStoreDeviceToken();

  const { userId } = useSelector((s: Store) => s.auth);

  useEffect(() => {
    if (!userId) {
      return;
    }
    Notification.requestPermission().then((permission) => {
      if (permission === 'granted') {
        getDeviceToken(initializeApp(firebaseConfig)).then((result) => {
          if (result?.token) {
            mutate(userId, {
              deviceToken: result.token,
              platform: result.platform,
            });
          }
        });
      }
    });
  }, [userId]);

  return <></>;
}
