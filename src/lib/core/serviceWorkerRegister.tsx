'use client';

import { useEffect } from 'react';
import logger from '@/lib/core/logger';

export default function ServiceWorkerRegister() {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if ('serviceWorker' in window.navigator) {
        const registerMainServiceWorker = async () => {
          try {
            const registration = await window.navigator.serviceWorker.register('/sw.js');
            logger.log('Main Service Worker registered with scope:', registration.scope);
          } catch (error) {
            logger.error('Main Service Worker registration failed:', error);
          }
        };

        const registerFirebaseServiceWorker = async () => {
          try {
            const registration = await window.navigator.serviceWorker.register(
              '/firebase-messaging-sw.js',
            );
            logger.log('Firebase Service Worker registered with scope:', registration.scope);
          } catch (error) {
            logger.error('Firebase Service Worker registration failed:', error);
          }
        };

        registerMainServiceWorker().then(() => registerFirebaseServiceWorker());
      }
    }
  }, []);

  return null;
}
