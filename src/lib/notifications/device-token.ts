'use client';

import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import logger from '@/lib/core/logger';
import { initializeApp, getApps, getApp } from '@firebase/app';

const firebaseConfig = {
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

const getFirebaseApp = () => {
  if (!getApps().length) {
    return initializeApp(firebaseConfig);
  }
  return getApp();
};

export const getDeviceToken = async () => {
  if (typeof window !== 'undefined') {
    try {
      const app = getFirebaseApp();
      const messaging = getMessaging(app);

      const permission = await window.Notification.requestPermission();
      if (permission !== 'granted') {
        logger.log('Notification permission denied.');
        localStorage.setItem('pushNotificationDenied', 'true');
        return null;
      }

      const token = await getToken(messaging, {
        vapidKey:
          'BLAuhDOnKtEgZoVeFR6KSqga0xt59mOseRP6QL-uOoEnv1nrozU_68MAIVO6wCDB8CZa33k94jgKcHUWrzDd51g',
      });

      if (token) {
        logger.log('Device Token:', token);

        return { token, platform: isIOS(window.navigator) ? 'IOS' : 'ANDROID' };
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

export const onMessageListener = () =>
  new Promise((resolve) => {
    const app = getFirebaseApp();
    const messaging = getMessaging(app);
    onMessage(messaging, (payload) => {
      console.log('Message received. ', payload);
      resolve(payload);
    });
  });
