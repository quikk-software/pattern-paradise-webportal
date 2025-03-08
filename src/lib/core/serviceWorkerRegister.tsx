'use client';

import { useEffect } from 'react';
import logger from '@/lib/core/logger';

export default function ServiceWorkerRegister() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js')
          .then((registration) => {
            logger.log('Service Worker registered with scope:', registration.scope);
          })
          .catch((error) => {
            logger.error('Service Worker registration failed:', error);
          });
        navigator.serviceWorker
          .register('/firebase-messaging-sw.js')
          .then((registration) => {
            logger.log('Service Worker registered:', registration.scope);
          })
          .catch((error) => {
            logger.error('Service Worker registration failed:', error);
          });
      });
    }
  }, []);

  return null;
}
