'use client';

import { FirebaseApp } from 'firebase/app';
import { getMessaging, getToken } from 'firebase/messaging';
import logger from '@/lib/core/logger';

export const firebaseConfig = {
  apiKey: 'AIzaSyDZK-s64gEzXF8dsTP42w3T2rlD3OKgWpI',
  authDomain: 'pattern-paradise.firebaseapp.com',
  projectId: 'pattern-paradise',
  storageBucket: 'pattern-paradise.appspot.com',
  messagingSenderId: '608358089878',
  appId: '1:608358089878:web:3acc6039e99f44d86aeeb7',
  measurementId: 'G-DYG4Q4N3JJ',
};

const isIOS = (navigator: Navigator) => {
  return /iPad|iPhone|iPod/.test(navigator.userAgent);
};

export const getDeviceToken = async (app: FirebaseApp) => {
  if (typeof window !== 'undefined') {
    try {
      const messaging = getMessaging(app);
      const permission = await window.Notification.requestPermission();
      if (permission !== 'granted') {
        logger.log('Notification permission denied.');
        return null;
      }

      const token = await getToken(messaging, {
        vapidKey:
          'BOXmZ_Hwa4Aqm9t4EIqFLoktOdvLwR0CBrS3vzleKZPemlcKwkSK3T3ZRqaP34sysWTSOvkqxHNm9Z9CmjZE6XA',
      });

      if (token) {
        logger.log('Device Token:', token);
        return { token, platform: isIOS(window.navigator) ? 'ios' : 'android' };
      } else {
        logger.log('Failed to get device token.');
        return null;
      }
    } catch (error) {
      logger.error('Error getting device token:', error);
      return null;
    }
  }
};
