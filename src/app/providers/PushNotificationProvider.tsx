'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import logger from '@/lib/core/logger';
import { useCreateDeviceToken } from '@/lib/api';
import { useSelector } from 'react-redux';
import { Store } from '@/lib/redux/store';

type PushNotification = {
  title?: string;
  body?: string;
  data?: any;
};

type PushNotificationContextType = {
  lastNotification: PushNotification | null;
  fcmToken: string | null;
};

const PushNotificationContext = createContext<PushNotificationContextType>({
  lastNotification: null,
  fcmToken: null,
});

export const PushNotificationProvider = ({ children }: { children: ReactNode }) => {
  const [lastNotification, setLastNotification] = useState<PushNotification | null>(null);
  const [fcmToken, setFcmToken] = useState<string | null>(null);

  const { mutate: postDeviceToken } = useCreateDeviceToken();

  const { userId } = useSelector((s: Store) => s.auth);

  useEffect(() => {
    if (!userId) {
      return;
    }

    // Listen for push notifications from the iOS WebView
    const handlePushNotification = (event: CustomEvent) => {
      logger.log('Received push notification from native app:', event.detail);
      setLastNotification(event.detail);

      // You can also show a toast/notification UI here
      // or trigger other app-specific behavior
    };

    // Listen for FCM token from the iOS WebView
    const handleFcmToken = (event: CustomEvent) => {
      logger.log('Received FCM token from native app:', event.detail.token);
      setFcmToken(event.detail.token);

      // You might want to send this token to your backend
      // to associate it with the current user
      if (event.detail.token) {
        sendTokenToBackend(userId, event.detail.token);
      }
    };

    // Add event listeners
    window.addEventListener('push-notification', handlePushNotification as EventListener);
    window.addEventListener('push-token', handleFcmToken as EventListener);

    // Clean up
    return () => {
      window.removeEventListener('push-notification', handlePushNotification as EventListener);
      window.removeEventListener('push-token', handleFcmToken as EventListener);
    };
  }, [userId]);

  // Function to send token to your backend
  const sendTokenToBackend = async (userId: string, token: string) => {
    try {
      await postDeviceToken(userId, {
        deviceToken: token,
        platform: 'IOS',
      });

      logger.log('Device token registered successfully');
    } catch (error) {
      logger.error('Error registering device token:', error);
    }
  };

  return (
    <PushNotificationContext.Provider value={{ lastNotification, fcmToken }}>
      {children}
    </PushNotificationContext.Provider>
  );
};

export const usePushNotification = () => useContext(PushNotificationContext);
