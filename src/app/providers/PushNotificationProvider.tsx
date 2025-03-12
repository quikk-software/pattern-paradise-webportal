'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import logger from '@/lib/core/logger';
import { useCreateDeviceToken } from '@/lib/api';
import { toast } from 'sonner';
import { THEME_COLOR } from '@/lib/constants';
import { useRouter } from 'next/navigation';

type PushNotification = {
  title?: string;
  body?: string;
  data?: any;
};

type PushNotificationContextType = {
  lastNotification: PushNotification | null;
  fcmToken: string | null;
  sendTokenToBackend: ((userId: string, token: string) => void) | null;
};

const PushNotificationContext = createContext<PushNotificationContextType>({
  lastNotification: null,
  fcmToken: null,
  sendTokenToBackend: null,
});

export const PushNotificationProvider = ({ children }: { children: ReactNode }) => {
  const [lastNotification, setLastNotification] = useState<PushNotification | null>(null);
  const [fcmToken, setFcmToken] = useState<string | null>(null);

  const { mutate: postDeviceToken } = useCreateDeviceToken();

  const router = useRouter();

  useEffect(() => {
    const handlePushNotification = (event: CustomEvent) => {
      logger.log('Received push notification from native app:', event.detail);
      setLastNotification(event.detail);

      if (!event.detail.url) {
        toast(event.detail.title, {
          description: event.detail.body,
          style: {
            backgroundColor: THEME_COLOR,
            color: 'white',
          },
          position: 'top-center',
        });
        return;
      }
      router.push(event.detail.url);
    };

    // Listen for FCM token from the iOS WebView
    const handleFcmToken = (event: CustomEvent) => {
      logger.log(`Received FCM token from native app: ${event.detail}`);
      setFcmToken(event.detail);
    };

    // Add event listeners
    window.addEventListener('push-notification', handlePushNotification as EventListener);
    window.addEventListener('push-token', handleFcmToken as EventListener);

    // Clean up
    return () => {
      window.removeEventListener('push-notification', handlePushNotification as EventListener);
      window.removeEventListener('push-token', handleFcmToken as EventListener);
    };
  }, []);

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
    <PushNotificationContext.Provider value={{ lastNotification, fcmToken, sendTokenToBackend }}>
      {children}
    </PushNotificationContext.Provider>
  );
};

export const usePushNotification = () => useContext(PushNotificationContext);
