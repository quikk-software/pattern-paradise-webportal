importScripts('https://www.gstatic.com/firebasejs/10.5.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.5.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: 'AIzaSyDZK-s64gEzXF8dsTP42w3T2rlD3OKgWpI',
  authDomain: 'pattern-paradise.firebaseapp.com',
  projectId: 'pattern-paradise',
  storageBucket: 'pattern-paradise.appspot.com',
  messagingSenderId: '608358089878',
  appId: '1:608358089878:web:3acc6039e99f44d86aeeb7',
  measurementId: 'G-DYG4Q4N3JJ',
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const notificationTitle =
    payload.data?.title || payload.notification?.title || 'Pattern Paradise';
  const notificationOptions = {
    body: payload.data?.body || payload.notification?.body || 'New Notification',
    icon: '/icons/main/256.png',
    data: { url: payload.data?.url || payload.notification?.url || '/' },
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const url = event.notification.data?.url || '/';

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url === url && 'focus' in client) {
          return client.focus();
        }
      }

      if (self.clients.openWindow) {
        return self.clients.openWindow(url);
      }
    }),
  );
});
