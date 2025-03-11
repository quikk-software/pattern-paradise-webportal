'use client';

import { useEffect } from 'react';
import logger from '@/lib/core/logger';
import { onMessageListener } from '@/lib/notifications/device-token';

export default function ServiceWorkerRegister() {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if ('serviceWorker' in window.navigator) {
        const registerMainServiceWorker = async () => {
          try {
            const registration = await window.navigator.serviceWorker.register(
              '/firebase-messaging-sw.js',
            );
            logger.log('Main Service Worker registered with scope:', registration.scope);
          } catch (error) {
            logger.error('Main Service Worker registration failed:', error);
          }
        };

        registerMainServiceWorker();

        onMessageListener()
          .then((payload: any) => {
            console.log('Message received in foreground: ', payload);
            alert(`New message: ${payload?.notification?.title}`);
          })
          .catch((err) => console.error('Message listener error:', err));
      }
    }
  }, []);

  return null;
}
