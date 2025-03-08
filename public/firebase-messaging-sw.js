import logger from '../src/lib/core/logger';

try {
  importScripts('https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js');
  importScripts('https://www.gstatic.com/firebasejs/9.6.1/firebase-messaging.js');

  firebase.initializeApp({
    apiKey: 'AIzaSyDZK-s64gEzXF8dsTP42w3T2rlD3OKgWpI',
    authDomain: 'pattern-paradise.firebaseapp.com',
    projectId: 'pattern-paradise',
    storageBucket: 'pattern-paradise.firebasestorage.app',
    messagingSenderId: '608358089878',
    appId: '1:608358089878:web:3acc6039e99f44d86aeeb7',
    measurementId: 'G-DYG4Q4N3JJ',
  });

  const messaging = firebase.messaging();

  messaging.onBackgroundMessage((payload) => {
    self.registration.showNotification(payload.notification.title, {
      body: payload.notification.body,
      icon: 'https://pattern-paradise.shop/icons/main/256.png',
    });
  });
} catch (err) {
  logger.error('Initializing firebase messaging failed:', err);
}
