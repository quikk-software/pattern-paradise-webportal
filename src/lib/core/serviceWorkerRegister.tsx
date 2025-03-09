'use client';

import { useEffect } from 'react';
import logger from '@/lib/core/logger';

export default function ServiceWorkerRegister() {
  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    if ('serviceWorker' in navigator) {
      const registerServiceWorker = async () => {
        try {
          const registration = await navigator.serviceWorker.register('/sw.js');
          logger.log('Service Worker registered with scope:', registration.scope);
        } catch (error) {
          console.log('Service Worker registration failed:', { error });
          logger.error('Service Worker registration failed:', error);
        }
      };

      const registerFirebaseServiceWorker = async () => {
        try {
          const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
          logger.log('Firebase Messaging Service Worker registered:', registration.scope);
        } catch (error) {
          console.log('Firebase Service Worker registration failed:', { error });
          logger.error('Firebase Service Worker registration failed:', error);
        }
      };

      window.addEventListener('load', () => {
        registerServiceWorker();
        setTimeout(registerFirebaseServiceWorker, 3000);
      });
    }
  }, []);

  return null;
}
