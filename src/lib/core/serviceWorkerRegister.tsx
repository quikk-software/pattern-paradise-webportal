'use client';

import { useEffect } from 'react';
import logger from '@/lib/core/logger';

export default function ServiceWorkerRegister() {
  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    if ('serviceWorker' in window.navigator) {
      const registerServiceWorker = async () => {
        try {
          const registration = await window.navigator.serviceWorker.register('/sw.js');
          logger.log('Service Worker registered with scope:', registration.scope);
        } catch (error) {
          logger.error('Service Worker registration failed:', error);
        }
      };

      const registerFirebaseServiceWorker = async () => {
        try {
          const registration = await window.navigator.serviceWorker.register(
            '/firebase-messaging-sw.js',
          );
          logger.log('Firebase Messaging Service Worker registered:', registration.scope);
        } catch (error) {
          logger.error('Firebase Service Worker registration failed:', error);
        }
      };

      registerServiceWorker().then(() => registerFirebaseServiceWorker());
    }
  }, []);

  return null;
}
