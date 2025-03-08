import { initializeApp } from 'firebase/app';
import { getMessaging, getToken } from 'firebase/messaging';
import logger from '@/lib/core/logger';

const firebaseConfig = {
  apiKey: 'YOUR_API_KEY',
  authDomain: 'YOUR_AUTH_DOMAIN',
  projectId: 'YOUR_PROJECT_ID',
  storageBucket: 'YOUR_STORAGE_BUCKET',
  messagingSenderId: 'YOUR_MESSAGING_SENDER_ID',
  appId: 'YOUR_APP_ID',
};

const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);

const isIOS = () => {
  return /iPad|iPhone|iPod/.test(navigator.userAgent);
};

export const getDeviceToken = async () => {
  try {
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      logger.log('Notification permission denied.');
      return null;
    }

    const token = await getToken(messaging, {
      vapidKey: 'YOUR_PUBLIC_VAPID_KEY',
    });

    if (token) {
      logger.log('Device Token:', token);
      return { token, platform: isIOS() ? 'ios' : 'android' };
    } else {
      logger.log('Failed to get device token.');
      return null;
    }
  } catch (error) {
    logger.error('Error getting device token:', error);
    return null;
  }
};
